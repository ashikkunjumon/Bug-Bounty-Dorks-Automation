/* Search engines and per-engine query translation.
 *
 * The dork set is written in Google syntax. Other engines support a subset,
 * and sending them an operator they do not implement returns nothing at all -
 * worse than a broader query. Each engine therefore declares how to rewrite
 * the operators it cannot handle.
 *
 * `or`     alternation token: Google and Yandex read `|`, the rest need `OR`.
 * `ops`    per-operator rule:
 *            'strip'      drop the operator, keep the value as a search term
 *            'mime'       Yandex's file-type operator, for its supported types
 *            '<name>'     rename the operator
 * `note`   fidelity warning shown under the picker, null when native.
 */

var ENGINES = {
  google: {
    name: 'Google',
    url: 'https://www.google.com/search?q=',
    or: '|',
    ops: {},
    note: null
  },

  // Startpage proxies Google, so the full operator set survives.
  startpage: {
    name: 'Startpage',
    url: 'https://www.startpage.com/sp/search?query=',
    or: '|',
    ops: {},
    note: null
  },

  duckduckgo: {
    name: 'DuckDuckGo',
    url: 'https://duckduckgo.com/?q=',
    or: 'OR',
    ops: { intext: 'strip' },
    note: 'No intext: support - those phrases are searched as plain text.'
  },

  brave: {
    name: 'Brave',
    url: 'https://search.brave.com/search?q=',
    or: 'OR',
    ops: { intext: 'strip' },
    note: 'No intext: support - those phrases are searched as plain text.'
  },

  // Microsoft suspended inurl: in 2007 and never implemented intext:.
  bing: {
    name: 'Bing',
    url: 'https://www.bing.com/search?q=',
    or: 'OR',
    ops: { intext: 'strip', inurl: 'strip' },
    note: 'Bing dropped inurl: and has no intext:, so URL and body filters become plain terms.'
  },

  // Yandex uses its own operator language: site:, mime:, and little else that
  // maps cleanly. Everything unsupported degrades to a quoted term.
  yandex: {
    name: 'Yandex',
    url: 'https://yandex.com/search/?text=',
    or: '|',
    ops: { intext: 'strip', inurl: 'strip', intitle: 'strip', filetype: 'mime' },
    note: 'Yandex supports only site: and mime:; other filters become plain terms.'
  }
};

// The only file types Yandex's mime: operator recognises.
var YANDEX_MIME = ['html', 'pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'rtf', 'swf'];

var OPERATOR_RE = /(-?)\b(site|inurl|intext|intitle|filetype):("[^"]*"|\S+)/g;

/** Quote a stripped value when it holds punctuation, to keep it one term. */
function quoteTerm(value) {
  if (value.charAt(0) === '"') return value;
  return /[\/.=:&?]/.test(value) ? '"' + value + '"' : value;
}

/**
 * Rewrite a Google-syntax query into what the chosen engine understands.
 * Google and Startpage pass through untouched.
 */
function translateOperators(query, engine) {
  var rules = engine.ops;
  if (!rules) return query;

  var hasRule = false;
  for (var k in rules) { if (rules.hasOwnProperty(k)) { hasRule = true; break; } }
  if (!hasRule) return query;

  return query.replace(OPERATOR_RE, function (match, negation, operator, value) {
    var rule = rules[operator];
    if (!rule) return match;

    if (rule === 'strip') return negation + quoteTerm(value);

    if (rule === 'mime') {
      var bare = value.replace(/"/g, '');
      return YANDEX_MIME.indexOf(bare) !== -1
        ? negation + 'mime:' + bare
        : negation + quoteTerm(value);
    }

    return negation + rule + ':' + value;
  });
}

/** Surface how faithfully the chosen engine can run Google-syntax dorks. */
function showEngineNote() {
  var note = document.getElementById('engine-note');
  var text = selectedEngine().note;
  note.textContent = text || '';
  note.hidden = !text;
}
