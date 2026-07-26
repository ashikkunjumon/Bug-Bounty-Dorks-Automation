/* Bug-Bounty Dorks Automation - application logic.
 * Depends on data.js being loaded first.
 *
 * Two modes:
 *   target   - dorks scoped to a single domain
 *   programs - dorks that find organisations running disclosure programmes
 */

var MODES = ['target', 'programs'];
var currentMode = 'target';
var suppressHashRead = false;

// normalizing
/**
 * Reduce anything a user might paste - a full URL, a host:port, a wildcard
 * scope line - down to a bare registrable hostname.
 */
function normalizeDomain(raw) {
  var d = String(raw == null ? '' : raw).trim();
  if (!d) return '';

  d = d.replace(/^[a-zA-Z][a-zA-Z0-9+.\-]*:\/\//, ''); // scheme
  d = d.replace(/^[^@\/]*@/, '');                      // user:pass@
  d = d.split(/[\/?#]/)[0];                            // path, query, fragment
  d = d.replace(/:\d+$/, '');                          // port
  d = d.toLowerCase();
  d = d.replace(/^\*+\./, '');                         // leading *.
  d = d.replace(/^\.+/, '').replace(/\.+$/, '');       // stray dots

  return d;
}

function isValidDomain(d) {
  if (!d || d.length > 253) return false;
  return /^([a-z0-9](?:[a-z0-9\-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/.test(d);
}

// query building
/** Build the `site:` scope token, honouring the wildcard and exclude options. */
function buildScope(domain, wildcard, excludeWww) {
  var scope = wildcard ? 'site:*.' + domain : 'site:' + domain;
  if (excludeWww) scope += ' -site:www.' + domain;
  return scope;
}

/** Swap pipes for the alternation token the chosen engine understands. */
function applyOrSyntax(query, engine) {
  if (engine.or === '|') return query;
  return query.replace(/ \| /g, ' ' + engine.or + ' ');
}

/**
 * {site}/{scope} take the scope token; {domain} takes the bare hostname, for
 * off-site dorks that search third-party hosts for mentions of the target.
 */
function buildQuery(template, scope, engine, domain) {
  var q = template
    .replace(/\{site\}/g, scope)
    .replace(/\{scope\}/g, scope)
    .replace(/\{domain\}/g, domain || '');
  // A blank {scope} leaves a leading gap; collapse before handing it over.
  q = q.replace(/\s+/g, ' ').trim();
  // Rewrite operators the engine cannot honour before fixing alternation,
  // otherwise a stripped operator can leave a stray token beside an OR.
  q = translateOperators(q, engine);
  return applyOrSyntax(q, engine);
}

function searchUrl(query, engine) {
  return engine.url + encodeURIComponent(query);
}

function selectedEngine() {
  return ENGINES[document.getElementById('engine').value] || ENGINES.google;
}

/** Target-mode dork list as {category, query} pairs. */
function buildTargetQueries(domain, engine, wildcard, excludeWww) {
  var scope = buildScope(domain, wildcard, excludeWww);
  return TARGET_DORKS.map(function (d) {
    return { category: d.category, query: buildQuery(d.dork, scope, engine, domain) };
  });
}

/**
 * Drop language dorks that cannot match the chosen region. Searching .jp for
 * German phrases returns nothing, so those rows are noise rather than reach.
 * With no region selected every language stays in.
 */
function relevantProgramDorks(region) {
  if (!region) return PROGRAM_DORKS;

  var languages = REGION_LANGUAGES[region] || [];
  return PROGRAM_DORKS.filter(function (d) {
    return !d.label || languages.indexOf(d.label) !== -1;
  });
}

/** Program-mode dork list. An empty region means no site: constraint. */
function buildProgramQueries(region, engine) {
  var scope = region ? 'site:*.' + region : '';
  return relevantProgramDorks(region).map(function (d) {
    return { category: d.category, label: d.label, query: buildQuery(d.dork, scope, engine) };
  });
}

// clipboard
function copyText(text, button) {
  var done = function (ok) {
    var original = button.getAttribute('data-label') || button.textContent;
    button.setAttribute('data-label', original);
    button.textContent = ok ? 'Copied' : 'Failed';
    button.classList.toggle('copied', ok);
    setTimeout(function () {
      button.textContent = original;
      button.classList.remove('copied');
    }, 1200);
  };

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); });
    return;
  }

  // Fallback for non-secure contexts, where the async clipboard API is absent.
  var ta = document.createElement('textarea');
  ta.value = text;
  ta.setAttribute('readonly', '');
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  var ok = false;
  try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
  document.body.removeChild(ta);
  done(ok);
}

// rendering
function resultsEl() {
  return document.getElementById('results');
}

function renderError(message) {
  var results = resultsEl();
  results.innerHTML = '';
  var p = document.createElement('p');
  p.className = 'error';
  p.textContent = message;
  results.appendChild(p);
}

function renderHint(message) {
  var results = resultsEl();
  results.innerHTML = '';
  var p = document.createElement('p');
  p.className = 'hint';
  p.textContent = message;
  results.appendChild(p);
}

/** Chip-list panel, shared by recon pivots and programme directories. */
function renderLinkPanel(title, items, replacement) {
  var section = document.createElement('section');
  section.className = 'panel';

  var h2 = document.createElement('h2');
  h2.textContent = title;
  section.appendChild(h2);

  var list = document.createElement('div');
  list.className = 'pivots';

  items.forEach(function (item) {
    var a = document.createElement('a');
    a.className = 'pivot';
    a.href = replacement ? item.url.replace(/\{d\}/g, replacement) : item.url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.textContent = item.name;
    list.appendChild(a);
  });

  section.appendChild(list);
  return section;
}

/**
 * Dork panel. Entries carrying repeated category names are grouped under a
 * single heading, so programme mode reads as sections rather than 32 rows.
 */
function renderDorkPanel(entries, engine, heading) {
  var section = document.createElement('section');
  section.className = 'panel';

  var header = document.createElement('div');
  header.className = 'panel-header';

  var h2 = document.createElement('h2');
  h2.textContent = heading;
  header.appendChild(h2);

  var copyAll = document.createElement('button');
  copyAll.type = 'button';
  copyAll.className = 'copy-btn copy-all';
  copyAll.textContent = 'Copy all';
  copyAll.addEventListener('click', function () {
    copyText(entries.map(function (e) { return e.query; }).join('\n'), copyAll);
  });
  header.appendChild(copyAll);

  section.appendChild(header);

  var lastCategory = null;
  entries.forEach(function (entry) {
    var card = document.createElement('div');
    card.className = 'category';

    if (entry.category !== lastCategory) {
      var row = document.createElement('div');
      row.className = 'category-header';

      var h4 = document.createElement('h4');
      h4.textContent = entry.category;
      row.appendChild(h4);

      card.appendChild(row);
      lastCategory = entry.category;
    }

    var line = document.createElement('div');
    line.className = 'dork-row';

    // Optional badge, used to name the language on non-English dorks.
    if (entry.label) {
      var badge = document.createElement('span');
      badge.className = 'dork-label';
      badge.textContent = entry.label;
      line.appendChild(badge);
    }

    var a = document.createElement('a');
    a.className = 'dork';
    // Without this, RTL phrases reorder the surrounding intext:"..." syntax
    // and the operators read scrambled. The RTL run itself stays correct.
    a.setAttribute('dir', 'ltr');
    a.href = searchUrl(entry.query, engine);
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.textContent = entry.query;
    a.title = 'Search ' + engine.name + ' for: ' + entry.query;
    line.appendChild(a);

    var copy = document.createElement('button');
    copy.type = 'button';
    copy.className = 'copy-btn';
    copy.textContent = 'Copy';
    copy.setAttribute('aria-label', 'Copy dork: ' + entry.query);
    copy.addEventListener('click', function () { copyText(entry.query, copy); });
    line.appendChild(copy);

    card.appendChild(line);
    section.appendChild(card);
  });

  return section;
}

// mode: target
function runTargetMode() {
  var raw = document.getElementById('domain').value;
  var domain = normalizeDomain(raw);

  if (!domain) {
    renderError('Enter a target domain, e.g. example.com');
    return;
  }
  if (!isValidDomain(domain)) {
    renderError('"' + raw.trim() + '" is not a valid domain. Try example.com');
    return;
  }

  var engine = selectedEngine();
  var entries = buildTargetQueries(
    domain,
    engine,
    document.getElementById('wildcard').checked,
    document.getElementById('exclude-www').checked
  );

  var results = resultsEl();
  results.innerHTML = '';
  results.appendChild(renderLinkPanel('Recon pivots', RECON, encodeURIComponent(domain)));
  results.appendChild(renderDorkPanel(entries, engine, entries.length + ' dorks · ' + engine.name));

  writeHash('target', domain, engine);
}

// mode: programs
function runProgramMode() {
  var region = document.getElementById('region').value;
  var engine = selectedEngine();
  var entries = buildProgramQueries(region, engine);

  var label = entries.length + ' program dorks · ' + engine.name;
  if (region) label += ' · .' + region;

  var results = resultsEl();
  results.innerHTML = '';
  results.appendChild(renderLinkPanel('Program directories', DIRECTORIES, null));
  results.appendChild(renderDorkPanel(entries, engine, label));

  writeHash('programs', region, engine);
}

/** Programme mode needs no required input, so it renders on activation. */
function refresh() {
  if (currentMode === 'programs') {
    runProgramMode();
  } else if (resultsEl().children.length) {
    runTargetMode();
  }
}

// mode routing
function setMode(mode, options) {
  if (MODES.indexOf(mode) === -1) mode = 'target';
  currentMode = mode;

  MODES.forEach(function (m) {
    var tab = document.getElementById('tab-' + m);
    var panel = document.getElementById('panel-' + m);
    var active = m === mode;

    tab.classList.toggle('active', active);
    tab.setAttribute('aria-selected', active ? 'true' : 'false');
    tab.setAttribute('tabindex', active ? '0' : '-1');
    panel.hidden = !active;
  });

  document.getElementById('note-target').hidden = mode !== 'target';
  document.getElementById('note-programs').hidden = mode !== 'programs';

  if (mode === 'programs') {
    runProgramMode();
  } else {
    resultsEl().innerHTML = '';
    renderHint('Enter a target domain to generate dorks and recon pivots.');
    if (!options || !options.silent) writeHash('target', '', selectedEngine());
  }
}

// hash routing
// #<mode>/<param>/<engine> - param is a domain or a region, both optional.
function writeHash(mode, param, engine) {
  var parts = [mode];
  if (param) parts.push(param);
  if (engine && engine !== ENGINES.google) {
    if (!param) parts.push('');
    parts.push(engineKey(engine));
  }
  suppressHashRead = true;
  location.hash = parts.join('/');
  setTimeout(function () { suppressHashRead = false; }, 0);
}

function engineKey(engine) {
  var found = 'google';
  Object.keys(ENGINES).forEach(function (k) {
    if (ENGINES[k] === engine) found = k;
  });
  return found;
}

function readHash() {
  var raw = location.hash.replace(/^#/, '');
  if (!raw) return null;

  var parts = raw.split('/');
  var mode = MODES.indexOf(parts[0]) !== -1 ? parts[0] : 'target';
  var param = parts[1] ? decodeURIComponent(parts[1]) : '';
  var engine = parts[2] && ENGINES[parts[2]] ? parts[2] : null;

  return { mode: mode, param: param, engine: engine };
}

function applyHash() {
  var state = readHash();
  if (!state) {
    setMode('target', { silent: true });
    return;
  }

  if (state.engine) document.getElementById('engine').value = state.engine;

  if (state.mode === 'programs') {
    var region = document.getElementById('region');
    // Only accept a region the picker actually offers.
    var valid = Array.prototype.some.call(region.options, function (o) {
      return o.value === state.param;
    });
    region.value = valid ? state.param : '';
    setMode('programs');
    return;
  }

  setMode('target', { silent: true });
  if (state.param) {
    document.getElementById('domain').value = state.param;
    runTargetMode();
  }
}

// startup
function populateRegions() {
  var select = document.getElementById('region');

  var any = document.createElement('option');
  any.value = '';
  any.textContent = 'Any region';
  select.appendChild(any);

  REGIONS.forEach(function (group) {
    var og = document.createElement('optgroup');
    og.label = group.group;
    group.items.forEach(function (item) {
      var opt = document.createElement('option');
      opt.value = item.value;
      opt.textContent = item.label;
      og.appendChild(opt);
    });
    select.appendChild(og);
  });
}

/** Left/right arrows move between tabs, per the ARIA tabs pattern. */
function onTabKeydown(event) {
  var index = MODES.indexOf(currentMode);
  var next = null;

  if (event.key === 'ArrowRight') next = MODES[(index + 1) % MODES.length];
  else if (event.key === 'ArrowLeft') next = MODES[(index - 1 + MODES.length) % MODES.length];
  else if (event.key === 'Home') next = MODES[0];
  else if (event.key === 'End') next = MODES[MODES.length - 1];

  if (next) {
    event.preventDefault();
    setMode(next);
    document.getElementById('tab-' + next).focus();
  }
}

document.addEventListener('DOMContentLoaded', function () {
  populateRegions();

  MODES.forEach(function (m) {
    var tab = document.getElementById('tab-' + m);
    tab.addEventListener('click', function () { setMode(m); });
    tab.addEventListener('keydown', onTabKeydown);
  });

  document.getElementById('dork-form').addEventListener('submit', function (event) {
    event.preventDefault(); // keeps Enter from navigating away
    runTargetMode();
  });

  ['wildcard', 'exclude-www'].forEach(function (id) {
    document.getElementById(id).addEventListener('change', refresh);
  });

  document.getElementById('region').addEventListener('change', runProgramMode);
  document.getElementById('engine').addEventListener('change', function () {
    showEngineNote();
    refresh();
  });

  window.addEventListener('hashchange', function () {
    if (!suppressHashRead) applyHash();
  });

  showEngineNote();
  applyHash();
});
