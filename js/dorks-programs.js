/* Program-mode dorks: find organisations running a disclosure programme.
 *
 * {scope} -> `site:*.<tld>` when a region is chosen, otherwise nothing.
 *            Whitespace is collapsed afterwards so both forms stay valid.
 */

var PROGRAM_DORKS = [
  // disclosure policy pages
  { category: 'Disclosure pages', dork: '{scope} inurl:/responsible-disclosure intext:reward' },
  { category: 'Disclosure pages', dork: '{scope} inurl:/vulnerability-disclosure-policy' },
  { category: 'Disclosure pages', dork: '{scope} intitle:"Responsible Disclosure" OR intitle:"Vulnerability Disclosure"' },
  { category: 'Disclosure pages', dork: '{scope} intext:"If you believe you have found a security vulnerability"' },
  { category: 'Disclosure pages', dork: '{scope} inurl:/report-a-vulnerability OR inurl:/reporting-security-issues' },
  { category: 'Disclosure pages', dork: '{scope} inurl:/security intext:"report a vulnerability" intext:contact' },
  { category: 'Disclosure pages', dork: '{scope} intext:"we take security very seriously" intext:report' },
  { category: 'Disclosure pages', dork: '{scope} intext:"coordinated vulnerability disclosure"' },
  { category: 'Disclosure pages', dork: '{scope} inurl:/security/report-issue OR inurl:/vulnerability-report OR inurl:/report-security-issue' },

  // security.txt (RFC 9116)
  { category: 'security.txt', dork: '{scope} inurl:/.well-known/security.txt intext:"Contact:"' },
  { category: 'security.txt', dork: '{scope} inurl:/.well-known/security.txt intext:bounty' },
  { category: 'security.txt', dork: '{scope} inurl:/.well-known/security.txt intext:"Policy:" intext:"Expires:"' },
  { category: 'security.txt', dork: '{scope} inurl:/.well-known/security.txt intext:"Acknowledgments:"' },
  { category: 'security.txt', dork: '{scope} inurl:/.well-known/security.txt intext:"Encryption:" OR intext:"Hiring:"' },
  { category: 'security.txt', dork: '{scope} inurl:security.txt intext:"Contact:" -site:github.com -site:wikipedia.org' },

  // platform fingerprints
  { category: 'Platform fingerprints', dork: '{scope} intext:"powered by HackerOne" -site:hackerone.com' },
  { category: 'Platform fingerprints', dork: '{scope} intext:"powered by Bugcrowd" -site:bugcrowd.com' },
  { category: 'Platform fingerprints', dork: '{scope} intext:"powered by Intigriti" -site:intigriti.com' },
  { category: 'Platform fingerprints', dork: '{scope} intext:"powered by YesWeHack" -site:yeswehack.com' },
  { category: 'Platform fingerprints', dork: '{scope} intext:"powered by Synack" OR intext:"powered by Federacy"' },
  { category: 'Platform fingerprints', dork: '{scope} intext:"powered by HackenProof" OR intext:"powered by Immunefi"' },
  { category: 'Platform fingerprints', dork: '{scope} intext:"powered by Zerocopter" OR intext:"zerocopter.com" -site:zerocopter.com' },
  { category: 'Platform fingerprints', dork: '{scope} intext:"GoBugFree" OR intext:"gobugfree.com" -site:gobugfree.com' },
  { category: 'Platform fingerprints', dork: '{scope} intext:"Bug Bounty Switzerland" OR intext:"bugbounty.ch" -site:bugbounty.ch' },
  { category: 'Platform fingerprints', dork: '{scope} intext:"powered by Secuna" OR intext:"secuna.io" -site:secuna.io' },
  { category: 'Platform fingerprints', dork: '{scope} intext:"disclose.io" inurl:/security' },
  { category: 'Platform fingerprints', dork: '{scope} inurl:/hackerone.yml -site:hackerone.com' },
  { category: 'Platform fingerprints', dork: '{scope} inurl:/bug-bounty.json OR inurl:/vdp.json OR inurl:/.well-known/disclose.json' },
  { category: 'Platform fingerprints', dork: '{scope} intext:"managed by huntr.dev" OR intext:"huntr.com/bounties"' },

  // reward language
  { category: 'Reward language', dork: '{scope} intext:"eligible for a reward" inurl:/security' },
  { category: 'Reward language', dork: '{scope} intext:"hall of fame" intext:"responsible disclosure"' },
  { category: 'Reward language', dork: '{scope} intext:"we offer a bounty" OR intext:"we run a bug bounty program"' },
  { category: 'Reward language', dork: '{scope} intext:"monetary compensation" intext:"security vulnerability"' },
  { category: 'Reward language', dork: '{scope} intext:swag intext:"responsible disclosure"' },
  { category: 'Reward language', dork: '{scope} intitle:"Bug Bounty Program" OR intitle:"Security Rewards"' },
  { category: 'Reward language', dork: '{scope} intext:"bug bounty" intext:CVSS -site:hackerone.com -site:bugcrowd.com' },
  { category: 'Reward language', dork: '{scope} intext:"rewards range" OR intext:"up to $" intext:"bug bounty"' },
  { category: 'Reward language', dork: '{scope} intext:"launched our bug bounty" OR intext:"our new bug bounty program"' },

  // acknowledgement pages
  { category: 'Hall of fame', dork: '{scope} inurl:/security/thanks OR inurl:/security/acknowledgments' },
  { category: 'Hall of fame', dork: '{scope} inurl:/hall-of-fame intext:security' },
  { category: 'Hall of fame', dork: '{scope} intext:"we would like to thank the following security researchers"' },
  { category: 'Hall of fame', dork: '{scope} intitle:"Security Researchers" OR intitle:"Security Acknowledgements"' },

  // policy documents
  { category: 'Policy documents', dork: '{scope} inurl:/legal/security intext:reward' },
  { category: 'Policy documents', dork: '{scope} inurl:/trust/report-a-vulnerability' },
  { category: 'Policy documents', dork: '{scope} inurl:/security-policy filetype:txt' },
  { category: 'Policy documents', dork: '{scope} filetype:pdf "vulnerability disclosure policy"' },

  // safe harbour
  { category: 'Safe harbour', dork: '{scope} intext:"safe harbor" intext:"security research"' },
  { category: 'Safe harbour', dork: '{scope} intext:"we will not pursue legal action" intext:security' },
  { category: 'Safe harbour', dork: '{scope} intext:"authorized under this policy" intext:vulnerability' },

  // crypto and web3
  { category: 'Crypto & web3', dork: '{scope} intext:"bug bounty" intext:BTC OR intext:ETH OR intext:USDC -site:hackerone.com' },
  { category: 'Crypto & web3', dork: '{scope} intext:"smart contract" intext:"bug bounty" intext:audit' },

  /* non-English policies
   * `label` names the language so the rendered list stays readable. Each dork
   * pairs the native phrase for reporting a vulnerability with the local term
   * for responsible disclosure or a reward.
   */
  { category: 'Non-English policies', label: 'German',     dork: '{scope} intext:"Sicherheitslücke melden" OR intext:"Schwachstelle melden" OR intext:"Verantwortungsvolle Offenlegung"' },
  { category: 'Non-English policies', label: 'French',     dork: '{scope} intext:"signaler une vulnérabilité" OR intext:"divulgation responsable" OR intext:"faille de sécurité"' },
  { category: 'Non-English policies', label: 'Spanish',    dork: '{scope} intext:"reportar una vulnerabilidad" OR intext:"divulgación responsable" OR intext:"informar de una vulnerabilidad"' },
  { category: 'Non-English policies', label: 'Italian',    dork: '{scope} intext:"segnalare una vulnerabilità" OR intext:"divulgazione responsabile" OR intext:"falla di sicurezza"' },
  { category: 'Non-English policies', label: 'Portuguese', dork: '{scope} intext:"relatar uma vulnerabilidade" OR intext:"divulgação responsável" OR intext:"reportar vulnerabilidade"' },
  { category: 'Non-English policies', label: 'Dutch',      dork: '{scope} intext:"kwetsbaarheid melden" OR intext:"meld een kwetsbaarheid" OR intext:"beveiligingslek melden"' },
  { category: 'Non-English policies', label: 'Dutch',      dork: '{scope} intext:"verantwoorde openbaarmaking" OR intext:"responsible disclosure beleid" OR intext:"gecoördineerde kwetsbaarheidsmelding"' },
  { category: 'Non-English policies', label: 'Dutch',      dork: '{scope} intext:"beloning" intext:"kwetsbaarheid" OR intext:"vergoeding" intext:"beveiligingslek"' },
  { category: 'Non-English policies', label: 'Swedish',    dork: '{scope} intext:"rapportera sårbarhet" OR intext:"sårbarhetsrapportering" OR intext:"ansvarsfullt avslöjande"' },
  { category: 'Non-English policies', label: 'Norwegian',  dork: '{scope} intext:"rapporter sårbarhet" OR intext:"sårbarhetsrapportering" OR intext:"ansvarlig offentliggjøring"' },
  { category: 'Non-English policies', label: 'Danish',     dork: '{scope} intext:"rapportér sårbarhed" OR intext:"ansvarlig offentliggørelse" OR intext:"sikkerhedshul"' },
  { category: 'Non-English policies', label: 'Finnish',    dork: '{scope} intext:"ilmoita haavoittuvuudesta" OR intext:"haavoittuvuuden ilmoittaminen" OR intext:"tietoturva-aukko"' },
  { category: 'Non-English policies', label: 'Polish',     dork: '{scope} intext:"zgłoś podatność" OR intext:"zgłaszanie podatności" OR intext:"luka bezpieczeństwa"' },
  { category: 'Non-English policies', label: 'Czech',      dork: '{scope} intext:"nahlásit zranitelnost" OR intext:"hlášení zranitelností" OR intext:"bezpečnostní chyba"' },
  { category: 'Non-English policies', label: 'Hungarian',  dork: '{scope} intext:"sebezhetőség bejelentése" OR intext:"biztonsági rés" OR intext:"sérülékenység bejelentés"' },
  { category: 'Non-English policies', label: 'Romanian',   dork: '{scope} intext:"raportează o vulnerabilitate" OR intext:"divulgare responsabilă" OR intext:"breșă de securitate"' },
  { category: 'Non-English policies', label: 'Greek',      dork: '{scope} intext:"αναφορά ευπάθειας" OR intext:"αναφορά ευπαθειών" OR intext:"κενό ασφαλείας"' },
  { category: 'Non-English policies', label: 'Turkish',    dork: '{scope} intext:"güvenlik açığı bildir" OR intext:"zafiyet bildirimi" OR intext:"güvenlik açığı bildirimi"' },
  { category: 'Non-English policies', label: 'Russian',    dork: '{scope} intext:"сообщить об уязвимости" OR intext:"ответственное раскрытие" OR intext:"вознаграждение за уязвимость"' },
  { category: 'Non-English policies', label: 'Ukrainian',  dork: '{scope} intext:"повідомити про вразливість" OR intext:"відповідальне розкриття" OR intext:"звіт про вразливість"' },
  { category: 'Non-English policies', label: 'Japanese',   dork: '{scope} intext:"脆弱性報告" OR intext:"脆弱性の報告" OR intext:"報奨金"' },
  { category: 'Non-English policies', label: 'Chinese',    dork: '{scope} intext:"漏洞报告" OR intext:"漏洞提交" OR intext:"安全应急响应中心"' },
  { category: 'Non-English policies', label: 'Korean',     dork: '{scope} intext:"취약점 신고" OR intext:"취약점 제보" OR intext:"보안 취약점"' },
  { category: 'Non-English policies', label: 'Thai',       dork: '{scope} intext:"รายงานช่องโหว่" OR intext:"ช่องโหว่ด้านความปลอดภัย"' },
  { category: 'Non-English policies', label: 'Vietnamese', dork: '{scope} intext:"báo cáo lỗ hổng bảo mật" OR intext:"tiết lộ có trách nhiệm"' },
  { category: 'Non-English policies', label: 'Indonesian', dork: '{scope} intext:"laporkan kerentanan" OR intext:"pengungkapan yang bertanggung jawab"' },
  { category: 'Non-English policies', label: 'Hebrew',     dork: '{scope} intext:"דיווח על פרצת אבטחה" OR intext:"חשיפה אחראית"' },
  { category: 'Non-English policies', label: 'Arabic',     dork: '{scope} intext:"الإبلاغ عن ثغرة أمنية" OR intext:"الإفصاح المسؤول"' }
];

var DIRECTORIES = [
  { name: 'HackerOne',       url: 'https://hackerone.com/directory/programs' },
  { name: 'Bugcrowd',        url: 'https://bugcrowd.com/engagements' },
  { name: 'Intigriti',       url: 'https://app.intigriti.com/researcher/programs' },
  { name: 'YesWeHack',       url: 'https://yeswehack.com/programs' },
  { name: 'Open Bug Bounty', url: 'https://www.openbugbounty.org/bugbounty-list/' },
  { name: 'disclose.io',     url: 'https://disclose.io/programs/' },
  { name: 'huntr',           url: 'https://huntr.com/bounties' },
  { name: 'Immunefi',        url: 'https://immunefi.com/explore/' },
  { name: 'HackenProof',     url: 'https://hackenproof.com/programs' },
  { name: 'Federacy',        url: 'https://www.federacy.com/' },
  { name: 'Zerocopter',      url: 'https://app.zerocopter.com/programs' },
  { name: 'GoBugFree',       url: 'https://www.gobugfree.com/programs' },
  { name: 'Bug Bounty CH',   url: 'https://www.bugbounty.ch/programs' },
  { name: 'Secuna',          url: 'https://secuna.io/hunters' },
  { name: 'Bugbounty.jp',    url: 'https://bugbounty.jp/' },
  { name: 'securitytxt.org', url: 'https://securitytxt.org/' }
];
