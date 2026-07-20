// Advanced Dynamic Agricultural Knowledge Engine for Kisan AI

export function generateDynamicKisanAnswer(message, language = 'en') {
  const query = String(message || '').toLowerCase().trim();

  const isHindi = language === 'hi';
  const isGujarati = language === 'gu';

  // 1. Harvesting / Harvesting Methods
  if (query.includes('harvest') || query.includes('कटाई') || query.includes('લણણી')) {
    if (isHindi) {
      return `🌾 **फसल कटाई (Harvesting) के प्रमुख प्रकार और तरीके:**\n\n` +
        `1. **हस्तचालित कटाई (Manual Harvesting):** दराती (Sickle) का उपयोग करके हाथों से कटाई। छोटे खेतों और पारंपरिक खेती के लिए उत्तम।\n` +
        `2. **यांत्रिक कटाई (Mechanical Harvesting):** रीपर (Reaper) या कंबाइन हार्वेस्टर (Combine Harvester) का उपयोग। यह समय और श्रम दोनों बचाता है।\n` +
        `3. **स्ट्रिपिंग (Stripping):** फल या बीजों को पौधे से सीधे छीलकर निकालना (जैसे कपास की तुड़ाई)।\n` +
        `4. **खोदकर कटाई (Digging/Uprooting):** आलू, मूंगफली और गाजर जैसी भूमिगत फसलों के लिए डिगर का उपयोग।\n\n` +
        `💡 *किसान सुझाव:* हमेशा सुबह के समय कटाई करें जब नमी का स्तर संतुलित हो ताकि दानों का नुकसान न हो।`;
    }
    if (isGujarati) {
      return `🌾 **પાકની લણણી (Harvesting) ની મુખ્ય પદ્ધતિઓ:**\n\n` +
        `1. **મેન્યુઅલ લણણી:** દાતરડા વડે હાથથી લણણી કરવી. નાના ખેતરો માટે ફાયદાકારક.\n` +
        `2. **મિકેનિકલ લણણી:** કમ્બાઈન હાર્વેસ્ટર અને રીપરનો ઉપયોગ.\n` +
        `3. **પિકિંગ (ઉપાડવું):** કપાસ અથવા શાકભાજી વીણવા.\n` +
        `4. **ખોદકામ:** બટાકા અને મગફળી માટે ડીગરનો ઉપયોગ.\n\n` +
        `💡 *સલાહ:* પાક સંપૂર્ણ પાકે ત્યારે જ લણણી કરો.`;
    }
    return `🌾 **Primary Types & Methods of Crop Harvesting:**\n\n` +
      `1. **Manual Harvesting:** Using sickles and hand tools. Ideal for small-scale operations and delicate crops.\n` +
      `2. **Mechanical Harvesting:** Utilizing Combine Harvesters, Reapers, and Threshers for rapid processing of wheat, rice, and corn.\n` +
      `3. **Picking & Stripping:** Selective hand-picking for cotton bolls, fruits, and vegetables.\n` +
      `4. **Digging & Uprooting:** Mechanical diggers for root crops like potatoes, carrots, and groundnuts.\n\n` +
      `💡 *Pro Tip:* Harvest during cool morning hours when grain moisture is optimal (14-16%) to minimize post-harvest losses.`;
  }

  // 2. Price / Market / Mandi / Selling
  if (query.includes('price') || query.includes('market') || query.includes('mandi') || query.includes('trend') || query.includes('मूल्य') || query.includes('भाव')) {
    if (isHindi) {
      return `💰 **फसल मूल्य और बाजार रुझान (Market Trends) सलाह:**\n\n` +
        `- **मंडी भाव तुलना:** अपनी नजदीकी 3 मंडियों के दैनिक आवक (Arrivals) और न्यूनतम/अधिकतम भाव चेक करें।\n` +
        `- **भंडारण रणनीति:** यदि फसल की आवक ज्यादा हो, तो कोल्ड स्टोरेज या गोदाम में 2-4 सप्ताह रोककर बेचना फायदेमंद रहता है।\n` +
        `- **ई-नाम (e-NAM):** राष्ट्रीय कृषि बाजार पोर्टल पर ऑनलाइन बोली लगाकर बेहतर दाम प्राप्त करें।\n\n` +
        `💡 *सुझाव:* हमारे ऐप के **Price Predictor** फीचर का उपयोग करके 6 महीने का पूर्वानुमान देखें।`;
    }
    return `💰 **Market Price & Mandi Selling Strategy:**\n\n` +
      `- **Mandi Price Analysis:** Monitor daily arrival volumes in nearby regional mandis. High arrivals generally depress prices in the short term.\n` +
      `- **Strategic Storage:** Store non-perishable grains in dry warehouses for 3-6 weeks post-harvest to fetch 15-25% higher off-season margins.\n` +
      `- **Digital Trading (e-NAM):** Leverage the e-NAM portal to reach buyers across state borders for competitive bidding.\n\n` +
      `💡 *Action Item:* Use our **Market Price Predictor** tab to see 6-month forecasted price trends for your specific crop.`;
  }

  // 3. Pest / Insects / Disease
  if (query.includes('pest') || query.includes('insect') || query.includes('disease') || query.includes('कीट') || query.includes('रोग')) {
    if (isHindi) {
      return `🐛 **कीट एवं रोग प्रबंधन (Pest & Disease Control):**\n\n` +
        `1. **जैविक रोकथाम:** नीम तेल (Neem Oil 10,000 PPM) 5ml प्रति लीटर पानी में मिलाकर स्प्रे करें।\n` +
        `2. **फेरोमोन ट्रैप:** प्रति एकड़ 4-5 फेरोमोन ट्रैप लगाएं ताकि हानिकारक कीटों की पहचान हो सके।\n` +
        `3. **मित्र कीट:** लेडीबग और ट्राइकोग्राम फार्मर फ्रेंडली कीटों का संरक्षण करें।\n` +
        `4. **रासायनिक नियंत्रण:** केवल अत्यधिक प्रकोप की स्थिति में ही अनुशंसित कीटनाशक का सही मात्रा में छिड़काव करें।`;
    }
    return `🐛 **Integrated Pest & Disease Management (IPM):**\n\n` +
      `1. **Biological Control:** Spray Neem oil solution (10,000 PPM @ 5ml/liter water) at the first sign of pests.\n` +
      `2. **Pheromone Traps:** Deploy 4-6 pheromone/yellow sticky traps per acre to monitor insect populations early.\n` +
      `3. **Crop Rotation:** Rotate non-host crop families to break pest lifecycle and soil pathogen build-up.\n` +
      `4. **Targeted Treatment:** Apply systemic fungicides or insecticides strictly according to dosage guidelines when pest thresholds are breached.`;
  }

  // 4. Water / Irrigation / Drip
  if (query.includes('water') || query.includes('irrigation') || query.includes('drip') || query.includes('सिंचाई') || query.includes('પાણી')) {
    if (isHindi) {
      return `💧 **जल प्रबंधन एवं कुशल सिंचाई (Irrigation Management):**\n\n` +
        `- **ड्रिप सिंचाई (Drip Irrigation):** 50-60% तक पानी बचाती है और पैदावार 25% बढ़ाती है।\n` +
        `- **मल्चिंग (Mulching):** खेत में प्लास्टिक या सूखी घास की मल्चिंग करके वाष्पीकरण (Evaporation) कम करें।\n` +
        `- **सिंचाई का समय:** हमेशा तड़के सुबह या देर शाम सिंचाई करें।\n` +
        `- **कम पानी वाली फसलें:** चना, सरसों, बाजरा और मूंगफली का चयन करें।`;
    }
    return `💧 **Precision Irrigation & Water Conservation:**\n\n` +
      `- **Drip Irrigation:** Delivers water directly to crop roots, saving 50-60% water while reducing weed growth.\n` +
      `- **Mulching Practices:** Organic or plastic mulching reduces soil moisture evaporation by up to 40%.\n` +
      `- **Irrigation Timing:** Schedule watering during early mornings or evenings to minimize thermal stress and evaporative loss.\n` +
      `- **Drought-Resilient Crops:** Consider Chickpea, Mustard, Pearl Millet (Bajra), or Sorghum for water-scarce regions.`;
  }

  // 5. Soil / pH / Fertilizer / NPK
  if (query.includes('soil') || query.includes('ph') || query.includes('npk') || query.includes('fertilizer') || query.includes('मिट्टी') || query.includes('खाद')) {
    if (isHindi) {
      return `🌱 **मिट्टी स्वास्थ्य एवं उर्वरक प्रबंधन (Soil Health & NPK):**\n\n` +
        `- **मिट्टी परीक्षण:** हर 2 साल में मिट्टी जांच (Soil Health Card) करवाएं।\n` +
        `- **pH स्तर:** अधिकांश फसलों के लिए आदर्श pH 6.5 से 7.5 होता है। अम्लीय मिट्टी में चूना (Lime) और क्षारीय मिट्टी में जिप्सम मिलाएं।\n` +
        `- **जैविक खाद:** प्रति एकड़ 4-5 टन गोबर की खाद (FYM) या वर्मीकंपोस्ट डालें।\n` +
        `- **संतुलित NPK:** आवश्यकतानुसार नाइट्रोजन (N), फास्फोरस (P) और पोटाश (K) का संतुलित प्रयोग करें।`;
    }
    return `🌱 **Soil Chemistry & Fertilizer Management:**\n\n` +
      `- **Soil pH Balance:** Optimal pH range for most agricultural crops is 6.2 - 7.5. Apply agricultural lime for acidic soil (<6.0) or gypsum for alkaline soil (>8.0).\n` +
      `- **NPK Ratio:** Maintain balanced Nitrogen (N), Phosphorus (P), and Potassium (K) based on crop requirements.\n` +
      `- **Organic Carbon Booster:** Incorporate Farmyard Manure (FYM) or Vermicompost @ 4-5 tons/acre before sowing to increase microbial activity.`;
  }

  // 6. Organic Farming / Bio
  if (query.includes('organic') || query.includes('जैविक') || query.includes('કાર્બનિક')) {
    return `🌿 **Organic Farming Best Practices:**\n\n` +
      `1. **Bio-fertilizers:** Use Rhizobium for legumes and Azotobacter for non-legume crops to boost natural nitrogen fixing.\n` +
      `2. **Panchagavya & Jeevamrut:** Prepare organic liquid bio-stimulants using cow dung, urine, jaggery, and pulse flour.\n` +
      `3. **Composting:** Utilize earthworms (Vermicomposting) to convert crop residues into nutrient-rich humus.\n` +
      `4. **Certification:** Register with APEDA / NPOP for organic crop certification to earn premium export pricing.`;
  }

  // 7. General / Catch-all Dynamic Answer
  return `🌾 **Kisan AI Smart Farming Recommendation:**\n\n` +
    `For optimal agricultural results regarding "${message}":\n\n` +
    `1. **Soil & Climate Alignment:** Ensure your soil texture (Clay, Loam, Sandy) and season (Kharif, Rabi, Zaid) match crop thermal tolerance.\n` +
    `2. **Resource Optimization:** Balance NPK fertilizer applications according to soil pH testing.\n` +
    `3. **Smart Pest Scouting:** Inspect crops weekly for early disease vector identification.\n` +
    `4. **Market Timing:** Check target mandi prices and seasonal demand trends before harvesting.\n\n` +
    `💡 *Next Step:* Register your farm parameters under **My Farm** and click **Predict Crops** for a customized AI yield score!`;
}
