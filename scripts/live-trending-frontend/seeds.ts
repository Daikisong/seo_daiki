export type TopSiteSeed = {
  title: string;
  url: string;
  pageType: string;
  signals: string[];
};

export type GroupSeed = {
  id: string;
  market: string;
  language: string;
  country: string;
  geo: string;
  trendSeed: string;
  searchQuery: string;
  serpLocale: string;
  selectedBecause: string;
  topSites: TopSiteSeed[];
};

export const repeatedPatterns = [
  {
    pattern: "answer_or_status_first",
    finding:
      "High-performing guide, public-service, finance, event, and health pages put the usable answer or current status before deep explanation.",
    frontendDecision:
      "Keep the direct-answer block above summaries, tables, and body prose."
  },
  {
    pattern: "trust_near_the_top",
    finding:
      "Top pages surface reviewed date, official-source basis, author/reviewer, route/source map, or medical/financial caveat near the hero.",
    frontendDecision:
      "Keep the trust strip directly under the hero facts and make it visible on every article route."
  },
  {
    pattern: "reader_path_before_dense_content",
    finding:
      "The clearest sites give readers a short path: check the current fact, compare the options, then verify the source.",
    frontendDecision:
      "Add a compact reader-path strip between trust evidence and the article body."
  },
  {
    pattern: "tables_for_comparison",
    finding:
      "Finance, travel, baggage, TV, health, and policy pages rely on tables or compact grids for decisions users compare quickly.",
    frontendDecision:
      "Keep comparison tables prominent and avoid hiding them below long prose."
  },
  {
    pattern: "checklists_for_action",
    finding:
      "Event, government-service, shopping, health, and travel pages convert uncertainty into checklists or step lists.",
    frontendDecision:
      "Keep checklist UI above the long body and make items visually scannable."
  },
  {
    pattern: "public_pages_hide_research_notes",
    finding:
      "Public pages do not expose SERP-analysis wording; they turn research into instructions, sources, and caveats.",
    frontendDecision:
      "Keep SERP references internal and do not render research/status language on public article pages."
  }
];

export const groups: GroupSeed[] = [
  {
    id: "us-criminal-defense-attorney",
    market: "us",
    language: "en",
    country: "US",
    geo: "US",
    trendSeed: "criminal defense attorney",
    searchQuery: "criminal defense attorney how to choose guide 2026",
    serpLocale: "gl=us hl=en",
    selectedBecause: "US legal-service trend where top pages use checklists, evaluation criteria, and clear next steps.",
    topSites: [
      {
        title: "How to Choose the Right Criminal Defense Attorney - LegalClarity",
        url: "https://legalclarity.org/how-to-choose-the-right-criminal-defense-attorney/",
        pageType: "legal guide",
        signals: ["plain-language title", "need assessment sections", "decision checklist"]
      },
      {
        title: "Choosing the Right Criminal Lawyer: Practical Tips for Defendants - Simpli.com",
        url: "https://www.simpli.com/history/choosing-right-criminal-lawyer-practical-tips-defendants",
        pageType: "legal explainer",
        signals: ["question headings", "bulleted consultation checklist", "jurisdiction caveat"]
      },
      {
        title: "What to Look for When Picking a Criminal Defense Lawyer - LA Progressive",
        url: "https://www.laprogressive.com/sponsored/picking-a-criminal-defense-lawyer",
        pageType: "sponsored guide",
        signals: ["hero image", "author/date", "step-by-step selection criteria"]
      },
      {
        title: "Local Criminal Attorneys: How to Choose the Right Defense - Simpli.com",
        url: "https://www.simpli.com/history/local-criminal-attorneys-choose-right-defense",
        pageType: "local legal guide",
        signals: ["local relevance framing", "verification checklist", "realistic expectations"]
      },
      {
        title: "How to Choose a Criminal Defense Lawyer - LegalClarity",
        url: "https://legalclarity.org/how-to-choose-a-criminal-defense-lawyer/",
        pageType: "legal guide",
        signals: ["direct guide promise", "directory/source path", "final decision section"]
      }
    ]
  },
  {
    id: "us-israel-day-parade",
    market: "us",
    language: "en",
    country: "US",
    geo: "US",
    trendSeed: "israel day parade",
    searchQuery: "Israel Day Parade 2026 guide route schedule NYC",
    serpLocale: "gl=us hl=en",
    selectedBecause: "US event trend where top pages prioritize route, schedule, access points, closures, and security notes.",
    topSites: [
      {
        title: "Record turnout expected at NYC Israel Day Parade - CBS New York",
        url: "https://www.cbsnews.com/newyork/news/nyc-israel-day-parade-2026/?intcid=CNR-01-0623",
        pageType: "event guide",
        signals: ["route map", "time block", "security section"]
      },
      {
        title: "Israel Day Parade 2026: Parade details, road closures and how to watch - FOX 5 NY",
        url: "https://www.fox5ny.com/news/israel-day-parade-2026-parade-details-road-closures-how-watch.amp",
        pageType: "event explainer",
        signals: ["what-we-know block", "road closures", "watch instructions"]
      },
      {
        title: "2026 CELEBRATE ISRAEL PARADE - Uniformed Firefighters Association",
        url: "https://ufanyc.org/event/2026-celebrate-israel-parade/",
        pageType: "event listing",
        signals: ["date/time details", "venue metadata", "organizer contact"]
      },
      {
        title: "Celebrate Israel Parade Route Map - NYC DOT",
        url: "https://www.nyc.gov/html/dot/downloads/pdf/emb-2026-israel-day-parade-map.pdf",
        pageType: "official map PDF",
        signals: ["map-first utility", "route/dispersal labels", "official source"]
      },
      {
        title: "Israel Day Parade will feature tight security but no Mamdani - NY1",
        url: "https://ny1.com/nyc/all-boroughs/news/2026/05/29/israel-day-parade-will-feature-tight-security-but-no-mamdani",
        pageType: "local explainer",
        signals: ["what-you-need-to-know bullets", "image", "security context"]
      }
    ]
  },
  {
    id: "gb-mortgages",
    market: "gb",
    language: "en",
    country: "GB",
    geo: "GB",
    trendSeed: "mortgages",
    searchQuery: "UK mortgage rates 2026 guide best deals compare",
    serpLocale: "gl=gb hl=en",
    selectedBecause: "UK finance trend where pages win with rate freshness, comparison tables, calculators, and fee warnings.",
    topSites: [
      {
        title: "Mortgage Rates UK 2026 | Best Deals & How to Compare",
        url: "https://www.krediks.com/gb/mortgage-rates-uk/",
        pageType: "finance guide",
        signals: ["rate table", "updated month", "total-cost warning"]
      },
      {
        title: "Best UK Mortgage Deals 2026 - Forbes Advisor UK",
        url: "https://www.forbes.com/uk/advisor/mortgages/",
        pageType: "comparison guide",
        signals: ["ranked cards", "methodology", "editorial ratings"]
      },
      {
        title: "Best Mortgage Rates UK 2026 - PocketWise",
        url: "https://pocketwise.co.uk/mortgages-property/best-mortgage-rates/",
        pageType: "finance guide",
        signals: ["rate bands", "buyer-type sections", "plain-language caveats"]
      },
      {
        title: "UK Mortgage Guide 2026",
        url: "https://mortgagecalcuk.com/uk-mortgage-guide-2026",
        pageType: "calculator-led guide",
        signals: ["calculator context", "fee comparison", "repayment examples"]
      },
      {
        title: "Best Mortgage Rates UK - Mortgage Genie",
        url: "https://www.mortgagegenie.uk/best-mortgage-rates",
        pageType: "broker comparison",
        signals: ["current-rate timestamp", "comparison CTA", "eligibility framing"]
      }
    ]
  },
  {
    id: "gb-savings",
    market: "gb",
    language: "en",
    country: "GB",
    geo: "GB",
    trendSeed: "savings",
    searchQuery: "UK savings account guide best rates 2026",
    serpLocale: "gl=gb hl=en",
    selectedBecause: "UK savings trend where strong pages expose current rates, tax wrapper caveats, and safety limits.",
    topSites: [
      {
        title: "The best cash ISAs - MoneyWeek",
        url: "https://moneyweek.com/personal-finance/savings/isas/best-cash-isas",
        pageType: "finance guide",
        signals: ["rate freshness", "tax allowance explanation", "in-brief summary"]
      },
      {
        title: "Best UK Savings Accounts 2026/27",
        url: "https://uktaxdrag.co.uk/best-uk-savings-accounts-2026-27.html",
        pageType: "finance comparison",
        signals: ["table of sections", "FSCS note", "review date"]
      },
      {
        title: "Best savings accounts in the UK 2026 - APYData",
        url: "https://apydata.com/blog/best-savings-accounts-uk-2026",
        pageType: "rate guide",
        signals: ["rate-led headline", "account-type comparison", "short summary"]
      },
      {
        title: "Best Savings Rates UK 2026 - PocketWise",
        url: "https://pocketwise.co.uk/personal-finance/budgeting/savings-rates-guide/",
        pageType: "finance guide",
        signals: ["rate overview", "account-type sections", "risk caveats"]
      },
      {
        title: "Best Instant Access Savings Accounts In 2026 - Forbes Advisor UK",
        url: "https://www.forbes.com/uk/advisor/savings/instant-access-savings-accounts/",
        pageType: "comparison guide",
        signals: ["ranked provider cards", "methodology", "editorial review"]
      }
    ]
  },
  {
    id: "gb-insurance",
    market: "gb",
    language: "en",
    country: "GB",
    geo: "GB",
    trendSeed: "insurance",
    searchQuery: "UK insurance guide compare 2026",
    serpLocale: "gl=gb hl=en",
    selectedBecause: "UK insurance trend where top UX is dominated by comparison cards, calculators, exclusions, and policy warnings.",
    topSites: [
      {
        title: "Best Car Insurance Companies - Forbes Advisor UK",
        url: "https://www.forbes.com/uk/advisor/car-insurance/best-car-insurance-companies/",
        pageType: "insurance comparison",
        signals: ["ranked table", "review criteria", "policy caveats"]
      },
      {
        title: "Car Insurance - MoneySuperMarket",
        url: "https://www.moneysupermarket.com/car-insurance/",
        pageType: "comparison landing page",
        signals: ["quote CTA", "benefit bullets", "trust stats"]
      },
      {
        title: "Compare Car Insurance - Compare the Market",
        url: "https://www.comparethemarket.com/car-insurance/",
        pageType: "comparison landing page",
        signals: ["form-first layout", "coverage explanation", "FAQ accordion"]
      },
      {
        title: "Car Insurance - Go.Compare",
        url: "https://www.gocompare.com/car-insurance/",
        pageType: "comparison landing page",
        signals: ["step-by-step quote path", "coverage cards", "support FAQs"]
      },
      {
        title: "Insurance guides - Which?",
        url: "https://www.which.co.uk/money/insurance",
        pageType: "consumer advice hub",
        signals: ["category hub", "expert advice", "buyer protection framing"]
      }
    ]
  },
  {
    id: "gb-marks-and-spencer",
    market: "gb",
    language: "en",
    country: "GB",
    geo: "GB",
    trendSeed: "marks and spencer uk",
    searchQuery: "Marks and Spencer UK sale guide returns delivery",
    serpLocale: "gl=gb hl=en",
    selectedBecause: "UK retail trend where useful pages foreground sale policy, delivery, return windows, and product fit.",
    topSites: [
      {
        title: "Returns and Refunds - M&S",
        url: "https://www.marksandspencer.com/help-and-support/returns-and-refunds",
        pageType: "retail help page",
        signals: ["policy answer first", "sale return exception", "FAQ structure"]
      },
      {
        title: "Delivery - M&S",
        url: "https://www.marksandspencer.com/help-and-support/delivery",
        pageType: "retail help page",
        signals: ["delivery option cards", "exceptions", "support hierarchy"]
      },
      {
        title: "Sale - M&S",
        url: "https://www.marksandspencer.com/l/sale",
        pageType: "retail category page",
        signals: ["category filters", "sale navigation", "product grid"]
      },
      {
        title: "Marks and Spencer coats - Woman & Home",
        url: "https://www.womanandhome.com/fashion/marks-and-spencer-coats/",
        pageType: "shopping guide",
        signals: ["expert intro", "product roundup", "return-policy context"]
      },
      {
        title: "M&S Help and Support",
        url: "https://www.marksandspencer.com/help-and-support",
        pageType: "support hub",
        signals: ["topic hub", "search/help entry", "clear service categories"]
      }
    ]
  },
  {
    id: "ca-bike-for-brain-health",
    market: "ca",
    language: "en",
    country: "CA",
    geo: "CA",
    trendSeed: "bike for brain health",
    searchQuery: "Bike for Brain Health Toronto 2026 route guide",
    serpLocale: "gl=ca hl=en",
    selectedBecause: "Canada event trend where route maps, transport disruption, rider kits, and start-line instructions dominate UX.",
    topSites: [
      {
        title: "Mattamy Homes Bike for Brain Health",
        url: "https://bikeforbrainhealth.ca/",
        pageType: "official event page",
        signals: ["route maps", "registration CTA", "cause explanation"]
      },
      {
        title: "Bike for Brain Health 2026 - Trailforks",
        url: "https://www.trailforks.com/route/bike-for-brain-health-2026-30km/",
        pageType: "route map",
        signals: ["map-first route", "distance/difficulty metadata", "local trail context"]
      },
      {
        title: "Bike for Brain Health - Festivals Toronto",
        url: "https://festivalstoronto.com/events/bike-for-brain-health/",
        pageType: "event listing",
        signals: ["date/location summary", "short description", "city-event format"]
      },
      {
        title: "Bike for Brain Health Rider Kit",
        url: "https://bikeforbrainhealth.ca/wp-content/uploads/2025/05/Rider-Kit.pdf",
        pageType: "rider PDF",
        signals: ["pre-event checklist", "route plan", "participant instructions"]
      },
      {
        title: "Toronto weekend road and transit closures - CBC",
        url: "https://www.cbc.ca/news/canada/toronto/road-transit-closures-gta-9.7217898",
        pageType: "local service explainer",
        signals: ["closure list", "event context", "practical planning"]
      }
    ]
  },
  {
    id: "ca-weather-montreal",
    market: "ca",
    language: "en",
    country: "CA",
    geo: "CA",
    trendSeed: "weather montreal",
    searchQuery: "weather Montreal forecast guide Environment Canada MeteoMedia",
    serpLocale: "gl=ca hl=en",
    selectedBecause: "Canada weather trend where top pages use current-condition cards, warning status, hourly tabs, and map modules.",
    topSites: [
      {
        title: "Montreal Forecast - Environment Canada",
        url: "https://weather.gc.ca/city/pages/qc-147_metric_e.html",
        pageType: "official weather page",
        signals: ["current conditions", "alerts", "forecast table"]
      },
      {
        title: "Montreal Weather - The Weather Network",
        url: "https://www.theweathernetwork.com/en/city/ca/quebec/montreal",
        pageType: "weather dashboard",
        signals: ["hourly/daily tabs", "map modules", "condition cards"]
      },
      {
        title: "Montreal Weather - MétéoMédia",
        url: "https://www.meteomedia.com/en/city/ca/quebec/montreal",
        pageType: "weather dashboard",
        signals: ["localized forecast", "warning modules", "visual cards"]
      },
      {
        title: "Tour la Nuit called off as severe weather hits Montreal - Montreal Gazette",
        url: "https://montrealgazette.com/news/tour-la-nuit-called-off-minutes-before-start-as-severe-weather-hits-montreal/",
        pageType: "local weather impact page",
        signals: ["event impact first", "updated status", "local context"]
      },
      {
        title: "Severe thunderstorm warning issued for Montreal area - CTV News",
        url: "https://www.ctvnews.ca/montreal/article/severe-thunderstorm-warning-issued-for-montreal-area-2/",
        pageType: "alert explainer",
        signals: ["warning first", "timing", "safety context"]
      }
    ]
  },
  {
    id: "es-moto-gp-hoy",
    market: "es",
    language: "es",
    country: "ES",
    geo: "ES",
    trendSeed: "moto gp hoy",
    searchQuery: "moto gp hoy horario donde ver guia 2026 España",
    serpLocale: "gl=es hl=es",
    selectedBecause: "Spain sports-viewing trend where pages win with schedule, channel, streaming, and race context blocks.",
    topSites: [
      {
        title: "Horario Moto GP hoy - LOS40",
        url: "https://los40.com/2026/05/31/horario-moto-gp-hoy-a-que-hora-es-la-carrera-en-italia-y-donde-verla-en-tv-y-online-en-directo/",
        pageType: "viewing guide",
        signals: ["time answer first", "where-to-watch section", "race context"]
      },
      {
        title: "HORARIOS: Gran Premio Estrella Galicia 0,0 de España - MotoGP",
        url: "https://www.motogp.com/es/news/2026/04/14/time-schedule-spanish-gp/1020279",
        pageType: "official schedule",
        signals: ["official source", "schedule table", "event framing"]
      },
      {
        title: "MotoGP 2026: Horarios, TV y dónde ver - ADSLZone",
        url: "https://www.adslzone.net/reportajes/como-ver/ver-moto-gp/",
        pageType: "streaming guide",
        signals: ["platform comparison", "season-wide guidance", "FAQ structure"]
      },
      {
        title: "GP de Italia de MotoGP: canal TV, horarios, cómo y dónde ver - AS",
        url: "https://as.com/motor/motociclismo/gp-de-italia-de-motogp-canal-tv-horarios-como-y-donde-ver-las-carreras-en-mugello-en-directo-online-f202605-n/",
        pageType: "sports guide",
        signals: ["channel/time blocks", "live context", "event-specific headline"]
      },
      {
        title: "Horario MotoGP del GP de España 2026 - Motorbike Magazine",
        url: "https://www.motorbikemag.es/horario-motogp-gp-espana-2026-jerez-fecha-hora-como-ver-carreras-gratis-abierto/",
        pageType: "specialist guide",
        signals: ["event schedule", "how-to-watch", "enthusiast context"]
      }
    ]
  },
  {
    id: "br-pluto-tv",
    market: "br",
    language: "pt-br",
    country: "BR",
    geo: "BR",
    trendSeed: "pluto tv",
    searchQuery: "Pluto TV Brasil guia canais gratis 2026",
    serpLocale: "gl=br hl=pt-BR",
    selectedBecause: "Brazil streaming trend where top pages combine channel lists, free/legal explanation, and device instructions.",
    topSites: [
      {
        title: "Pluto TV: Como assistir séries e filmes grátis oficialmente - Tecnoup",
        url: "https://www.tecnoup.net.br/pluto-tv-como-assistir-series-e-filmes-gratis-oficialmente/",
        pageType: "streaming guide",
        signals: ["updated guide", "legal/free explanation", "device instructions"]
      },
      {
        title: "Pluto TV é GRÁTIS? - Minha Conexão",
        url: "https://www.minhaconexao.com.br/planos/streaming/pluto-tv",
        pageType: "consumer guide",
        signals: ["answer-first title", "channel examples", "updated date"]
      },
      {
        title: "Pluto TV lança seis novos canais - TV Pop",
        url: "https://www.tvpop.com.br/337513/pluto-tv-lanca-seis-novos-canais-em-janeiro-e-reforca-catalogo-gratuito/",
        pageType: "catalog update",
        signals: ["new-channel list", "catalog context", "date freshness"]
      },
      {
        title: "List of channels on Pluto TV Brazil - TV Channel Lists",
        url: "https://www.tvchannellists.com/w/List_of_channels_on_Pluto_TV_%28Brazil%29",
        pageType: "reference list",
        signals: ["long channel table", "categorized listing", "reference format"]
      },
      {
        title: "Pluto TV Brasil",
        url: "https://pluto.tv/br/live-tv",
        pageType: "official app page",
        signals: ["live channel grid", "watch CTA", "visual browsing"]
      }
    ]
  },
  {
    id: "pt-fisco",
    market: "pt",
    language: "pt",
    country: "PT",
    geo: "PT",
    trendSeed: "fisco",
    searchQuery: "fisco Portugal IRS guia 2026 alerta email fraudulento",
    serpLocale: "gl=pt hl=pt",
    selectedBecause: "Portugal tax/security trend where pages foreground warnings, official action, and phishing avoidance.",
    topSites: [
      {
        title: "Fisco alerta para e-mail fraudulento - RTP",
        url: "https://www.rtp.pt/noticias/pais/fisco-alerta-para-e-mail-fraudulento-sobre-alteracao-da-declaracao-de-irs_n1744595",
        pageType: "public-service news explainer",
        signals: ["warning first", "source quote", "what not to do"]
      },
      {
        title: "Fisco alerta para e-mails e SMS falsos - RTP",
        url: "https://www.rtp.pt/noticias/economia/fisco-alerta-para-e-mails-e-sms-falsos-enviados-para-roubo-de-dados-pessoais_n1738848",
        pageType: "fraud explainer",
        signals: ["risk summary", "official-source basis", "prevention steps"]
      },
      {
        title: "Fisco alerta para mensagens fraudulentas - Diário de Notícias",
        url: "https://www.dn.pt/economia/fisco-alerta-para-mensagens-fraudulentas",
        pageType: "public-service explainer",
        signals: ["short alert format", "fraud warning", "official attribution"]
      },
      {
        title: "Portal das Finanças phishing alert PDF",
        url: "https://info.portaldasfinancas.gov.pt/pt/destaques/Documents/Alerta_Seguranca_Phishing_AT_20210408.pdf",
        pageType: "official alert PDF",
        signals: ["official warning", "security checklist", "source authority"]
      },
      {
        title: "A deeper dive into the Dirty Dozen - IRS",
        url: "https://www.irs.gov/newsroom/a-deeper-dive-into-the-dirty-dozen-taxpayers-stay-alert-in-peak-filing-season",
        pageType: "tax-scam reference",
        signals: ["scam taxonomy", "action bullets", "official public-service layout"]
      }
    ]
  },
  {
    id: "pt-heranca",
    market: "pt",
    language: "pt",
    country: "PT",
    geo: "PT",
    trendSeed: "herança",
    searchQuery: "herança Portugal guia imposto selo partilhas",
    serpLocale: "gl=pt hl=pt",
    selectedBecause: "Portugal inheritance trend where strong UX needs legal caveats, calculators, service steps, and official documents.",
    topSites: [
      {
        title: "Pedir a partilha e registo da herança - gov.pt",
        url: "https://www2.gov.pt/pt/servicos/pedir-a-partilha-e-registo-da-heranca",
        pageType: "official service page",
        signals: ["eligibility questions", "documents section", "service CTA"]
      },
      {
        title: "Simulador de Heranças - Orçamento Fácil",
        url: "https://www.orcamentofacil.pt/ferramentas/simulador-herancas",
        pageType: "calculator tool",
        signals: ["input-driven UI", "legal basis", "reviewed date"]
      },
      {
        title: "Quem é obrigado a pagar o imposto sobre herança? - ComparaJá",
        url: "https://www.comparaja.pt/financas-pessoais/artigos/imposto-sobre-heranca",
        pageType: "finance/legal guide",
        signals: ["answer-first topic", "exceptions", "plain-language examples"]
      },
      {
        title: "Guia Prático Heranças - OCC",
        url: "https://www.occ.pt/sites/default/files/public/2024-02/Guia_Pratico_HERANCAS_2.pdf",
        pageType: "professional PDF guide",
        signals: ["FAQ format", "official/professional source", "procedural detail"]
      },
      {
        title: "Inheritance tax calculator - Partida Final",
        url: "https://morte.pt/en/inheritance-calculator.html",
        pageType: "calculator tool",
        signals: ["calculator first", "stamp-duty explanation", "scenario output"]
      }
    ]
  },
  {
    id: "de-azoren",
    market: "de",
    language: "de",
    country: "DE",
    geo: "DE",
    trendSeed: "azoren",
    searchQuery: "Azores travel guide 2026 best islands itinerary",
    serpLocale: "gl=de hl=de",
    selectedBecause: "Germany travel trend where guide pages win with itinerary tables, map-like structure, and island-by-island fit.",
    topSites: [
      {
        title: "Complete Azores Island Hopping Guide - Travel Azores",
        url: "https://travel-azores.com/en/magazine/guia-completo-de-island-hopping-nos-acores",
        pageType: "travel itinerary guide",
        signals: ["itinerary blocks", "island-by-island grouping", "route logistics"]
      },
      {
        title: "Which Islands to Visit in the Azores? - Geeky Explorer",
        url: "https://www.geekyexplorer.com/best-islands-azores-itinerary/",
        pageType: "travel guide",
        signals: ["style-based recommendations", "island comparison", "updated date"]
      },
      {
        title: "Visit Azores",
        url: "https://www.visitazores.com/en",
        pageType: "official destination hub",
        signals: ["visual destination cards", "official navigation", "planning categories"]
      },
      {
        title: "Azores Getaways",
        url: "https://www.azoresgetaways.com/en-us/destination/azores",
        pageType: "travel hub",
        signals: ["package-oriented UX", "destination overview", "visual itinerary cards"]
      },
      {
        title: "The Azores - Lonely Planet",
        url: "https://www.lonelyplanet.com/portugal/the-azores",
        pageType: "destination guide",
        signals: ["overview first", "things-to-do sections", "travel planning hierarchy"]
      }
    ]
  },
  {
    id: "de-olympia-hamburg",
    market: "de",
    language: "de",
    country: "DE",
    geo: "DE",
    trendSeed: "olympia hamburg",
    searchQuery: "Olympia Hamburg 2026 referendum guide",
    serpLocale: "gl=de hl=de",
    selectedBecause: "Germany civic trend where official pages use accessibility links, voting steps, downloads, and side navigation.",
    topSites: [
      {
        title: "Informationen zum Olympia-Referendum 2026 - hamburg.de",
        url: "https://www.hamburg.de/politik-und-verwaltung/behoerden/behoerde-fuer-inneres-und-sport/themen/wahlen/informationen-olympia-referendum-1160924",
        pageType: "official referendum page",
        signals: ["official date/time", "download block", "accessibility links"]
      },
      {
        title: "Wichtige Hinweise vor der Abstimmung - hamburg.de",
        url: "https://www.hamburg.de/politik-und-verwaltung/behoerden/behoerde-fuer-inneres-und-sport/presseservice/pressemeldungen/olympia-referendum-am-31-mai-2026-1178294",
        pageType: "official notice",
        signals: ["action timing", "threshold explanation", "contact path"]
      },
      {
        title: "Ihre Stimme für Olympia und Paralympics in Hamburg - hamburg.de",
        url: "https://www.hamburg.de/olympia/ihre-stimme-fuer-olympia-und-paralympics-in-hamburg-1155878",
        pageType: "official campaign explainer",
        signals: ["how-to-vote section", "plain-language support", "official story flow"]
      },
      {
        title: "Olympia-Bewerbung: Deine Stadt, deine Stimme, deine Spiele - hamburg.de",
        url: "https://www.hamburg.de/politik-und-verwaltung/behoerden/behoerde-fuer-inneres-und-sport/olympia-bewerbung-deine-stadt-deine-stimme-deine-spiele-buergerbeteiligung-startet-im-november-1109128",
        pageType: "civic explainer",
        signals: ["public participation framing", "benefit sections", "official visuals"]
      },
      {
        title: "Bürgerschaftsreferendum von 2026 - Wikipedia",
        url: "https://de.wikipedia.org/wiki/B%C3%BCrgerschaftsreferendum_von_2026_%C3%BCber_die_Bewerbung_Hamburgs_f%C3%BCr_die_Olympischen_Spiele",
        pageType: "reference page",
        signals: ["structured reference", "context links", "neutral chronology"]
      }
    ]
  },
  {
    id: "it-bali",
    market: "it",
    language: "it",
    country: "IT",
    geo: "IT",
    trendSeed: "bali",
    searchQuery: "Bali travel guide 2026 guida Bali",
    serpLocale: "gl=it hl=it",
    selectedBecause: "Italy travel trend where top travel pages use visual hero media, budget boxes, entry checklist, and itinerary sections.",
    topSites: [
      {
        title: "Bali Travel Guide 2026",
        url: "https://itsbusinessmarket.com/bali-travel-guide/",
        pageType: "travel guide",
        signals: ["budget planner", "itinerary map mention", "long table of contents"]
      },
      {
        title: "Viajar a Bali en 2026 - En Bali",
        url: "https://enbali.net/viajar-a-bali-2026/",
        pageType: "resident guide",
        signals: ["updated label", "local expertise", "planning checklist"]
      },
      {
        title: "Bali travel guide - Lonely Planet",
        url: "https://www.lonelyplanet.com/indonesia/bali",
        pageType: "destination guide",
        signals: ["visual destination hub", "things to do", "planning hierarchy"]
      },
      {
        title: "Bali Travel Guide - Travel + Leisure",
        url: "https://www.travelandleisure.com/travel-guide/bali",
        pageType: "destination guide",
        signals: ["hero image", "best-time sections", "where-to-stay flow"]
      },
      {
        title: "Bali Holiday Secrets",
        url: "https://www.baliholidaysecrets.com/",
        pageType: "local travel guide",
        signals: ["local tips", "destination navigation", "planning cards"]
      }
    ]
  },
  {
    id: "nl-nl-alert",
    market: "nl",
    language: "nl",
    country: "NL",
    geo: "NL",
    trendSeed: "nl alert",
    searchQuery: "NL Alert test Netherlands what to do guide",
    serpLocale: "gl=nl hl=nl",
    selectedBecause: "Netherlands public-warning trend where official pages lead with immediate action and accessibility.",
    topSites: [
      {
        title: "NL-Alert Home",
        url: "https://www.nl-alert.nl/",
        pageType: "official public-warning hub",
        signals: ["current/test message", "what to do", "app/support blocks"]
      },
      {
        title: "Wat moet ik doen als de sirene gaat? - Rijksoverheid",
        url: "https://www.rijksoverheid.nl/onderwerpen/veiligheidsregios-en-crisisbeheersing/vraag-en-antwoord/wat-moet-ik-doen-als-de-sirene-gaat",
        pageType: "official FAQ",
        signals: ["question title", "step-by-step instructions", "accessibility read-aloud"]
      },
      {
        title: "What should I do when the public warning siren sounds? - Government.nl",
        url: "https://www.government.nl/faq/what-to-do-when-the-public-warning-siren-sounds",
        pageType: "official FAQ",
        signals: ["English alternate", "action bullets", "official answer"]
      },
      {
        title: "Factsheet NL-Alert",
        url: "https://www.nl-alert.nl/binaries/nlalert/documenten/publicaties/2024/05/21/factsheet-nl-alert-eng/DT%2B-%2BNL-Alert_A4_Factsheet_EN_test_message_3juni2024.pdf",
        pageType: "official factsheet PDF",
        signals: ["one-page summary", "visual warning example", "test-message explanation"]
      },
      {
        title: "NL-Alert - Wikipedia",
        url: "https://en.wikipedia.org/wiki/NL-Alert",
        pageType: "reference page",
        signals: ["history/context", "usage explanation", "neutral structure"]
      }
    ]
  },
  {
    id: "pl-wizzair",
    market: "pl",
    language: "pl",
    country: "PL",
    geo: "PL",
    trendSeed: "wizzair",
    searchQuery: "Wizz Air baggage guide 2026 Poland",
    serpLocale: "gl=pl hl=pl",
    selectedBecause: "Poland airline trend where top pages win with baggage dimensions, fee tables, and exception warnings.",
    topSites: [
      {
        title: "Wizz Air bagaż podręczny i rejestrowany - Rankomat",
        url: "https://rankomat.pl/turystyka/wizz-air-bagaz-podreczny-i-rejestrowany",
        pageType: "travel insurance guide",
        signals: ["dimension answer first", "reviewer/author", "important-info bullets"]
      },
      {
        title: "Wizz Air 2026 Zasady bagażowe - BaggyOne",
        url: "https://baggyone.com/pl-PL/airlines/wizz-air-w6-wzz",
        pageType: "baggage reference",
        signals: ["allowance data", "airline-specific route", "compact rules"]
      },
      {
        title: "Wizz Air Cabin Baggage & Hand Luggage Allowance",
        url: "https://www.cabincleared.com/wizz-air-cabin-baggage-hand-luggage-allowance",
        pageType: "baggage guide",
        signals: ["2026 guide label", "FAQ answers", "packing advice"]
      },
      {
        title: "Wizz Air bagaż 2026 - Meteoreporter",
        url: "https://meteoreporter.pl/wizz-air-bagaz-2026-wymiary-waga-i-jak-uniknac-oplat",
        pageType: "baggage guide",
        signals: ["how to avoid fees", "dimensions", "fee warnings"]
      },
      {
        title: "Wizz Air Baggage",
        url: "https://wizzair.com/en-gb/information-and-services/travel-information/baggage",
        pageType: "official airline guide",
        signals: ["official policy", "fee/allowance modules", "service hierarchy"]
      }
    ]
  },
  {
    id: "tr-ozempic",
    market: "tr",
    language: "tr",
    country: "TR",
    geo: "TR",
    trendSeed: "ozempic",
    searchQuery: "Ozempic nedir yan etkileri rehber Türkiye 2026",
    serpLocale: "gl=tr hl=tr",
    selectedBecause: "Turkey health trend where safe UX needs medical review, contraindications, and no unsupported weight-loss claims.",
    topSites: [
      {
        title: "GLP-1 İlaçlar Ozempic gibi Nedir? - Anadolu Sağlık",
        url: "https://www.anadolusaglik.org/saglik-rehberi/ozempic-nedir-ozempic-yan-etkileri-nelerdir",
        pageType: "hospital health guide",
        signals: ["medical publication board", "update date", "general-information disclaimer"]
      },
      {
        title: "Semaglutid Ozempic Nedir? - Prof. Dr. Mustafa Özdoğan",
        url: "https://www.drozdogan.com/semaglutid-ozempic-nedir-fda-onayi-turkiye-ruhsati-ve-geri-odeme-durumu/",
        pageType: "doctor-authored guide",
        signals: ["approval status", "side-effect profile", "contraindication warnings"]
      },
      {
        title: "Ozempic Side Effects - Healthline",
        url: "https://www.healthline.com/health/drugs/ozempic-side-effects",
        pageType: "medically reviewed health guide",
        signals: ["medical reviewer", "key takeaways", "warning sections"]
      },
      {
        title: "Ozempic Side Effects to Watch For - Drugs.com",
        url: "https://www.drugs.com/medical-answers/4-key-ozempic-side-effects-watch-3573389/",
        pageType: "drug reference",
        signals: ["official answer format", "review date", "side-effect bullets"]
      },
      {
        title: "Ozempic Side Effects: Common, Serious and Long Term - Drugs.com",
        url: "https://www.drugs.com/sfx/ozempic-side-effects.html",
        pageType: "drug reference",
        signals: ["long side-effect list", "review attribution", "severity grouping"]
      }
    ]
  },
  {
    id: "kr-department-store",
    market: "kr",
    language: "ko",
    country: "KR",
    geo: "KR",
    trendSeed: "백화점",
    searchQuery: "백화점 세일 2026 쇼핑 가이드",
    serpLocale: "gl=kr hl=ko",
    selectedBecause: "Korea retail trend where useful pages clarify sale period, participating stores, returns, and shopping decision cues.",
    topSites: [
      {
        title: "백화점 3사 봄 세일 돌입 - 네이트 뉴스",
        url: "https://m.news.nate.com/view/20260325n09767",
        pageType: "retail event explainer",
        signals: ["sale dates", "brand participation", "event context"]
      },
      {
        title: "트렌드+ 봄날엔 쇼핑 - Daum",
        url: "https://v.daum.net/v/9nbbebJ6A8",
        pageType: "retail trend explainer",
        signals: ["campaign image", "store comparison", "seasonal shopping context"]
      },
      {
        title: "백화점 3사, 봄 정기 세일 돌입 - Daum",
        url: "https://v.daum.net/v/BrNGjWztSY?f=p",
        pageType: "retail event explainer",
        signals: ["date answer", "department-store comparison", "promotion summary"]
      },
      {
        title: "2026 백화점 가을세일 가격 보장 및 환불 교환 팁",
        url: "https://9leedo.com/2026-%EB%B0%B1%ED%99%94%EC%A0%90-%EA%B0%80%EC%9D%84%EC%84%B8%EC%9D%BC-%EA%B0%80%EA%B2%A9-%EB%B3%B4%EC%9E%A5-%EB%B0%8F-%ED%99%98%EB%B6%88-%EA%B5%90%ED%99%98-%ED%8C%81/",
        pageType: "shopping guide",
        signals: ["tips headline", "refund/exchange focus", "consumer decision framing"]
      },
      {
        title: "백화점 아기옷 브랜드 완벽 가이드 2026",
        url: "https://fellow744.tistory.com/entry/%EB%B0%B1%ED%99%94%EC%A0%90-%EC%95%84%EA%B8%B0%EC%98%B7-%EB%B8%8C%EB%9E%9C%EB%93%9C-%EC%99%84%EB%B2%BD-%EA%B0%80%EC%9D%B4%EB%93%9C-2026%EB%85%84-%EC%B5%9C%EC%8B%A0-%ED%8A%B8%EB%A0%8C%EB%93%9C-%EC%86%8C%EA%B0%9C",
        pageType: "shopping blog guide",
        signals: ["category guide", "brand comparison", "consumer checklist potential"]
      }
    ]
  },
  {
    id: "in-pm-kisan",
    market: "in",
    language: "en",
    country: "IN",
    geo: "IN",
    trendSeed: "pm kisan",
    searchQuery: "PM Kisan status check official guide 2026",
    serpLocale: "gl=in hl=en",
    selectedBecause: "India government-scheme trend where useful pages must separate official portal actions from unofficial guides.",
    topSites: [
      {
        title: "PM-Kisan Samman Nidhi",
        url: "https://pmkisan.gov.in/homenew.aspx",
        pageType: "official scheme page",
        signals: ["official status", "beneficiary tools", "eligibility notices"]
      },
      {
        title: "How to Check PM Kisan Beneficiary Status by Mobile Number - SMC Insurance",
        url: "https://www.smcinsurance.com/government-schemes/articles/pm-kisan-beneficiary-status-by-mobile-number",
        pageType: "scheme guide",
        signals: ["step-by-step path", "installment context", "last updated date"]
      },
      {
        title: "PM Kisan Status Check by Aadhaar & Mobile - Kisan Portal",
        url: "https://kisanportal.org/pm-kisan-status-check-by-aadhaar-mobile/",
        pageType: "scheme guide",
        signals: ["official-channel warning", "problem diagnosis", "step list"]
      },
      {
        title: "How to check PM-KISAN beneficiary status - RTI Wiki",
        url: "https://righttoinformation.wiki/check-status/pm-kisan-status",
        pageType: "citizen guide",
        signals: ["official portal instruction", "status history", "disclaimer"]
      },
      {
        title: "PM Kisan Beneficiary Status",
        url: "https://pmkisan.app/",
        pageType: "status guide",
        signals: ["status CTA", "installment summary", "beneficiary-list framing"]
      }
    ]
  },
  {
    id: "in-voter-card",
    market: "in",
    language: "en",
    country: "IN",
    geo: "IN",
    trendSeed: "voter card",
    searchQuery: "Election Commission India voter card apply online official guide 2026",
    serpLocale: "gl=in hl=en",
    selectedBecause: "India voter-service trend where top pages combine official routes, form numbers, document lists, and status tracking.",
    topSites: [
      {
        title: "New Voter Card Apply Online - WBCareer",
        url: "https://wbcareer.org/new-voter-card-apply-online-complete-step-by-step-guide-2026-updated/",
        pageType: "citizen service guide",
        signals: ["step-by-step title", "official website path", "verification status"]
      },
      {
        title: "Voter ID Card 2026 - ClearTax",
        url: "https://cleartax.in/s/voter-id",
        pageType: "service guide",
        signals: ["document requirements", "status tracking", "application process"]
      },
      {
        title: "Voters' Services Portal",
        url: "https://voters.eci.gov.in/",
        pageType: "official service portal",
        signals: ["form/service navigation", "login/service CTA", "official authority"]
      },
      {
        title: "Election Commission of India",
        url: "https://www.eci.gov.in/",
        pageType: "official hub",
        signals: ["official notices", "navigation hierarchy", "download resources"]
      },
      {
        title: "Voter Guide Booklet - Maharashtra CEO",
        url: "https://ceoelection.maharashtra.gov.in/Downloads/pdf/ELC-Resources/English/Voter%20Guide%20Booklet-English.pdf",
        pageType: "official PDF guide",
        signals: ["official guidebook", "registration path", "download format"]
      }
    ]
  }
];
