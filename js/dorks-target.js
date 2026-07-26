/* Target-mode dorks: scoped to a domain you are already testing.
 *
 * {site}   -> the site: token built from the scope checkboxes
 * {domain} -> the bare domain, for off-site dorks that search third-party
 *             hosts for mentions of the target rather than the target itself
 */

var TARGET_DORKS = [
  // recon & discovery
  { category: 'Recon & discovery', dork: '{site} -www -shop -share -blog -support' },
  { category: 'Recon & discovery', dork: '{site} inurl:login | inurl:signin | inurl:sso | inurl:auth | intitle:"log in" | intitle:"sign in"' },
  { category: 'Recon & discovery', dork: '{site} inurl:dev | inurl:test | inurl:staging | inurl:uat | inurl:qa | inurl:sandbox | inurl:preprod | inurl:demo' },
  { category: 'Recon & discovery', dork: '{site} inurl:admin | inurl:administrator | inurl:panel | inurl:dashboard | inurl:console' },
  { category: 'Recon & discovery', dork: '{site} inurl:api | inurl:/rest | inurl:/v1 | inurl:/v2 | inurl:/v3 | inurl:/graphql' },
  { category: 'Recon & discovery', dork: '{site} inurl:unsubscribe | inurl:register | inurl:feedback | inurl:signup | inurl:contact | inurl:profile | inurl:comment | inurl:developer | inurl:affiliate | inurl:upload' },

  // API surface
  { category: 'API surface', dork: '{site} inurl:apidocs | inurl:api-docs | inurl:swagger | inurl:api-explorer | inurl:redoc | inurl:openapi | intitle:"Swagger UI"' },
  { category: 'API surface', dork: '{site} inurl:swagger.json | inurl:openapi.json | inurl:/v2/api-docs | inurl:/api-docs.json' },
  { category: 'API surface', dork: '{site} inurl:/graphql | inurl:/graphiql | inurl:/v1/graphql | intitle:"GraphQL Playground" | intitle:"Apollo Studio"' },
  { category: 'API surface', dork: '{site} inurl:/.well-known/openid-configuration | inurl:/oauth/authorize | inurl:/saml | inurl:jwks.json' },
  { category: 'API surface', dork: '{site} inurl:/actuator | inurl:/actuator/health | inurl:/actuator/env | inurl:/actuator/mappings | inurl:/actuator/heapdump' },

  // injection-prone parameters
  { category: 'Injection-prone params', dork: '{site} inurl:q= | inurl:s= | inurl:search= | inurl:query= | inurl:keyword= | inurl:lang= inurl:&' },
  { category: 'Injection-prone params', dork: '{site} inurl:id= | inurl:pid= | inurl:category= | inurl:cat= | inurl:action= | inurl:sid= | inurl:dir= inurl:&' },
  { category: 'Injection-prone params', dork: '{site} inurl:redirect= | inurl:redir= | inurl:return= | inurl:returnUrl= | inurl:continue= | inurl:next= | inurl:goto= | inurl:rurl=' },
  { category: 'Injection-prone params', dork: '{site} inurl:http | inurl:url= | inurl:path= | inurl:dest= | inurl:html= | inurl:data= | inurl:domain= | inurl:callback=' },
  { category: 'Injection-prone params', dork: '{site} inurl:include | inurl:dir | inurl:detail= | inurl:file= | inurl:folder= | inurl:inc= | inurl:locate= | inurl:doc= | inurl:path=' },
  { category: 'Injection-prone params', dork: '{site} inurl:cmd | inurl:exec= | inurl:code= | inurl:do= | inurl:run= | inurl:read= | inurl:ping= | inurl:shell=' },
  { category: 'Injection-prone params', dork: '{site} inurl:email= | inurl:phone= | inurl:name= | inurl:user= | inurl:password= | inurl:secret= | inurl:token= inurl:&' },
  { category: 'Injection-prone params', dork: '{site} inurl:msg= | inurl:success= | inurl:display= | inurl:gift= | inurl:locale= | inurl:errorMessage= | inurl:aspxerrorpath=' },
  { category: 'Injection-prone params', dork: '{site} inurl:&' },

  // exposed files
  { category: 'Exposed files', dork: '{site} filetype:log | filetype:txt | filetype:conf | filetype:cnf | filetype:ini | filetype:env | filetype:sh | filetype:bak | filetype:backup | filetype:swp | filetype:old | filetype:tmp' },
  { category: 'Exposed files', dork: '{site} filetype:json | filetype:yaml | filetype:yml | filetype:xml | filetype:config | filetype:properties | filetype:toml' },
  /* filetype: matches one extension, so a compound like .sql.gz has to be
     matched in the URL instead - filetype:sql.gz never returns anything. */
  { category: 'Exposed files', dork: '{site} filetype:sql | filetype:sqlite | filetype:db | filetype:mdb | filetype:dbf | filetype:dump | inurl:.sql.gz' },
  { category: 'Exposed files', dork: '{site} filetype:pem | filetype:key | filetype:crt | filetype:p12 | filetype:pfx | filetype:jks | filetype:ppk | filetype:rdp' },
  { category: 'Exposed files', dork: '{site} inurl:.env | inurl:wp-config | inurl:config.json | inurl:settings.py | inurl:credentials | inurl:.npmrc' },
  { category: 'Exposed files', dork: '{site} intitle:"index of" | inurl:/.git/ | inurl:/.svn/ | inurl:.DS_Store | inurl:/.hg/ | inurl:/.bzr/' },
  { category: 'Exposed files', dork: '{site} inurl:.git-credentials | inurl:.gitconfig | inurl:.netrc | inurl:.dockercfg | inurl:.pypirc' },
  { category: 'Exposed files', dork: '{site} inurl:backup.zip | inurl:backup.tar.gz | inurl:web.zip | inurl:site.zip | inurl:public_html.zip | inurl:www.zip' },
  { category: 'Exposed files', dork: '{site} inurl:dump.sql | inurl:database.sql | inurl:db.sql | inurl:users.sql | inurl:setup.sql | inurl:backup.sql' },
  { category: 'Exposed files', dork: '{site} filetype:orig | filetype:save | filetype:rej | filetype:sav | filetype:copy | filetype:inc' },
  { category: 'Exposed files', dork: '{site} filetype:xls | filetype:xlsx | filetype:csv | filetype:doc | filetype:docx | filetype:ppt | filetype:pptx | filetype:pdf intext:confidential | intext:"internal use only" | intext:"do not distribute"' },
  { category: 'Exposed files', dork: '{site} filetype:php | filetype:aspx | filetype:asp | filetype:jsp | filetype:jspx | filetype:do | filetype:action' },

  // exposed services
  { category: 'Exposed services', dork: '{site} inurl:/grafana | intitle:"Grafana" | intitle:"Kibana" | inurl:/prometheus | intitle:"Prometheus Time Series"' },
  { category: 'Exposed services', dork: '{site} inurl:/jenkins | intitle:"Dashboard [Jenkins]" | inurl:Jenkinsfile | inurl:.gitlab-ci.yml | inurl:.github/workflows | inurl:.travis.yml' },
  { category: 'Exposed services', dork: '{site} intitle:"Kubernetes Dashboard" | inurl:/api/v1/namespaces | inurl:docker-compose.yml | inurl:/v2/_catalog | inurl:kubeconfig' },
  { category: 'Exposed services', dork: '{site} inurl:/jira | inurl:/confluence | inurl:/wiki/spaces | inurl:/browse/ | intitle:"System Dashboard - Jira"' },
  { category: 'Exposed services', dork: '{site} inurl:phpmyadmin | inurl:/adminer | inurl:/pgadmin | intitle:"phpMyAdmin" | intitle:"Adminer"' },
  { category: 'Exposed services', dork: '{site} "server-status" apache | intitle:"Apache Status" | inurl:/server-info | inurl:/nginx_status' },
  { category: 'Exposed services', dork: '{site} intitle:"Welcome to nginx" | intitle:"Apache2 Ubuntu Default Page" | intitle:"IIS Windows Server" | intitle:"Test Page for the HTTP Server"' },
  { category: 'Exposed services', dork: '{site} intitle:"Apache Tomcat" | intitle:"GlassFish Server" | intitle:"WAMPSERVER" | intitle:"Domain Default page" | intitle:"502 Proxy Error"' },
  /* Unauthenticated health and profiling endpoints leak build, config and
     sometimes heap data without looking like an admin panel. */
  { category: 'Exposed services', dork: '{site} inurl:/metrics | inurl:/healthz | inurl:/readyz | inurl:/livez | inurl:/debug/pprof | inurl:/status.json' },
  { category: 'Exposed services', dork: '{site} inurl:awstats | inurl:webalizer | inurl:munin | inurl:cacti | inurl:/stats | inurl:/monitoring' },
  { category: 'Exposed services', dork: '{site} "stack trace" | "unhandled exception" | "undefined index" | "fatal error" | intitle:"exception" | inurl:/error | "Warning: mysql_connect()"' },
  { category: 'Exposed services', dork: '{site} "sql syntax near" | "syntax error has occurred" | "incorrect syntax near" | "You have an error in your SQL syntax" | "ORA-01756"' },
  { category: 'Exposed services', dork: '{site} intitle:"phpinfo()" | inurl:phpinfo.php | inurl:/info.php | "PHP Version" intitle:"phpinfo"' },
  { category: 'Exposed services', dork: '{site} intext:"choose file" | intext:"select file" | intext:"upload PDF" | inurl:/upload | inurl:/fileupload' },

  // secrets
  { category: 'Secrets & tokens', dork: '{site} filetype:js intext:"api_key" | intext:"apikey" | intext:"secret_key" | intext:"access_token" | intext:"client_secret"' },
  { category: 'Secrets & tokens', dork: '{site} intext:"AKIA" | intext:"AIza" | intext:"sk_live_" | intext:"xoxb-" | intext:"xoxp-" | intext:"SG." | intext:"ghp_"' },
  { category: 'Secrets & tokens', dork: '{site} intext:"sk-ant-" | intext:"sk-proj-" | intext:"glpat-" | intext:"npm_" | intext:"dop_v1_" | intext:"shpat_"' },
  { category: 'Secrets & tokens', dork: '{site} intext:"BEGIN RSA PRIVATE KEY" | intext:"BEGIN OPENSSH PRIVATE KEY" | intext:"BEGIN PGP PRIVATE KEY"' },
  { category: 'Secrets & tokens', dork: '{site} confidential | "employee only" | proprietary | "top secret" | classified | "trade secret" | internal | private filetype:log' },
  { category: 'Secrets & tokens', dork: '{site} "password" | "credential" | "username" | "confidential" | "employee only" filetype:log' },

  /* credentials by variable
   * Token prefixes above catch a leaked value; these catch the variable that
   * holds it. Config files often name the secret without exposing its format.
   * filetype: is a global filter, so one operator covers every alternative.
   */
  { category: 'Credentials by name', dork: '{site} filetype:env "AWS_SECRET_ACCESS_KEY" | "AWS_ACCESS_KEY_ID" | "AWS_SESSION_TOKEN"' },
  { category: 'Credentials by name', dork: '{site} filetype:env "GOOGLE_APPLICATION_CREDENTIALS" | "AZURE_CLIENT_SECRET" | "DIGITALOCEAN_TOKEN" | "HEROKU_API_KEY"' },
  { category: 'Credentials by name', dork: '{site} filetype:env "DB_PASSWORD" | "DATABASE_URL" | "REDIS_URL" | "MONGO_URI" | "POSTGRES_PASSWORD"' },
  { category: 'Credentials by name', dork: '{site} filetype:env "STRIPE_SECRET_KEY" | "TWILIO_AUTH_TOKEN" | "SENDGRID_API_KEY" | "MAILGUN_API_KEY"' },
  { category: 'Credentials by name', dork: '{site} filetype:env "SLACK_TOKEN" | "SLACK_WEBHOOK" | "DISCORD_BOT_TOKEN" | "TELEGRAM_BOT_TOKEN"' },
  { category: 'Credentials by name', dork: '{site} filetype:env "OPENAI_API_KEY" | "ANTHROPIC_API_KEY" | "COHERE_API_KEY" | "HUGGINGFACE_TOKEN"' },
  { category: 'Credentials by name', dork: '{site} filetype:env "CIRCLE_TOKEN" | "TRAVIS_TOKEN" | "NPM_TOKEN" | "GH_TOKEN" | "GITLAB_TOKEN"' },
  /* Build-time prefixes are inlined into client bundles, so a secret placed
     behind one is public the moment the site ships. */
  { category: 'Credentials by name', dork: '{site} filetype:env "NEXT_PUBLIC_" | "REACT_APP_" | "VITE_" | "VUE_APP_" | "EXPO_PUBLIC_"' },
  { category: 'Credentials by name', dork: '{site} filetype:json "private_key" "client_email" | "service_account" | "serviceAccountKey"' },
  { category: 'Credentials by name', dork: '{site} filetype:json "firebase" "apiKey" | "firebase" "private_key" | "firebaseConfig"' },

  // off-site leaks
  { category: 'Off-site exposure', dork: 'site:s3.amazonaws.com | site:storage.googleapis.com | site:blob.core.windows.net | site:digitaloceanspaces.com "{domain}"' },
  { category: 'Off-site exposure', dork: 'site:r2.dev | site:sharepoint.com | site:onedrive.live.com | site:box.com | site:wetransfer.com "{domain}"' },
  { category: 'Off-site exposure', dork: 'site:firebaseio.com | site:firebaseapp.com | site:firebasestorage.googleapis.com "{domain}"' },
  { category: 'Off-site exposure', dork: 'site:pastebin.com | site:ghostbin.co | site:controlc.com | site:justpaste.it | site:rentry.co "{domain}"' },
  { category: 'Off-site exposure', dork: 'site:jsfiddle.net | site:codepen.io | site:codebeautify.org | site:replit.com | site:codesandbox.io "{domain}"' },
  { category: 'Off-site exposure', dork: 'site:github.com | site:gitlab.com | site:bitbucket.org | site:raw.githubusercontent.com "{domain}"' },
  { category: 'Off-site exposure', dork: 'site:docs.google.com | site:drive.google.com | site:dropbox.com | site:groups.google.com "{domain}"' },
  { category: 'Off-site exposure', dork: 'site:trello.com | site:notion.site | site:airtable.com | site:coda.io "{domain}"' },
  { category: 'Off-site exposure', dork: 'site:documenter.getpostman.com | site:postman.com | site:swaggerhub.com | site:readme.io "{domain}"' },
  { category: 'Off-site exposure', dork: 'site:jfrog.io | site:hub.docker.com | site:npmjs.com | site:pypi.org "{domain}"' },
  { category: 'Off-site exposure', dork: 'site:openbugbounty.org | site:hackerone.com/reports | site:bugcrowd.com/disclosures "{domain}"' },
  { category: 'Off-site exposure', dork: 'site:linkedin.com/in | site:twitter.com | site:reddit.com | site:stackoverflow.com "{domain}"' },
  { category: 'Off-site exposure', dork: 'site:huggingface.co | site:kaggle.com | site:colab.research.google.com | site:wandb.ai "{domain}"' },

  // CMS & platforms
  { category: 'CMS & platforms', dork: '{site} inurl:/wp-admin/admin-ajax.php | inurl:/wp-content/uploads | inurl:/wp-json/wp/v2/users | inurl:wp-config.php.bak' },
  { category: 'CMS & platforms', dork: '{site} "Powered by Drupal" intext:Drupal | inurl:/user/login | inurl:/node/add | inurl:/admin/config' },
  { category: 'CMS & platforms', dork: '{site} inurl:/administrator/index.php | intext:"Joomla!" | inurl:/index.php?option=com_' },
  { category: 'CMS & platforms', dork: '{site} inurl:/content/dam | inurl:/jcr:content | inurl:/crx/de | inurl:/bin/wcm | inurl:/etc/clientlibs | inurl:/content/usergenerated' },
  { category: 'CMS & platforms', dork: '{site} inurl:/sitecore | inurl:/umbraco | inurl:/typo3 | inurl:/magento_version | inurl:/ghost/api' },
  { category: 'CMS & platforms', dork: '{site} inurl:/_next/static | inurl:/__nuxt | inurl:/.well-known/vercel | intext:"Powered by Shopify"' }
];

// {d} is replaced with the bare domain, already URI-encoded.
var RECON = [
  { name: 'crt.sh',         url: 'https://crt.sh/?q=%25.{d}' },
  { name: 'Shodan',         url: 'https://www.shodan.io/search?query=hostname%3A{d}' },
  { name: 'Censys',         url: 'https://search.censys.io/search?resource=hosts&q={d}' },
  { name: 'urlscan.io',     url: 'https://urlscan.io/domain/{d}' },
  { name: 'Wayback',        url: 'https://web.archive.org/web/*/{d}/*' },
  { name: 'VirusTotal',     url: 'https://www.virustotal.com/gui/domain/{d}/relations' },
  { name: 'SecurityTrails', url: 'https://securitytrails.com/domain/{d}/dns' },
  { name: 'AlienVault OTX', url: 'https://otx.alienvault.com/indicator/domain/{d}' },
  { name: 'GitHub Code',    url: 'https://github.com/search?type=code&q=%22{d}%22' },
  { name: 'grep.app',       url: 'https://grep.app/search?q={d}' },
  { name: 'Netlas',         url: 'https://app.netlas.io/domains/?q=domain%3A*.{d}' },
  { name: 'DNSDumpster',    url: 'https://dnsdumpster.com/?target={d}' },
  { name: 'ViewDNS',        url: 'https://viewdns.info/reverseip/?host={d}&t=1' },
  /* The Wayback CDX API was here, but collapse=urlkey on a wildcard query
     never returns - and the Wayback pivot above already covers that ground. */
  { name: 'RapidDNS',       url: 'https://rapiddns.io/subdomain/{d}' },
  { name: 'HackerTarget',   url: 'https://api.hackertarget.com/hostsearch/?q={d}' }
];
