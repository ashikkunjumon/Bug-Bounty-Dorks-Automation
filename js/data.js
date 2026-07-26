/* Region data. Loaded before the dork sets and app.js. */

/* Region picker. Folding .edu/.gov in here means one mechanism covers
 * sector scoping and country scoping instead of duplicating dork rows. */
var REGIONS = [
  {
    group: 'Sector',
    items: [
      { value: 'edu', label: 'Education (.edu)' },
      { value: 'gov', label: 'Government (.gov)' },
      { value: 'mil', label: 'Military (.mil)' },
      { value: 'int', label: 'International orgs (.int)' }
    ]
  },
  {
    group: 'Europe',
    items: [
      { value: 'nl', label: 'Netherlands (.nl)' },
      { value: 'uk', label: 'United Kingdom (.uk)' },
      { value: 'de', label: 'Germany (.de)' },
      { value: 'fr', label: 'France (.fr)' },
      { value: 'es', label: 'Spain (.es)' },
      { value: 'it', label: 'Italy (.it)' },
      { value: 'be', label: 'Belgium (.be)' },
      { value: 'ch', label: 'Switzerland (.ch)' },
      { value: 'at', label: 'Austria (.at)' },
      { value: 'se', label: 'Sweden (.se)' },
      { value: 'no', label: 'Norway (.no)' },
      { value: 'dk', label: 'Denmark (.dk)' },
      { value: 'fi', label: 'Finland (.fi)' },
      { value: 'pl', label: 'Poland (.pl)' },
      { value: 'pt', label: 'Portugal (.pt)' },
      { value: 'ie', label: 'Ireland (.ie)' },
      { value: 'cz', label: 'Czechia (.cz)' },
      { value: 'hu', label: 'Hungary (.hu)' },
      { value: 'ro', label: 'Romania (.ro)' },
      { value: 'gr', label: 'Greece (.gr)' },
      { value: 'ua', label: 'Ukraine (.ua)' },
      { value: 'ru', label: 'Russia (.ru)' },
      { value: 'eu', label: 'European Union (.eu)' }
    ]
  },
  {
    group: 'Americas',
    items: [
      { value: 'us', label: 'United States (.us)' },
      { value: 'ca', label: 'Canada (.ca)' },
      { value: 'br', label: 'Brazil (.br)' },
      { value: 'mx', label: 'Mexico (.mx)' },
      { value: 'ar', label: 'Argentina (.ar)' },
      { value: 'cl', label: 'Chile (.cl)' },
      { value: 'co', label: 'Colombia (.co)' }
    ]
  },
  {
    group: 'Asia-Pacific',
    items: [
      { value: 'in', label: 'India (.in)' },
      { value: 'jp', label: 'Japan (.jp)' },
      { value: 'cn', label: 'China (.cn)' },
      { value: 'sg', label: 'Singapore (.sg)' },
      { value: 'au', label: 'Australia (.au)' },
      { value: 'nz', label: 'New Zealand (.nz)' },
      { value: 'kr', label: 'South Korea (.kr)' },
      { value: 'id', label: 'Indonesia (.id)' },
      { value: 'my', label: 'Malaysia (.my)' },
      { value: 'th', label: 'Thailand (.th)' },
      { value: 'ph', label: 'Philippines (.ph)' },
      { value: 'vn', label: 'Vietnam (.vn)' },
      { value: 'hk', label: 'Hong Kong (.hk)' },
      { value: 'tw', label: 'Taiwan (.tw)' }
    ]
  },
  {
    group: 'Africa & Middle East',
    items: [
      { value: 'za', label: 'South Africa (.za)' },
      { value: 'ng', label: 'Nigeria (.ng)' },
      { value: 'ke', label: 'Kenya (.ke)' },
      { value: 'eg', label: 'Egypt (.eg)' },
      { value: 'ae', label: 'UAE (.ae)' },
      { value: 'sa', label: 'Saudi Arabia (.sa)' },
      { value: 'il', label: 'Israel (.il)' },
      { value: 'tr', label: 'Turkey (.tr)' }
    ]
  }
];

/* Which languages are actually worth searching for in each region.
 *
 * Without this, choosing .jp would still emit the German and Spanish dorks
 * scoped to site:*.jp - queries that cannot match anything. A region absent
 * from this map is treated as English-speaking, and the non-English dorks are
 * dropped for it entirely rather than generating dead queries.
 */
var REGION_LANGUAGES = {
  // Europe
  de: ['German'],
  at: ['German'],
  ch: ['German', 'French', 'Italian'],
  fr: ['French'],
  be: ['Dutch', 'French'],
  nl: ['Dutch'],
  es: ['Spanish'],
  it: ['Italian'],
  pt: ['Portuguese'],
  se: ['Swedish'],
  no: ['Norwegian'],
  dk: ['Danish'],
  fi: ['Finnish'],
  pl: ['Polish'],
  cz: ['Czech'],
  hu: ['Hungarian'],
  ro: ['Romanian'],
  gr: ['Greek'],
  ua: ['Ukrainian', 'Russian'],
  ru: ['Russian'],
  // The .eu space is multilingual, so keep the European set.
  eu: ['German', 'French', 'Spanish', 'Italian', 'Portuguese', 'Dutch', 'Swedish',
       'Norwegian', 'Danish', 'Finnish', 'Polish', 'Czech', 'Hungarian', 'Romanian', 'Greek'],

  // Americas
  ca: ['French'],
  br: ['Portuguese'],
  mx: ['Spanish'],
  ar: ['Spanish'],
  cl: ['Spanish'],
  co: ['Spanish'],

  // Asia-Pacific
  jp: ['Japanese'],
  cn: ['Chinese'],
  tw: ['Chinese'],
  hk: ['Chinese'],
  kr: ['Korean'],
  th: ['Thai'],
  vn: ['Vietnamese'],
  id: ['Indonesian'],
  my: ['Indonesian'],

  // Africa & Middle East
  il: ['Hebrew'],
  ae: ['Arabic'],
  sa: ['Arabic'],
  eg: ['Arabic'],
  tr: ['Turkish']
};
