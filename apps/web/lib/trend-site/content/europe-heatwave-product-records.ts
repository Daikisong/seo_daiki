import { generatedProductDecisions } from "./product-decisions";
import { heatwaveBenchmarkProductRecords } from "./heatwave-benchmark-product-records";
import type { ProductRecord } from "./product-record-types";

function heatwaveBenchmarkRecord(
  name: string,
  overrides: Partial<ProductRecord>,
): ProductRecord {
  const record = heatwaveBenchmarkProductRecords.find(
    (candidate) => candidate.name === name,
  );
  if (!record) {
    throw new Error(`Missing heatwave benchmark record: ${name}`);
  }
  return { ...record, ...overrides };
}

export const europeHeatwaveProductRecords: ProductRecord[] = [
  {
    name: "Midea PortaSplit 12000 BTU Mobile Split Air Conditioner",
    exactVariant:
      "Midea PortaSplit 12000 BTU / 3.5 kW Mobile Split Air Conditioner",
    brandClaim: "Midea",
    rankLabel: "Best Europe-first heatwave AC",
    watts: "12000",
    verifiedClaimType: "cooling-capacity",
    verifiedClaimUnit: "BTU",
    price: 1067.6,
    priceLabel: "EUR 1,067.60",
    priceCountry: "IT",
    priceCurrency: "EUR",
    riskCountry: "EU",
    merchantUrl:
      "https://www.idealo.it/confronta-prezzi/204374464/midea-portasplit-3-5-kw.html",
    merchantUrlKind: "marketplace-search-route",
    sourceUrl:
      "https://www.midea.com/uk/air-treatment/porta-split-air-conditioner.portasplit",
    sourceLabel: "Midea UK PortaSplit product page",
    reviewSourceUrl:
      "https://www.idealo.it/confronta-prezzi/204374464/midea-portasplit-3-5-kw.html",
    reviewSourceLabel: "Idealo Europe PortaSplit price and review signal",
    marketplaceSourceLabel: "Italy / Europe price-comparison page",
    priceCheckedAt: "2026-06-29",
    imageUrl:
      "https://www.midea.com/content/dam/midea-aem/uk/air-treatment/porta-split-air-conditioner/PortaSplit-Product-1.png",
    imageAlt: "Midea PortaSplit mobile split air conditioner",
    productKind: "Europe-local mobile split compressor AC",
    regionFit:
      "Europe-first fit for Germany, Italy, UK, and nearby local-stock listings",
    coolingCapacity: "12,000 BTU / 3.5 kW",
    hoseType: "Mobile split setup with indoor and outdoor units",
    noiseLevel:
      "Silent mode down to 39 dB on Midea's product page; verify installation conditions.",
    roomSize:
      "Medium European rooms where the outdoor unit can be placed safely.",
    voltagePlug:
      "Europe/UK local listings; confirm country plug, bracket kit, and warranty",
    returnRiskLabel: "Check stock and heavy-appliance returns",
    specSummary:
      "Midea lists PortaSplit as a 12,000 BTU / 3.5 kW mobile split air conditioner with A++ cooling, silent mode down to 39 dB, and no technician-required installation.",
    reviewSummary:
      "European price and availability signals make PortaSplit the most relevant Midea option for this topic because it is built around local voltage, local retail stock, and heatwave demand.",
    safetyNote:
      "Best first check for European heatwave buyers, but the balcony/window mounting setup, stock status, and heavy return pickup still need to fit the room.",
    bestFor:
      "European renters who want stronger real cooling without installing a permanent split system.",
    decision:
      generatedProductDecisions[
        "Midea PortaSplit 12000 BTU Mobile Split Air Conditioner"
      ],
    keyCheck:
      "Confirm local stock, included outdoor-unit support, window/balcony fit, and bulky return pickup before paying heatwave pricing.",
    keyFeatures: [
      "12,000 BTU / 3.5 kW cooling",
      "A++ cooling class",
      "Mobile split design",
    ],
    bestTake:
      "PortaSplit is the first product I would check for this specific Europe heatwave angle because it solves the mismatch that hurts many imported portable AC buys: local voltage, real room cooling, and a setup designed for European renters. It is still a heavy appliance, so I would only buy it from a seller with visible stock and realistic return terms.",
    pros: [
      "Europe-local mobile split design is more relevant than importing a US portable AC.",
      "12,000 BTU / 3.5 kW output is credible for real room cooling.",
      "The indoor/outdoor split format avoids some single-hose portable AC compromises.",
    ],
    cons: [
      "More expensive and more involved to place than a normal monoblock portable AC.",
      "Balcony, sill, bracket, and hose routing can break the setup in some flats.",
      "Heatwave demand can push stock and delivery dates out quickly.",
    ],
    reviewCount: 24,
    certificationRisk: "low",
    returnRisk: "medium",
  },
  heatwaveBenchmarkRecord(
    "De'Longhi Pinguino GentleJet Inverter Portable Air Conditioner",
    {
      rankLabel: "Best premium Europe-local monoblock AC",
      merchantUrl:
        "https://www.delonghi.com/en-gb/p/portable-air-conditioners-pinguino-gentlejet-inverter-portable-air-conditioner-pacap130igentlejet/PACAP130IGENTLEJET.html?pid=0151455007",
      merchantUrlKind: "merchant-product-page",
      priceCountry: "GB",
      priceCurrency: "GBP",
      riskCountry: "GB",
      verifiedClaimType: "cooling-capacity",
      verifiedClaimUnit: "BTU",
      regionFit:
        "Premium Europe-first fit for UK and nearby local-stock listings",
      returnRiskLabel: "Premium local warranty and return terms required",
    },
  ),
  {
    name: "Olimpia Splendid Dolceclima Air Pro 14 HP WiFi",
    exactVariant: "Olimpia Splendid Dolceclima Air Pro 14 HP WiFi",
    brandClaim: "Olimpia Splendid",
    rankLabel: "Best Southern Europe high-output portable AC",
    watts: "14000",
    verifiedClaimType: "cooling-capacity",
    verifiedClaimUnit: "BTU",
    price: 579,
    priceLabel: "EUR 579",
    priceCountry: "ES",
    priceCurrency: "EUR",
    riskCountry: "EU",
    merchantUrl:
      "https://www.pccomponentes.com/olimpia-splendid-dolceclima-air-pro-14-hp-wifi-aire-acondicionado-portatil-frio-calor-3500-frigorias",
    merchantUrlKind: "merchant-product-page",
    sourceUrl:
      "https://www.olimpiasplendid.com/air-conditioners/airconditioners-portables/dolceclima-air-pro-14-hp",
    sourceLabel: "Olimpia Splendid Air Pro 14 HP product page",
    reviewSourceUrl:
      "https://www.pccomponentes.com/olimpia-splendid-dolceclima-air-pro-14-hp-wifi-aire-acondicionado-portatil-frio-calor-3500-frigorias",
    reviewSourceLabel: "PCComponentes Spain retail listing",
    marketplaceSourceLabel: "Spain / EU appliance retailer page",
    priceCheckedAt: "2026-06-29",
    imageUrl: "https://media.s-bol.com/YWOVNXOQV5q2/924x1200.jpg",
    imageAlt:
      "Olimpia Splendid Dolceclima Air Pro 14 HP WiFi portable air conditioner",
    productKind: "Europe-local real compressor portable AC",
    regionFit:
      "Spain, Italy, Benelux, and nearby EU listings when exact HP/WiFi variant is in stock",
    coolingCapacity: "14,000 BTU / 3.5 kW class",
    hoseType: "Single-hose monoblock portable setup",
    noiseLevel:
      "High-output monoblock noise; verify dB and sleep-mode reviews before bedroom use.",
    roomSize:
      "Medium-to-larger Southern Europe rooms when hose routing is practical.",
    voltagePlug:
      "220-240 V EU listing; confirm plug, warranty country, and heat-pump variant",
    returnRiskLabel: "Heavy local-retailer return risk",
    specSummary:
      "Olimpia Splendid positions Air Pro 14 HP as a high-output portable AC line with heat-pump functionality and app-enabled variants for European homes.",
    reviewSummary:
      "Spanish and EU retailer listings make this a practical local-stock option for buyers who need a strong monoblock AC without importing a non-local heavy appliance.",
    safetyNote:
      "Useful for hotter Southern European rooms, but the exact Air Pro 14 HP/WiFi suffix and return pickup need to be visible before checkout.",
    bestFor:
      "Spain, Italy, and nearby EU buyers who need a powerful local portable AC.",
    decision:
      generatedProductDecisions[
        "Olimpia Splendid Dolceclima Air Pro 14 HP WiFi"
      ],
    keyCheck:
      "Confirm Air Pro 14 HP/WiFi suffix, local stock, delivery date, noise expectations, and return pickup.",
    keyFeatures: [
      "14,000 BTU class cooling",
      "Heat-pump variant",
      "WiFi/app support on matching model",
    ],
    bestTake:
      "Olimpia Splendid is the high-output local appliance pick. I like it for Southern Europe because the brand and retailer availability feel more realistic than importing a random compressor unit during a heatwave. The tradeoff is weight, noise, and exact-variant confusion.",
    pros: [
      "Strong cooling class for hotter EU rooms.",
      "Local appliance retailers are more practical than cross-border heavy imports.",
      "Heat-pump and WiFi variants can add value after summer.",
    ],
    cons: [
      "Variant suffixes can be confusing across retailers.",
      "Higher-output monoblock ACs are not quiet or light.",
      "Returns need clear local heavy-goods terms.",
    ],
    reviewCount: 67,
    certificationRisk: "low",
    returnRisk: "medium",
  },
  {
    name: "MeacoCool MC Series Pro 10000 BTU Portable Air Conditioner",
    exactVariant: "MeacoCool MC Series Pro 10000 BTU Portable Air Conditioner",
    brandClaim: "Meaco",
    rankLabel: "Best UK bedroom and office pick",
    watts: "10000",
    verifiedClaimType: "cooling-capacity",
    verifiedClaimUnit: "BTU",
    price: 399.99,
    priceLabel: "GBP 399.99",
    priceCountry: "GB",
    priceCurrency: "GBP",
    riskCountry: "GB",
    merchantUrl:
      "https://www.diy.com/departments/meacocool-mc-series-pro-10000-btu-portable-air-conditioner/5060409604396_BQ.prd",
    merchantUrlKind: "merchant-product-page",
    sourceUrl:
      "https://www.diy.com/departments/meacocool-mc-series-pro-10000-btu-portable-air-conditioner/5060409604396_BQ.prd",
    sourceLabel: "B&Q MeacoCool MC Series Pro listing",
    reviewSourceUrl: "https://www.meaco.com/collections/air-conditioners",
    reviewSourceLabel: "Meaco UK air-conditioner stock page",
    marketplaceSourceLabel: "UK local retailer page",
    priceCheckedAt: "2026-06-29",
    imageUrl:
      "https://aircareappliances.co.uk/cdn/shop/files/MeacoCoolAirconSmall10000.jpg?crop=center&height=1200&v=1720611716&width=1200",
    imageAlt: "MeacoCool MC Series Pro 10000 BTU portable air conditioner",
    productKind: "UK-local real compressor portable AC",
    regionFit:
      "UK fit for bedrooms, offices, and medium rooms when stock is live",
    coolingCapacity: "10,000 BTU",
    hoseType: "Single-hose portable setup with window kit",
    noiseLevel:
      "Bedroom/office candidate; verify Meaco listed dB and quiet-mode reviews.",
    roomSize: "Small-to-medium UK rooms where 10,000 BTU is enough.",
    voltagePlug: "220-240 V UK listing; confirm included kit and guarantee",
    returnRiskLabel: "Stock-date and local return risk",
    specSummary:
      "B&Q lists the MeacoCool MC Series Pro 10000 BTU model as a UK portable AC with 220-240 V support and mainstream retailer handling.",
    reviewSummary:
      "Meaco stock signals and UK retailer data make this a practical buy when the buyer wants local delivery and returns more than a high-output import.",
    safetyNote:
      "Good for one room, not an open-plan flat; check stock, delivery date, window kit, and noise before treating it as a heatwave fix.",
    bestFor:
      "UK buyers cooling a bedroom, office, or medium room with local return terms.",
    decision:
      generatedProductDecisions[
        "MeacoCool MC Series Pro 10000 BTU Portable Air Conditioner"
      ],
    keyCheck:
      "Confirm stock date, 220-240 V UK fit, window-kit contents, room size, and return handling.",
    keyFeatures: ["10,000 BTU cooling", "UK retailer page", "Medium-room fit"],
    bestTake:
      "MeacoCool is the sensible UK pick when the room is not huge and the buyer wants a local seller. I would not stretch it into a sun-facing open-plan flat, but for a bedroom or office it is exactly the kind of boring, verifiable option that beats a risky import.",
    pros: [
      "Local UK stock makes delivery and returns more realistic.",
      "10,000 BTU class is enough for many single-room heatwave problems.",
      "Better fit for practical buyers than no-name imported AC listings.",
    ],
    cons: [
      "Stock can disappear during hot spells.",
      "Single-hose performance depends heavily on window sealing.",
      "Not enough capacity for large or open-plan rooms.",
    ],
    reviewCount: 38,
    certificationRisk: "low",
    returnRisk: "low",
  },
  {
    name: "Duux North Smart Air Conditioner 9K BTU",
    exactVariant: "Duux North Smart Air Conditioner 9K BTU DXMA22UK",
    brandClaim: "Duux",
    rankLabel: "Best stylish small-room smart AC",
    watts: "9000",
    verifiedClaimType: "cooling-capacity",
    verifiedClaimUnit: "BTU",
    price: 599,
    priceLabel: "GBP 599",
    priceCountry: "GB",
    priceCurrency: "GBP",
    riskCountry: "GB",
    merchantUrl:
      "https://www.amazon.co.uk/Duux-DXMA22UK-North-Smart-Conditioner/dp/B0C46GJDMB",
    merchantUrlKind: "merchant-product-page",
    sourceUrl:
      "https://duux.co.uk/product/north-smart-air-conditioner-9k-btu-h-silent-with-heating-function-grey/",
    sourceLabel: "Duux North 9K product page",
    reviewSourceUrl:
      "https://www.idealhome.co.uk/all-rooms/duux-north-9k-smart-air-conditioner-review",
    reviewSourceLabel: "Ideal Home Duux North 9K review",
    marketplaceSourceLabel: "UK local retailer / Amazon UK page",
    priceCheckedAt: "2026-06-29",
    imageUrl:
      "https://cdn.mos.cms.futurecdn.net/zTFBBjWT3CaA4VzPGCjFan-1280-80.jpg.webp",
    imageAlt: "Duux North Smart Air Conditioner 9K BTU",
    productKind: "UK / Europe real compressor portable AC",
    regionFit:
      "Small-room UK and nearby Europe fit when live stock and support are available",
    coolingCapacity: "9,000 BTU",
    hoseType: "Single-hose smart portable setup with window kit",
    noiseLevel: "Check current Amazon UK dB and bedroom-use complaints.",
    roomSize: "Small rooms and home offices where a 9K class unit is enough.",
    voltagePlug:
      "220-240 V UK listing; confirm plug, stock status, and warranty",
    returnRiskLabel: "Availability and heavy-goods return risk",
    specSummary:
      "Duux North 9K is a smart portable AC class product with cooling, heating, dehumidifying, remote/app control, and listed 220-240 V support.",
    reviewSummary:
      "Ideal Home's review signal highlights the stylish design, smart control, included window kit, and the practical drawbacks: price, noise, weight, and not being the most powerful option.",
    safetyNote:
      "Best treated as a small-room comfort AC, not a whole-flat heatwave rescue product.",
    bestFor:
      "Bedrooms and smaller rooms where design, app control, and included kit matter.",
    decision:
      generatedProductDecisions["Duux North Smart Air Conditioner 9K BTU"],
    keyCheck:
      "Confirm live stock, 9,000 BTU fit, included window kit, noise tolerance, and heavy-goods returns.",
    keyFeatures: [
      "9,000 BTU cooling",
      "Smart app control",
      "Window kit included on matching listing",
    ],
    bestTake:
      "Duux is the stylish small-room option. I would choose it for a bedroom or office where app control and appearance matter, but I would be strict about room size because the 9K class can disappoint when the heat load is bigger than the marketing photo suggests.",
    pros: [
      "More polished design than many boxy portable ACs.",
      "Smart control and included kit are useful for renters.",
      "A real compressor AC, not a decorative mini cooler.",
    ],
    cons: [
      "Expensive for the 9,000 BTU class.",
      "Noise and weight still matter despite the smart design.",
      "Availability can be inconsistent during heatwave demand.",
    ],
    reviewCount: 42,
    certificationRisk: "low",
    returnRisk: "medium",
  },
  {
    name: "electriQ EcoSilent 10000 BTU Smart Quiet Portable Air Conditioner",
    exactVariant:
      "electriQ EcoSilent10W 10000 BTU Smart Quiet Portable Air Conditioner",
    brandClaim: "electriQ",
    rankLabel: "Best UK value smart AC",
    watts: "10000",
    verifiedClaimType: "cooling-capacity",
    verifiedClaimUnit: "BTU",
    price: 749.97,
    priceLabel: "GBP 749.97",
    priceCountry: "GB",
    priceCurrency: "GBP",
    riskCountry: "GB",
    merchantUrl:
      "https://www.electriq.co.uk/p/ecosilent10w/electriq-ecosilent10w",
    merchantUrlKind: "merchant-product-page",
    sourceUrl:
      "https://www.electriq.co.uk/p/ecosilent10w/electriq-ecosilent10w",
    sourceLabel: "electriQ EcoSilent10W product page",
    reviewSourceUrl:
      "https://www.idealhome.co.uk/buying-guide-reviews/best-portable-air-conditioners-241345",
    reviewSourceLabel: "Ideal Home portable AC guide context",
    marketplaceSourceLabel: "Buy It Direct / Aircon Direct UK page",
    priceCheckedAt: "2026-06-29",
    imageUrl: "https://www.electriq.co.uk/images/EcoSilent10W_1_Classic.jpg",
    imageAlt:
      "electriQ EcoSilent 10000 BTU smart quiet portable air conditioner",
    productKind: "UK-local real compressor portable AC",
    regionFit:
      "UK value fit when exact EcoSilent10W or listed replacement model is available",
    coolingCapacity: "10,000 BTU",
    hoseType: "Single-hose smart portable setup",
    noiseLevel:
      "EcoSilent-positioned UK model; verify current dB and compressor complaints.",
    roomSize:
      "Small-to-medium UK rooms where quiet operation matters more than maximum capacity.",
    voltagePlug:
      "220-240 V UK listing; confirm exact replacement, plug, and warranty",
    returnRiskLabel: "Similar-model substitution risk",
    specSummary:
      "electriQ lists EcoSilent10W as a 10,000 BTU smart quiet portable AC for medium rooms with local UK appliance-retailer support.",
    reviewSummary:
      "UK guide and retailer signals make it a local-value comparison point, especially when buyers need to compare replacement models instead of assuming every 10,000 BTU listing is equivalent.",
    safetyNote:
      "Useful only when the exact product or replacement model is clear; do not assume a suggested alternative has the same noise, kit, or capacity profile.",
    bestFor:
      "UK buyers who want smart controls and a local appliance seller at the 10,000 BTU class.",
    decision:
      generatedProductDecisions[
        "electriQ EcoSilent 10000 BTU Smart Quiet Portable Air Conditioner"
      ],
    keyCheck:
      "Confirm exact EcoSilent10W availability or compare any suggested replacement model line by line.",
    keyFeatures: [
      "10,000 BTU cooling",
      "Smart-control support",
      "UK appliance-retailer support",
    ],
    bestTake:
      "electriQ is the value-style UK pick I would use when the buyer wants a local seller and clear specs. The caution is replacement drift: if the exact model is out, compare the substitute rather than treating all 10K portable ACs as the same product.",
    pros: [
      "A UK appliance retailer is more practical than a vague import.",
      "10,000 BTU class is a useful medium-room target.",
      "Smart features help when pre-cooling a room before sleep or work.",
    ],
    cons: [
      "Exact model availability can shift.",
      "Single-hose setup still needs good window sealing.",
      "Replacement models may differ in noise, kit, and warranty details.",
    ],
    reviewCount: 31,
    certificationRisk: "low",
    returnRisk: "medium",
  },
  {
    name: "Russell Hobbs RHPAC3001 3 in 1 Portable Air Conditioner",
    exactVariant: "Russell Hobbs RHPAC3001 3 in 1 Portable Air Conditioner",
    brandClaim: "Russell Hobbs",
    rankLabel: "Best UK small-room retailer pick",
    watts: "7000",
    verifiedClaimType: "cooling-capacity",
    verifiedClaimUnit: "BTU",
    price: 299,
    priceLabel: "GBP 299",
    priceCountry: "GB",
    priceCurrency: "GBP",
    riskCountry: "GB",
    merchantUrl:
      "https://www.currys.co.uk/products/russell-hobbs-rhpac3001-3-in-1-portable-air-conditioner-white-10207859.html",
    merchantUrlKind: "merchant-product-page",
    sourceUrl:
      "https://www.currys.co.uk/products/russell-hobbs-rhpac3001-3-in-1-portable-air-conditioner-white-10207859.html",
    sourceLabel: "Currys Russell Hobbs RHPAC3001 listing",
    reviewSourceUrl:
      "https://www.currys.co.uk/products/russell-hobbs-rhpac3001-3-in-1-portable-air-conditioner-white-10207859.html",
    reviewSourceLabel: "Currys review and spec signal",
    marketplaceSourceLabel: "Currys UK retailer page",
    priceCheckedAt: "2026-06-29",
    imageUrl: "https://media.currys.biz/i/currysprod/10207859?fmt=auto",
    imageAlt: "Russell Hobbs RHPAC3001 portable air conditioner",
    productKind: "UK-local real compressor portable AC",
    regionFit: "UK small-room fit through Currys local delivery and returns",
    coolingCapacity: "2.05 kW cooling / small-room class",
    hoseType: "Single-hose portable setup",
    noiseLevel: "62-64 dB listed by Currys; not bedroom-silent.",
    roomSize: "14 m2 listed room fit; use only for a small room.",
    voltagePlug: "UK local listing; confirm 3-pin plug, delivery, and warranty",
    returnRiskLabel: "Two-man delivery and large-item return risk",
    specSummary:
      "Currys lists the RHPAC3001 as a 3-in-1 air conditioner, dehumidifier, and air cooler with 2.05 kW cooling, A energy class, 14 m2 room fit, remote control, and 62-64 dB noise.",
    reviewSummary:
      "Currys shows a strong local retail signal with a visible GBP 299 price and 111-review rating context, making this a practical UK small-room comparison point.",
    safetyNote:
      "Use it for a small room only; the listed room fit and noise level make it a poor match for large bedrooms or open-plan flats.",
    bestFor:
      "UK buyers who want a budget local retailer pick for one small room.",
    decision:
      generatedProductDecisions[
        "Russell Hobbs RHPAC3001 3 in 1 Portable Air Conditioner"
      ],
    keyCheck:
      "Confirm 14 m2 room fit, 62-64 dB noise tolerance, delivery timing, and large-item return process.",
    keyFeatures: [
      "2.05 kW cooling",
      "3-in-1 cooling/dehumidifier mode",
      "Currys UK local price",
    ],
    bestTake:
      "Russell Hobbs is the no-drama UK small-room pick. It is not the unit I would buy for a large sun-facing room, but at the local-retailer price it gives a buyer clear specs, a visible review signal, and return terms that are easier to understand than a cross-border import.",
    pros: [
      "Clear Currys price, spec, and review context.",
      "Good fit for small rooms where a 10K or 14K unit is unnecessary.",
      "Local UK support is easier to handle than an imported heavy appliance.",
    ],
    cons: [
      "Room-size fit is limited.",
      "Noise is not bedroom-silent.",
      "Large-item delivery and return handling still need checking.",
    ],
    reviewCount: 111,
    certificationRisk: "low",
    returnRisk: "medium",
  },
  {
    name: "Bush 9K Portable Air Conditioner",
    exactVariant: "Bush 9K Portable Air Conditioner",
    brandClaim: "Bush",
    rankLabel: "Best Argos budget 9K option",
    watts: "9000",
    verifiedClaimType: "cooling-capacity",
    verifiedClaimUnit: "BTU",
    price: 300,
    priceLabel: "GBP 300",
    priceCountry: "GB",
    priceCurrency: "GBP",
    riskCountry: "GB",
    merchantUrl: "https://www.argos.co.uk/product/7891092",
    merchantUrlKind: "merchant-product-page",
    sourceUrl: "https://www.argos.co.uk/product/7891092",
    sourceLabel: "Argos Bush 9K product page",
    reviewSourceUrl: "https://www.argos.co.uk/product/7891092",
    reviewSourceLabel: "Argos verified review and return signal",
    marketplaceSourceLabel: "Argos UK retailer page",
    priceCheckedAt: "2026-06-29",
    imageUrl:
      "https://media.4rgos.it/i/Argos/7891092_R_Z001A?w=750&h=440&qlt=70",
    imageAlt: "Bush 9K portable air conditioner",
    productKind: "UK-local real compressor portable AC",
    regionFit: "UK budget pick for one small room via Argos",
    coolingCapacity: "9,000 BTU",
    hoseType: "Single-hose portable setup with 150 cm hose",
    noiseLevel:
      "64 dB listed by Argos; check whether that is acceptable for night use.",
    roomSize: "Small-room budget fit; avoid for large or open-plan rooms.",
    voltagePlug:
      "UK local listing; confirm delivery and return collection terms",
    returnRiskLabel: "Paid collection return risk",
    specSummary:
      "Argos lists the Bush 9K as a 9,000 BTU A-class portable AC with cooling, fan, dry mode, 150 cm hose, castors, 24-hour timer, and 64 dB noise.",
    reviewSummary:
      "Argos shows a verified-review signal and explicitly states the large-item return collection cost, which is useful for heatwave buyers trying to judge real return friction.",
    safetyNote:
      "A sensible budget pick only when the room is small enough and the buyer accepts the stated noise and potential collection charge.",
    bestFor:
      "UK buyers who want a straightforward Argos budget unit for one small room.",
    decision: generatedProductDecisions["Bush 9K Portable Air Conditioner"],
    keyCheck:
      "Confirm 9,000 BTU is enough, 64 dB noise is acceptable, and the Argos return collection cost is acceptable.",
    keyFeatures: [
      "9,000 BTU output",
      "150 cm hose included",
      "Argos UK verified reviews",
    ],
    bestTake:
      "Bush is the budget UK fallback I would use when the buyer wants a clear local store more than a premium brand. The page is useful because it does not hide the tradeoffs: small room fit, 64 dB noise, and a return collection cost if the product is not faulty.",
    pros: [
      "Clear 9,000 BTU and hose details.",
      "Argos review and return information are easy to check.",
      "Useful lower-cost option during heatwave stock pressure.",
    ],
    cons: [
      "Only suitable for small rooms.",
      "64 dB noise can be too much for sleep.",
      "Non-fault returns may carry a collection charge.",
    ],
    reviewCount: 9,
    certificationRisk: "low",
    returnRisk: "medium",
  },
  {
    name: "electriQ Slimline 9000 BTU Portable Air Conditioner SF10000E",
    exactVariant:
      "electriQ Slimline 9000 BTU Portable Air Conditioner SF10000E",
    brandClaim: "electriQ",
    rankLabel: "Best slimline UK value pick",
    watts: "9000",
    verifiedClaimType: "cooling-capacity",
    verifiedClaimUnit: "BTU",
    price: null,
    priceLabel: "Check UK price",
    priceState: "unavailable",
    priceCountry: "GB",
    priceCurrency: "GBP",
    riskCountry: "GB",
    merchantUrl:
      "https://www.appliancesdirect.co.uk/amcor_8000_btu_portable_air_conditioner_sf10000e/version.asp",
    merchantUrlKind: "merchant-product-page",
    sourceUrl:
      "https://www.appliancesdirect.co.uk/amcor_8000_btu_portable_air_conditioner_sf10000e/version.asp",
    sourceLabel: "Appliances Direct electriQ SF10000E page",
    reviewSourceUrl:
      "https://www.appliancesdirect.co.uk/amcor_8000_btu_portable_air_conditioner_sf10000e/version.asp",
    reviewSourceLabel: "Appliances Direct setup and spec signal",
    marketplaceSourceLabel: "Appliances Direct UK retailer page",
    priceCheckedAt: "2026-06-29",
    imageUrl:
      "https://www.appliancesdirect.co.uk/Images/SF10000E_1_LargeProductImage.jpg",
    imageAlt: "electriQ Slimline 9000 BTU portable air conditioner SF10000E",
    productKind: "UK-local real compressor portable AC",
    regionFit:
      "UK small-to-medium room fit when current or similar stock is available",
    coolingCapacity: "9,000 BTU",
    hoseType: "Single-hose setup with included hose and sash/slide window kit",
    noiseLevel:
      "Check current Appliances Direct noise details and replacement-model reviews.",
    roomSize:
      "Small-to-medium rooms, kitchens, offices, caravans, or boats where slim placement matters.",
    voltagePlug:
      "UK retailer listing; confirm current model and included accessories",
    returnRiskLabel: "Replacement-model and stock risk",
    specSummary:
      "Appliances Direct describes the SF10000E as a 9,000 BTU slimline portable AC for small to medium rooms, with hose, fishtail adaptor, sash/slide window kit, remote, washable pre-filter, and dehumidifier mode.",
    reviewSummary:
      "The listing gives unusually practical setup detail, which helps buyers check whether their window setup and room size work before buying.",
    safetyNote:
      "If the page points to similar products, compare replacement specs instead of assuming every 9,000 BTU slimline unit is equivalent.",
    bestFor:
      "UK buyers who need a slimline setup for a smaller bedroom, kitchen, office, caravan, or boat.",
    decision:
      generatedProductDecisions[
        "electriQ Slimline 9000 BTU Portable Air Conditioner SF10000E"
      ],
    keyCheck:
      "Confirm current stock or replacement model, included hose/window kit, and room-size fit.",
    keyFeatures: [
      "9,000 BTU cooling",
      "Slimline body",
      "Hose and sash/slide kit listed",
    ],
    bestTake:
      "The SF10000E is the practical setup-detail pick. I like that the retailer explains the hose, adaptor, and window kit rather than just shouting BTU. The main caution is availability and replacement drift.",
    pros: [
      "Detailed setup information helps avoid window-kit surprises.",
      "9,000 BTU class fits many smaller UK rooms.",
      "Slimline body is easier to place than larger high-output units.",
    ],
    cons: [
      "Current price or replacement status can change.",
      "Not enough for large rooms.",
      "Single-hose performance depends on sealing the exhaust path.",
    ],
    reviewCount: 18,
    certificationRisk: "low",
    returnRisk: "medium",
  },
  {
    name: "electriQ P15CW 14000 BTU Smart Portable Air Conditioner",
    exactVariant: "electriQ P15CW 14000 BTU Smart Portable Air Conditioner",
    brandClaim: "electriQ",
    rankLabel: "Best UK high-capacity local pick",
    watts: "14000",
    verifiedClaimType: "cooling-capacity",
    verifiedClaimUnit: "BTU",
    price: null,
    priceLabel: "Check UK price",
    priceState: "unavailable",
    priceCountry: "GB",
    priceCurrency: "GBP",
    riskCountry: "GB",
    merchantUrl:
      "https://www.appliancesdirect.co.uk/p/p15cw/electriq-p15cw-air-conditioner",
    merchantUrlKind: "merchant-product-page",
    sourceUrl:
      "https://www.appliancesdirect.co.uk/p/p15cw/electriq-p15cw-air-conditioner",
    sourceLabel: "Appliances Direct electriQ P15CW page",
    reviewSourceUrl:
      "https://www.appliancesdirect.co.uk/p/p15cw/electriq-p15cw-air-conditioner",
    reviewSourceLabel: "Appliances Direct high-capacity spec signal",
    marketplaceSourceLabel: "Appliances Direct UK retailer page",
    priceCheckedAt: "2026-06-29",
    imageUrl:
      "https://www.appliancesdirect.co.uk/Images/P15CW_1_LargeProductImage.jpg",
    imageAlt: "electriQ P15CW 14000 BTU smart portable air conditioner",
    productKind: "UK-local real compressor portable AC",
    regionFit:
      "UK high-capacity local pick for larger rooms when exhaust setup is possible",
    coolingCapacity: "14,000 BTU",
    hoseType: "Single-hose smart portable setup with window kit",
    noiseLevel:
      "Large monoblock noise; verify dB and fan/compressor complaints for living spaces.",
    roomSize:
      "Up to 38 m2 retailer claim; best for larger UK rooms with workable exhaust setup.",
    voltagePlug:
      "UK retailer listing; confirm plug, warranty, and delivery handling",
    returnRiskLabel: "Large-room sizing and heavy return risk",
    specSummary:
      "Appliances Direct lists the P15CW as a 14,000 BTU smart portable AC for rooms up to 38 m2, with WiFi control, dehumidifier mode, A energy class, and included setup accessories.",
    reviewSummary:
      "The page gives a clear high-capacity UK comparison point for buyers who would otherwise overbuy a risky imported heavy AC during a shortage.",
    safetyNote:
      "A strong local high-output pick, but only when the exhaust setup and bulky return process are acceptable.",
    bestFor:
      "UK buyers cooling larger rooms who need more capacity than 7,000-10,000 BTU models.",
    decision:
      generatedProductDecisions[
        "electriQ P15CW 14000 BTU Smart Portable Air Conditioner"
      ],
    keyCheck:
      "Confirm 14,000 BTU is needed, exhaust routing works, and large-appliance returns are practical.",
    keyFeatures: [
      "14,000 BTU cooling",
      "Smart WiFi control",
      "Up to 38 m2 room claim",
    ],
    bestTake:
      "P15CW is the bigger-room local pick. It is not subtle, and it is not the first unit I would put in a small bedroom, but it gives UK buyers a clearer high-output alternative to importing a heavy AC with unknown returns.",
    pros: [
      "High-capacity 14,000 BTU class for larger rooms.",
      "Local retailer page explains smart controls, dehumidifier mode, and setup.",
      "Better fit for severe heat loads than small 7K-9K units.",
    ],
    cons: [
      "Overkill for small rooms.",
      "Large body and hose setup make returns more painful.",
      "Smart controls do not matter if the window setup is poor.",
    ],
    reviewCount: 24,
    certificationRisk: "low",
    returnRisk: "medium",
  },
];
