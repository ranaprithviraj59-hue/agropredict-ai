// Advanced Dynamic Agricultural Knowledge Engine for Kisan AI
import { normalizeLanguage } from './kisanPrompt.js';

export function generateDynamicKisanAnswer(message, language = 'en') {
  const query = String(message || '').toLowerCase().trim();
  const normalizedLanguage = normalizeLanguage(language);

  const isHindi = normalizedLanguage === 'hi';
  const isGujarati = normalizedLanguage === 'gu';
  const asksCropChoice = (
    query.includes('which crop') ||
    query.includes('best crop') ||
    query.includes('crop should') ||
    query.includes('what crop') ||
    query.includes('grow in') ||
    query.includes('recommend crop') ||
    query.includes('फसल कौन') ||
    query.includes('कौन सी फसल') ||
    query.includes('કયો પાક') ||
    query.includes('શ્રેષ્ઠ પાક')
  );

  if (asksCropChoice) {
    if (isHindi) {
      return `🌾 **फसल चयन सलाह:**\n\n` +
        `आपके प्रश्न के अनुसार फसल चुनते समय मिट्टी, पानी, मौसम, pH, NPK और बाजार भाव को साथ में देखना चाहिए।\n\n` +
        `- **Alluvial/Loamy मिट्टी + अच्छा पानी:** धान, गेहूं, मक्का और सब्जियां अच्छे विकल्प हो सकते हैं।\n` +
        `- **Black cotton मिट्टी:** कपास, सोयाबीन, तूर और गेहूं उपयोगी रहते हैं।\n` +
        `- **Sandy/कम पानी:** चना, सरसों, बाजरा और मूंगफली बेहतर रहते हैं।\n\n` +
        `💡 सही AI स्कोर के लिए **My Farm** में खेत की जानकारी भरें और **Predict Crops** चलाएं।`;
    }
    if (isGujarati) {
      return `🌾 **પાક પસંદગી સલાહ:**\n\n` +
        `પાક પસંદ કરતી વખતે માટી, પાણી, ઋતુ, pH, NPK અને બજાર ભાવ સાથે જોવું જોઈએ.\n\n` +
        `- **Alluvial/Loamy માટી + પૂરતું પાણી:** ચોખા, ઘઉં, મકાઈ અને શાકભાજી સારા વિકલ્પ છે.\n` +
        `- **Black cotton માટી:** કપાસ, સોયાબીન, તુવેર અને ઘઉં ઉપયોગી છે.\n` +
        `- **Sandy/ઓછું પાણી:** ચણા, સરસવ, બાજરી અને મગફળી વધુ યોગ્ય છે.\n\n` +
        `💡 ચોક્કસ AI સ્કોર માટે **My Farm** માં માહિતી भरो અને **Predict Crops** ચલાવો.`;
    }
    return `🌾 **Crop Recommendation Guidance:**\n\n` +
      `For crop choice, combine soil type, water source, season, pH, NPK, climate, previous crop, and market price.\n\n` +
      `- **Alluvial or loamy soil with canal/good water:** Rice, Wheat, Maize, and vegetables can perform well depending on season.\n` +
      `- **Black cotton soil:** Cotton, Soybean, Pigeon pea, and Wheat are strong options.\n` +
      `- **Sandy or low-water farms:** Chickpea, Mustard, Bajra, Groundnut, and Cumin are safer choices.\n\n` +
      `💡 For an exact ranked result, add your farm in **My Farm** and run **Predict Crops**. The app will include live weather and local farm data.`;
  }

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
    if (isGujarati) {
      return `💰 **પાક ભાવ અને બજાર વલણ સલાહ:**\n\n` +
        `- **મંડી ભાવ તુલના:** નજીકની 3 મંડીઓમાં રોજની આવક, ઓછો ભાવ, વધુ ભાવ અને મોડલ ભાવ તપાસો.\n` +
        `- **સંગ્રહ વ્યૂહરચના:** જો બજારમાં આવક વધારે હોય તો અનાજને સુકા ગોડાઉનમાં 2-4 અઠવાડિયા રાખીને વેચવાથી વધુ ભાવ મળી શકે.\n` +
        `- **e-NAM:** રાષ્ટ્રીય કૃષિ બજાર પોર્ટલ પર ઓનલાઇન બોલી દ્વારા બીજા વિસ્તારોના ખરીદદારો સુધી પહોંચી શકો છો.\n\n` +
        `💡 *સૂચન:* ચોક્કસ અંદાજ માટે એપના **Price Predictor** માં પાક, રાજ્ય, જિલ્લા અને જથ્થો દાખલ કરો.`;
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
    if (isGujarati) {
      return `🐛 **જીવાત અને રોગ નિયંત્રણ સલાહ:**\n\n` +
        `1. **જૈવિક નિયંત્રણ:** જીવાત દેખાય ત્યારે નીમ તેલ 5 મિલી પ્રતિ લીટર પાણીમાં ભેળવી છંટકાવ કરો.\n` +
        `2. **ફેરોમોન/પીળા સ્ટિકી ટ્રેપ:** પ્રતિ એકર 4-6 ટ્રેપ લગાવી જીવાતની શરૂઆતમાં ઓળખ કરો.\n` +
        `3. **પાક ફેરબદલી:** એક જ પાક વારંવાર ન લેવો, જેથી જીવાત અને જમીનજન્ય રોગનો ચક્ર તૂટે.\n` +
        `4. **દવા ઉપયોગ:** પ્રકોપ વધારે હોય ત્યારે જ ભલામણ કરેલી દવા યોગ્ય માત્રામાં વાપરો.`;
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
    if (isGujarati) {
      return `💧 **પાણી વ્યવસ્થાપન અને કાર્યક્ષમ સિંચાઈ:**\n\n` +
        `- **ડ્રિપ સિંચાઈ:** પાણી સીધું મૂળ સુધી પહોંચે છે, 50-60% પાણી બચી શકે અને નિંદામણ ઓછું થાય.\n` +
        `- **મલ્ચિંગ:** સૂકી ઘાસ અથવા પ્લાસ્ટિક મલ્ચથી જમીનમાંથી પાણીનું બાષ્પીભવન ઘટે છે.\n` +
        `- **સિંચાઈ સમય:** વહેલી સવારે અથવા સાંજે સિંચાઈ કરો, જેથી ગરમીથી પાણીનો બગાડ ઓછો થાય.\n` +
        `- **ઓછા પાણીના પાક:** ચણા, સરસવ, બાજરી, જુવાર અને મગફળી સારા વિકલ્પ છે.`;
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
    if (isGujarati) {
      return `🌱 **જમીન સ્વાસ્થ્ય અને ખાતર વ્યવસ્થાપન:**\n\n` +
        `- **માટી પરીક્ષણ:** દર 2 વર્ષે Soil Health Card અથવા લેબ ટેસ્ટ કરાવો.\n` +
        `- **pH સ્તર:** મોટાભાગના પાક માટે pH 6.5 થી 7.5 યોગ્ય છે. અમ્લીય જમીનમાં ચૂનો અને ક્ષારિય જમીનમાં જિપ્સમ ઉપયોગી છે.\n` +
        `- **જૈવિક ખાતર:** વાવણી પહેલાં પ્રતિ એકર 4-5 ટન સડી ગયેલું છાણિયું ખાતર અથવા વર્મીકમ્પોસ્ટ નાખો.\n` +
        `- **સંતુલિત NPK:** પાક અને ટેસ્ટ મુજબ નાઇટ્રોજન, ફોસ્ફરસ અને પોટાશનું સંતુલિત પ્રમાણ રાખો.`;
    }
    return `🌱 **Soil Chemistry & Fertilizer Management:**\n\n` +
      `- **Soil pH Balance:** Optimal pH range for most agricultural crops is 6.2 - 7.5. Apply agricultural lime for acidic soil (<6.0) or gypsum for alkaline soil (>8.0).\n` +
      `- **NPK Ratio:** Maintain balanced Nitrogen (N), Phosphorus (P), and Potassium (K) based on crop requirements.\n` +
      `- **Organic Carbon Booster:** Incorporate Farmyard Manure (FYM) or Vermicompost @ 4-5 tons/acre before sowing to increase microbial activity.`;
  }

  // 6. Organic Farming / Bio
  if (query.includes('organic') || query.includes('जैविक') || query.includes('કાર્બનિક')) {
    if (isHindi) {
      return `🌿 **जैविक खेती के अच्छे तरीके:**\n\n` +
        `1. **जैव उर्वरक:** दलहनी फसलों में Rhizobium और अन्य फसलों में Azotobacter उपयोग करें.\n` +
        `2. **जीवामृत/पंचगव्य:** गोबर, गोमूत्र, गुड़ और बेसन से जैविक घोल बनाकर प्रयोग करें.\n` +
        `3. **कम्पोस्ट:** फसल अवशेषों से वर्मी कम्पोस्ट बनाकर मिट्टी में जैविक कार्बन बढ़ाएं.\n` +
        `4. **प्रमाणन:** प्रीमियम भाव के लिए जैविक प्रमाणन प्रक्रिया की जानकारी लें.`;
    }
    if (isGujarati) {
      return `🌿 **કાર્બનિક ખેતી માટે શ્રેષ્ઠ પદ્ધતિઓ:**\n\n` +
        `1. **જૈવ ખાતર:** દાળવાળા પાકમાં Rhizobium અને અન્ય પાકમાં Azotobacter ઉપયોગ કરો.\n` +
        `2. **જીવામૃત/પંચગવ્ય:** છાણ, ગૌમૂત્ર, ગોળ અને દાળના લોટથી દ્રાવણ બનાવી વાપરો.\n` +
        `3. **કમ્પોસ્ટ:** પાકના અવશેષથી વર્મીકમ્પોસ્ટ બનાવી જમીનમાં જૈવિક કાર્બન વધારો.\n` +
        `4. **પ્રમાણન:** વધુ ભાવ માટે કાર્બનિક પ્રમાણપત્રની પ્રક્રિયા વિશે માહિતી લો.`;
    }
    return `🌿 **Organic Farming Best Practices:**\n\n` +
      `1. **Bio-fertilizers:** Use Rhizobium for legumes and Azotobacter for non-legume crops to boost natural nitrogen fixing.\n` +
      `2. **Panchagavya & Jeevamrut:** Prepare organic liquid bio-stimulants using cow dung, urine, jaggery, and pulse flour.\n` +
      `3. **Composting:** Utilize earthworms (Vermicomposting) to convert crop residues into nutrient-rich humus.\n` +
      `4. **Certification:** Register with APEDA / NPOP for organic crop certification to earn premium export pricing.`;
  }

  // 7. General / Catch-all Dynamic Answer
  if (isHindi) {
    return `🌾 **किसान AI स्मार्ट खेती सलाह:**\n\n` +
      `"${message}" के लिए अच्छे परिणाम पाने हेतु ये बातें ध्यान रखें:\n\n` +
      `1. **मिट्टी और मौसम:** मिट्टी का प्रकार, pH, NPK और मौसम के अनुसार फसल चुनें.\n` +
      `2. **संसाधन प्रबंधन:** पानी और खाद का उपयोग मिट्टी जांच के अनुसार करें.\n` +
      `3. **कीट निगरानी:** हर सप्ताह खेत का निरीक्षण करें ताकि रोग जल्दी पकड़ा जाए.\n` +
      `4. **बाजार समय:** कटाई से पहले नजदीकी मंडी भाव और मांग देखें.\n\n` +
      `💡 *अगला कदम:* **My Farm** में खेत की जानकारी जोड़कर **Predict Crops** चलाएं.`;
  }
  if (isGujarati) {
    return `🌾 **કિસાન AI સ્માર્ટ ખેતી સલાહ:**\n\n` +
      `"${message}" માટે સારા પરિણામ મેળવવા આ બાબતો ધ્યાનમાં રાખો:\n\n` +
      `1. **માટી અને હવામાન:** માટીનો પ્રકાર, pH, NPK અને ઋતુ મુજબ પાક પસંદ કરો.\n` +
      `2. **સંસાધન વ્યવસ્થાપન:** પાણી અને ખાતરનો ઉપયોગ માટી ટેસ્ટ મુજબ કરો.\n` +
      `3. **જીવાત દેખરેખ:** દર અઠવાડિયે પાકની તપાસ કરો જેથી રોગ વહેલો પકડાય.\n` +
      `4. **બજાર સમય:** લણણી પહેલાં નજીકની મંડીના ભાવ અને માંગ તપાસો.\n\n` +
      `💡 *આગળનું પગલું:* **My Farm** માં ખેતરની માહિતી ઉમેરો અને **Predict Crops** ચલાવો.`;
  }
  return `🌾 **Kisan AI Smart Farming Recommendation:**\n\n` +
    `For optimal agricultural results regarding "${message}":\n\n` +
    `1. **Soil & Climate Alignment:** Ensure your soil texture (Clay, Loam, Sandy) and season (Kharif, Rabi, Zaid) match crop thermal tolerance.\n` +
    `2. **Resource Optimization:** Balance NPK fertilizer applications according to soil pH testing.\n` +
    `3. **Smart Pest Scouting:** Inspect crops weekly for early disease vector identification.\n` +
    `4. **Market Timing:** Check target mandi prices and seasonal demand trends before harvesting.\n\n` +
    `💡 *Next Step:* Register your farm parameters under **My Farm** and click **Predict Crops** for a customized AI yield score!`;
}
