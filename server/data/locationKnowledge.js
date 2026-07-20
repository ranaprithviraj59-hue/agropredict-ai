const stateProfiles = {
  'Andhra Pradesh': { region: 'south_coastal', climate_zone: 'tropical', soil_types: ['red_soil', 'alluvial', 'black_cotton'], water_sources: ['canal', 'borewell', 'rainwater'], water_availability: 'moderate' },
  'Arunachal Pradesh': { region: 'north_east_hills', climate_zone: 'subtropical', soil_types: ['loamy', 'silty'], water_sources: ['river', 'rainwater'], water_availability: 'abundant' },
  Assam: { region: 'north_east_brahmaputra', climate_zone: 'subtropical', soil_types: ['alluvial', 'silty', 'loamy'], water_sources: ['river', 'rainwater', 'pond'], water_availability: 'abundant' },
  Bihar: { region: 'gangetic_plain', climate_zone: 'subtropical', soil_types: ['alluvial', 'silty', 'loamy'], water_sources: ['river', 'canal', 'borewell'], water_availability: 'moderate' },
  Chhattisgarh: { region: 'central_plateau', climate_zone: 'tropical', soil_types: ['red_soil', 'laterite', 'loamy'], water_sources: ['rainwater', 'pond', 'canal'], water_availability: 'seasonal' },
  Goa: { region: 'west_coastal', climate_zone: 'tropical', soil_types: ['laterite', 'sandy', 'alluvial'], water_sources: ['rainwater', 'well', 'river'], water_availability: 'abundant' },
  Gujarat: { region: 'west_india', climate_zone: 'semi_arid', soil_types: ['black_cotton', 'alluvial', 'sandy'], water_sources: ['canal', 'borewell', 'well'], water_availability: 'moderate' },
  Haryana: { region: 'north_india', climate_zone: 'semi_arid', soil_types: ['alluvial', 'loamy', 'sandy'], water_sources: ['canal', 'borewell'], water_availability: 'moderate' },
  'Himachal Pradesh': { region: 'western_himalaya', climate_zone: 'temperate', soil_types: ['loamy', 'silty'], water_sources: ['river', 'rainwater'], water_availability: 'seasonal' },
  Jharkhand: { region: 'eastern_plateau', climate_zone: 'subtropical', soil_types: ['red_soil', 'laterite', 'loamy'], water_sources: ['rainwater', 'river', 'pond'], water_availability: 'seasonal' },
  Karnataka: { region: 'deccan_plateau', climate_zone: 'semi_arid', soil_types: ['red_soil', 'black_cotton', 'laterite'], water_sources: ['borewell', 'rainwater', 'canal'], water_availability: 'moderate' },
  Kerala: { region: 'west_coastal', climate_zone: 'tropical', soil_types: ['laterite', 'alluvial', 'sandy'], water_sources: ['rainwater', 'river', 'well'], water_availability: 'abundant' },
  'Madhya Pradesh': { region: 'central_india', climate_zone: 'subtropical', soil_types: ['black_cotton', 'loamy', 'red_soil'], water_sources: ['borewell', 'canal', 'rainwater'], water_availability: 'moderate' },
  Maharashtra: { region: 'deccan_west', climate_zone: 'semi_arid', soil_types: ['black_cotton', 'red_soil', 'laterite'], water_sources: ['borewell', 'canal', 'rainwater'], water_availability: 'seasonal' },
  Manipur: { region: 'north_east_hills', climate_zone: 'subtropical', soil_types: ['loamy', 'silty'], water_sources: ['rainwater', 'river'], water_availability: 'abundant' },
  Meghalaya: { region: 'north_east_hills', climate_zone: 'subtropical', soil_types: ['loamy', 'laterite'], water_sources: ['rainwater', 'river'], water_availability: 'abundant' },
  Mizoram: { region: 'north_east_hills', climate_zone: 'subtropical', soil_types: ['loamy', 'laterite'], water_sources: ['rainwater', 'river'], water_availability: 'abundant' },
  Nagaland: { region: 'north_east_hills', climate_zone: 'subtropical', soil_types: ['loamy', 'silty'], water_sources: ['rainwater', 'river'], water_availability: 'abundant' },
  Odisha: { region: 'east_coastal', climate_zone: 'tropical', soil_types: ['red_soil', 'laterite', 'alluvial'], water_sources: ['rainwater', 'river', 'canal'], water_availability: 'moderate' },
  Punjab: { region: 'north_india', climate_zone: 'subtropical', soil_types: ['alluvial', 'loamy'], water_sources: ['canal', 'borewell'], water_availability: 'abundant' },
  Rajasthan: { region: 'arid_west', climate_zone: 'arid', soil_types: ['sandy', 'loamy', 'alluvial'], water_sources: ['well', 'borewell', 'rainwater'], water_availability: 'scarce' },
  Sikkim: { region: 'eastern_himalaya', climate_zone: 'temperate', soil_types: ['loamy', 'silty'], water_sources: ['river', 'rainwater'], water_availability: 'abundant' },
  'Tamil Nadu': { region: 'south_india', climate_zone: 'tropical', soil_types: ['red_soil', 'black_cotton', 'alluvial'], water_sources: ['borewell', 'canal', 'rainwater'], water_availability: 'moderate' },
  Telangana: { region: 'deccan_plateau', climate_zone: 'semi_arid', soil_types: ['red_soil', 'black_cotton'], water_sources: ['borewell', 'canal', 'rainwater'], water_availability: 'moderate' },
  Tripura: { region: 'north_east_hills', climate_zone: 'subtropical', soil_types: ['loamy', 'alluvial'], water_sources: ['rainwater', 'river'], water_availability: 'abundant' },
  'Uttar Pradesh': { region: 'gangetic_plain', climate_zone: 'subtropical', soil_types: ['alluvial', 'loamy', 'silty'], water_sources: ['canal', 'borewell', 'river'], water_availability: 'moderate' },
  Uttarakhand: { region: 'western_himalaya', climate_zone: 'temperate', soil_types: ['loamy', 'silty'], water_sources: ['river', 'rainwater'], water_availability: 'seasonal' },
  'West Bengal': { region: 'east_gangetic_delta', climate_zone: 'subtropical', soil_types: ['alluvial', 'silty', 'clay'], water_sources: ['river', 'rainwater', 'pond'], water_availability: 'abundant' },
  Delhi: { region: 'north_india', climate_zone: 'semi_arid', soil_types: ['alluvial', 'loamy'], water_sources: ['borewell', 'canal'], water_availability: 'moderate' },
  JammuKashmir: { label: 'Jammu and Kashmir', region: 'western_himalaya', climate_zone: 'temperate', soil_types: ['loamy', 'silty'], water_sources: ['river', 'rainwater'], water_availability: 'seasonal' },
  Ladakh: { region: 'cold_arid', climate_zone: 'continental', soil_types: ['sandy', 'loamy'], water_sources: ['river', 'snowmelt'], water_availability: 'scarce' },
  Puducherry: { region: 'south_coastal', climate_zone: 'tropical', soil_types: ['alluvial', 'sandy'], water_sources: ['borewell', 'rainwater'], water_availability: 'moderate' },
  Chandigarh: { region: 'north_india', climate_zone: 'subtropical', soil_types: ['alluvial', 'loamy'], water_sources: ['canal', 'borewell'], water_availability: 'moderate' },
  'Andaman and Nicobar Islands': { region: 'island_tropical', climate_zone: 'tropical', soil_types: ['laterite', 'sandy', 'loamy'], water_sources: ['rainwater', 'well'], water_availability: 'abundant' },
  'Dadra and Nagar Haveli and Daman and Diu': { region: 'west_coastal', climate_zone: 'tropical', soil_types: ['black_cotton', 'laterite', 'alluvial'], water_sources: ['rainwater', 'river', 'well'], water_availability: 'moderate' },
  Lakshadweep: { region: 'island_tropical', climate_zone: 'tropical', soil_types: ['sandy'], water_sources: ['rainwater', 'well'], water_availability: 'seasonal' },
};

const gujaratDistrictProfiles = {
  Ahmedabad: { region: 'central_gujarat', climate_zone: 'semi_arid', soil_types: ['alluvial', 'sandy', 'loamy'], water_sources: ['canal', 'borewell'], water_availability: 'moderate', cities: ['Ahmedabad', 'Dholka', 'Sanand', 'Viramgam', 'Bavla', 'Dhandhuka'] },
  Amreli: { region: 'saurashtra', climate_zone: 'semi_arid', soil_types: ['black_cotton', 'medium_black', 'loamy'], water_sources: ['well', 'borewell', 'rainwater'], water_availability: 'seasonal', cities: ['Amreli', 'Savarkundla', 'Rajula', 'Babra', 'Lathi'] },
  Anand: { region: 'central_gujarat', climate_zone: 'semi_arid', soil_types: ['alluvial', 'loamy', 'black_cotton'], water_sources: ['canal', 'borewell', 'well'], water_availability: 'moderate', cities: ['Anand', 'Khambhat', 'Petlad', 'Borsad', 'Umreth'] },
  Aravalli: { region: 'north_gujarat', climate_zone: 'semi_arid', soil_types: ['sandy_loam', 'loamy', 'alluvial'], water_sources: ['well', 'borewell', 'rainwater'], water_availability: 'seasonal', cities: ['Modasa', 'Bhiloda', 'Bayad', 'Meghraj', 'Malpur'] },
  Banaskantha: { region: 'north_gujarat', climate_zone: 'semi_arid', soil_types: ['sandy', 'loamy', 'alluvial'], water_sources: ['canal', 'borewell', 'well'], water_availability: 'scarce', cities: ['Palanpur', 'Deesa', 'Dantiwada', 'Dhanera', 'Tharad'] },
  Bharuch: { region: 'south_gujarat', climate_zone: 'tropical', soil_types: ['alluvial', 'black_cotton', 'clay'], water_sources: ['river', 'canal', 'borewell'], water_availability: 'moderate', cities: ['Bharuch', 'Ankleshwar', 'Jambusar', 'Vagra', 'Amod'] },
  Bhavnagar: { region: 'saurashtra_coastal', climate_zone: 'semi_arid', soil_types: ['black_cotton', 'alluvial', 'saline'], water_sources: ['well', 'borewell', 'rainwater'], water_availability: 'seasonal', cities: ['Bhavnagar', 'Mahuva', 'Palitana', 'Talaja', 'Sihor'] },
  Botad: { region: 'saurashtra', climate_zone: 'semi_arid', soil_types: ['black_cotton', 'loamy'], water_sources: ['well', 'borewell', 'rainwater'], water_availability: 'seasonal', cities: ['Botad', 'Gadhada', 'Barwala', 'Ranpur'] },
  'Chhota Udaipur': { region: 'eastern_tribal_belt', climate_zone: 'subtropical', soil_types: ['red_soil', 'loamy', 'laterite'], water_sources: ['river', 'rainwater', 'pond'], water_availability: 'seasonal', cities: ['Chhota Udaipur', 'Bodeli', 'Kavant', 'Nasvadi', 'Sankheda'] },
  Dahod: { region: 'eastern_tribal_belt', climate_zone: 'subtropical', soil_types: ['red_soil', 'loamy', 'sandy_loam'], water_sources: ['rainwater', 'well', 'pond'], water_availability: 'seasonal', cities: ['Dahod', 'Jhalod', 'Devgadh Baria', 'Limkheda', 'Fatepura'] },
  Dang: { region: 'south_hills', climate_zone: 'tropical', soil_types: ['laterite', 'loamy', 'forest_soil'], water_sources: ['rainwater', 'river', 'spring'], water_availability: 'abundant', cities: ['Ahwa', 'Waghai', 'Subir'] },
  'Devbhoomi Dwarka': { region: 'saurashtra_coastal', climate_zone: 'semi_arid', soil_types: ['sandy', 'saline', 'black_cotton'], water_sources: ['well', 'borewell', 'rainwater'], water_availability: 'scarce', cities: ['Khambhalia', 'Dwarka', 'Okha', 'Bhanvad', 'Kalyanpur'] },
  Gandhinagar: { region: 'north_gujarat', climate_zone: 'semi_arid', soil_types: ['alluvial', 'sandy_loam', 'loamy'], water_sources: ['canal', 'borewell'], water_availability: 'moderate', cities: ['Gandhinagar', 'Kalol', 'Dehgam', 'Mansa'] },
  'Gir Somnath': { region: 'saurashtra_coastal', climate_zone: 'semi_arid', soil_types: ['black_cotton', 'coastal_alluvial', 'loamy'], water_sources: ['well', 'borewell', 'rainwater'], water_availability: 'seasonal', cities: ['Veraval', 'Somnath', 'Una', 'Kodinar', 'Talala'] },
  Jamnagar: { region: 'saurashtra_coastal', climate_zone: 'semi_arid', soil_types: ['black_cotton', 'saline', 'loamy'], water_sources: ['well', 'borewell', 'rainwater'], water_availability: 'seasonal', cities: ['Jamnagar', 'Dhrol', 'Kalavad', 'Jamjodhpur', 'Lalpur'] },
  Junagadh: { region: 'saurashtra', climate_zone: 'semi_arid', soil_types: ['black_cotton', 'loamy', 'alluvial'], water_sources: ['well', 'borewell', 'rainwater'], water_availability: 'moderate', cities: ['Junagadh', 'Keshod', 'Mangrol', 'Manavadar', 'Visavadar'] },
  Kheda: { region: 'central_gujarat', climate_zone: 'semi_arid', soil_types: ['alluvial', 'loamy', 'black_cotton'], water_sources: ['canal', 'borewell', 'river'], water_availability: 'moderate', cities: ['Nadiad', 'Kapadvanj', 'Kheda', 'Mehmedabad', 'Thasra'] },
  Kutch: { region: 'kutch_arid', climate_zone: 'arid', soil_types: ['sandy', 'saline', 'loamy'], water_sources: ['well', 'borewell', 'rainwater'], water_availability: 'scarce', cities: ['Bhuj', 'Anjar', 'Mandvi', 'Rapar', 'Nakhatrana', 'Gandhidham'] },
  Mahisagar: { region: 'eastern_tribal_belt', climate_zone: 'subtropical', soil_types: ['red_soil', 'loamy', 'alluvial'], water_sources: ['river', 'rainwater', 'well'], water_availability: 'seasonal', cities: ['Lunawada', 'Balasinor', 'Santrampur', 'Kadana', 'Virpur'] },
  Mehsana: { region: 'north_gujarat', climate_zone: 'semi_arid', soil_types: ['sandy_loam', 'alluvial', 'loamy'], water_sources: ['canal', 'borewell', 'well'], water_availability: 'moderate', cities: ['Mehsana', 'Visnagar', 'Kadi', 'Unjha', 'Vijapur'] },
  Morbi: { region: 'saurashtra', climate_zone: 'semi_arid', soil_types: ['black_cotton', 'loamy', 'saline'], water_sources: ['well', 'borewell', 'rainwater'], water_availability: 'seasonal', cities: ['Morbi', 'Wankaner', 'Halvad', 'Tankara', 'Maliya'] },
  Narmada: { region: 'south_gujarat', climate_zone: 'tropical', soil_types: ['alluvial', 'loamy', 'black_cotton'], water_sources: ['river', 'canal', 'rainwater'], water_availability: 'moderate', cities: ['Rajpipla', 'Dediapada', 'Garudeshwar', 'Tilakwada'] },
  Navsari: { region: 'west_coastal', climate_zone: 'tropical', soil_types: ['alluvial', 'black_cotton', 'loamy'], water_sources: ['river', 'rainwater', 'borewell'], water_availability: 'abundant', cities: ['Navsari', 'Chikhli', 'Gandevi', 'Jalalpore', 'Vansda'] },
  Panchmahal: { region: 'eastern_tribal_belt', climate_zone: 'subtropical', soil_types: ['red_soil', 'loamy', 'alluvial'], water_sources: ['rainwater', 'well', 'river'], water_availability: 'seasonal', cities: ['Godhra', 'Halol', 'Kalol', 'Shehera', 'Jambughoda'] },
  Patan: { region: 'north_gujarat', climate_zone: 'semi_arid', soil_types: ['sandy', 'alluvial', 'loamy'], water_sources: ['canal', 'borewell', 'well'], water_availability: 'scarce', cities: ['Patan', 'Sidhpur', 'Radhanpur', 'Chanasma', 'Harij'] },
  Porbandar: { region: 'saurashtra_coastal', climate_zone: 'semi_arid', soil_types: ['sandy', 'coastal_alluvial', 'saline'], water_sources: ['well', 'borewell', 'rainwater'], water_availability: 'scarce', cities: ['Porbandar', 'Ranavav', 'Kutiyana'] },
  Rajkot: { region: 'saurashtra', climate_zone: 'semi_arid', soil_types: ['black_cotton', 'loamy', 'medium_black'], water_sources: ['borewell', 'well', 'rainwater'], water_availability: 'seasonal', cities: ['Rajkot', 'Gondal', 'Jetpur', 'Upleta', 'Dhoraji'] },
  Sabarkantha: { region: 'north_gujarat', climate_zone: 'semi_arid', soil_types: ['sandy_loam', 'loamy', 'alluvial'], water_sources: ['well', 'borewell', 'rainwater'], water_availability: 'seasonal', cities: ['Himmatnagar', 'Idar', 'Khedbrahma', 'Prantij', 'Talod'] },
  Surat: { region: 'west_coastal', climate_zone: 'tropical', soil_types: ['alluvial', 'black_cotton', 'loamy'], water_sources: ['canal', 'river', 'borewell'], water_availability: 'abundant', cities: ['Surat', 'Bardoli', 'Olpad', 'Kamrej', 'Mandvi', 'Mahuva', 'Palsana'] },
  Surendranagar: { region: 'saurashtra', climate_zone: 'semi_arid', soil_types: ['black_cotton', 'saline', 'loamy'], water_sources: ['canal', 'well', 'borewell'], water_availability: 'seasonal', cities: ['Surendranagar', 'Wadhwan', 'Dhrangadhra', 'Limbdi', 'Chotila'] },
  Tapi: { region: 'south_hills', climate_zone: 'tropical', soil_types: ['red_soil', 'loamy', 'laterite'], water_sources: ['rainwater', 'river', 'pond'], water_availability: 'abundant', cities: ['Vyara', 'Songadh', 'Valod', 'Nizar', 'Uchchhal'] },
  Vadodara: { region: 'central_gujarat', climate_zone: 'semi_arid', soil_types: ['alluvial', 'black_cotton', 'loamy'], water_sources: ['canal', 'river', 'borewell'], water_availability: 'moderate', cities: ['Vadodara', 'Dabhoi', 'Karjan', 'Padra', 'Savli'] },
  Valsad: { region: 'west_coastal', climate_zone: 'tropical', soil_types: ['laterite', 'alluvial', 'black_cotton'], water_sources: ['rainwater', 'river', 'well'], water_availability: 'abundant', cities: ['Valsad', 'Vapi', 'Pardi', 'Dharampur', 'Umargam'] },
  'Vav-Tharad': { region: 'north_gujarat_arid', climate_zone: 'arid', soil_types: ['sandy', 'loamy', 'alluvial'], water_sources: ['canal', 'borewell', 'well'], water_availability: 'scarce', cities: ['Tharad', 'Vav', 'Bhabhar', 'Deodar', 'Dhanera', 'Kankrej', 'Lakhani', 'Suigam'] },
};

const coordinateProfiles = [
  { state: 'Gujarat', district: 'Surat', latitude: 21.1702, longitude: 72.8311 },
  { state: 'Gujarat', district: 'Ahmedabad', latitude: 23.0225, longitude: 72.5714 },
  { state: 'Gujarat', district: 'Rajkot', latitude: 22.3039, longitude: 70.8022 },
  { state: 'Gujarat', district: 'Kutch', latitude: 23.2419, longitude: 69.6669 },
  { state: 'Gujarat', district: 'Vadodara', latitude: 22.3072, longitude: 73.1812 },
  { state: 'Gujarat', district: 'Valsad', latitude: 20.5992, longitude: 72.9342 },
  { state: 'Gujarat', district: 'Mehsana', latitude: 23.5880, longitude: 72.3693 },
  { state: 'Gujarat', district: 'Bhavnagar', latitude: 21.7645, longitude: 72.1519 },
  { state: 'Maharashtra', district: 'Pune', latitude: 18.5204, longitude: 73.8567 },
  { state: 'Punjab', district: 'Ludhiana', latitude: 30.9010, longitude: 75.8573 },
  { state: 'Rajasthan', district: 'Jaipur', latitude: 26.9124, longitude: 75.7873 },
  { state: 'Karnataka', district: 'Bengaluru', latitude: 12.9716, longitude: 77.5946 },
];

const districtProfiles = {
  Gujarat: gujaratDistrictProfiles,
  Maharashtra: {
    Pune: { region: 'deccan_west', climate_zone: 'semi_arid', soil_types: ['black_cotton', 'red_soil'], water_sources: ['canal', 'borewell'], water_availability: 'moderate', cities: ['Pune', 'Baramati', 'Indapur', 'Junnar'] },
    Nashik: { region: 'deccan_west', climate_zone: 'semi_arid', soil_types: ['black_cotton', 'red_soil'], water_sources: ['borewell', 'canal'], water_availability: 'moderate', cities: ['Nashik', 'Niphad', 'Malegaon', 'Sinnar'] },
    Nagpur: { region: 'vidarbha', climate_zone: 'tropical', soil_types: ['black_cotton', 'loamy'], water_sources: ['rainwater', 'borewell'], water_availability: 'seasonal', cities: ['Nagpur', 'Katol', 'Ramtek', 'Umred'] },
  },
  Punjab: {
    Ludhiana: { region: 'north_india', climate_zone: 'subtropical', soil_types: ['alluvial', 'loamy'], water_sources: ['canal', 'borewell'], water_availability: 'abundant', cities: ['Ludhiana', 'Khanna', 'Jagraon'] },
    Amritsar: { region: 'north_india', climate_zone: 'subtropical', soil_types: ['alluvial', 'loamy'], water_sources: ['canal', 'borewell'], water_availability: 'abundant', cities: ['Amritsar', 'Ajnala', 'Majitha'] },
  },
  Rajasthan: {
    Jaipur: { region: 'arid_west', climate_zone: 'semi_arid', soil_types: ['sandy', 'loamy'], water_sources: ['well', 'borewell'], water_availability: 'scarce', cities: ['Jaipur', 'Chomu', 'Phulera'] },
    Jodhpur: { region: 'arid_west', climate_zone: 'arid', soil_types: ['sandy'], water_sources: ['well', 'rainwater'], water_availability: 'scarce', cities: ['Jodhpur', 'Osian', 'Phalodi'] },
  },
  'Uttar Pradesh': {
    Lucknow: { region: 'gangetic_plain', climate_zone: 'subtropical', soil_types: ['alluvial', 'loamy'], water_sources: ['canal', 'borewell'], water_availability: 'moderate', cities: ['Lucknow', 'Malihabad', 'Mohanlalganj'] },
    Meerut: { region: 'gangetic_plain', climate_zone: 'subtropical', soil_types: ['alluvial', 'loamy'], water_sources: ['canal', 'borewell'], water_availability: 'moderate', cities: ['Meerut', 'Mawana', 'Sardhana'] },
  },
  Karnataka: {
    Bengaluru: { region: 'deccan_plateau', climate_zone: 'semi_arid', soil_types: ['red_soil', 'loamy'], water_sources: ['borewell', 'rainwater'], water_availability: 'moderate', cities: ['Bengaluru', 'Anekal', 'Devanahalli'] },
    Belagavi: { region: 'deccan_plateau', climate_zone: 'semi_arid', soil_types: ['black_cotton', 'red_soil'], water_sources: ['canal', 'borewell'], water_availability: 'moderate', cities: ['Belagavi', 'Gokak', 'Athani'] },
  },
  'Tamil Nadu': {
    Coimbatore: { region: 'south_india', climate_zone: 'tropical', soil_types: ['red_soil', 'black_cotton'], water_sources: ['borewell', 'canal'], water_availability: 'moderate', cities: ['Coimbatore', 'Pollachi', 'Mettupalayam'] },
    Thanjavur: { region: 'south_delta', climate_zone: 'tropical', soil_types: ['alluvial', 'clay'], water_sources: ['canal', 'river'], water_availability: 'abundant', cities: ['Thanjavur', 'Kumbakonam', 'Pattukkottai'] },
  },
  Telangana: {
    Hyderabad: { region: 'deccan_plateau', climate_zone: 'semi_arid', soil_types: ['red_soil', 'black_cotton'], water_sources: ['borewell', 'rainwater'], water_availability: 'moderate', cities: ['Hyderabad', 'Chevella', 'Ibrahimpatnam'] },
    Warangal: { region: 'deccan_plateau', climate_zone: 'semi_arid', soil_types: ['red_soil', 'black_cotton'], water_sources: ['canal', 'borewell'], water_availability: 'moderate', cities: ['Warangal', 'Narsampet', 'Parkal'] },
  },
  'West Bengal': {
    Burdwan: { region: 'east_gangetic_delta', climate_zone: 'subtropical', soil_types: ['alluvial', 'clay'], water_sources: ['river', 'canal', 'pond'], water_availability: 'abundant', cities: ['Burdwan', 'Kalna', 'Katwa'] },
    Nadia: { region: 'east_gangetic_delta', climate_zone: 'subtropical', soil_types: ['alluvial', 'silty'], water_sources: ['river', 'pond'], water_availability: 'abundant', cities: ['Krishnanagar', 'Kalyani', 'Ranaghat'] },
  },
};

const displayState = (key) => stateProfiles[key].label || key;

export const locationKnowledge = {
  states: Object.keys(stateProfiles).map(displayState).sort(),
  districtProfiles,
  coordinateProfiles,
  stateProfiles: Object.fromEntries(Object.entries(stateProfiles).map(([key, value]) => [displayState(key), { ...value, districts: Object.keys(districtProfiles[displayState(key)] || {}) }])),
};

export function getLocationSuggestion({ state, district }) {
  const stateProfile = locationKnowledge.stateProfiles[state] || stateProfiles[state] || stateProfiles.Gujarat;
  const districtProfile = locationKnowledge.districtProfiles[state]?.[district];
  return {
    ...stateProfile,
    ...(districtProfile || {}),
  };
}

const distanceSquared = (a, b) => {
  const lat = Number(a.latitude) - Number(b.latitude);
  const lon = Number(a.longitude) - Number(b.longitude);
  return lat * lat + lon * lon;
};

export function inferLocationFromCoordinates({ latitude, longitude }) {
  if (!Number.isFinite(Number(latitude)) || !Number.isFinite(Number(longitude))) {
    return getLocationSuggestion({ state: 'Gujarat' });
  }

  const nearest = coordinateProfiles
    .map((profile) => ({ ...profile, distance: distanceSquared({ latitude, longitude }, profile) }))
    .sort((a, b) => a.distance - b.distance)[0];
  const suggestion = getLocationSuggestion(nearest);

  return {
    ...suggestion,
    state: nearest.state,
    district: nearest.district,
    city: nearest.district,
  };
}
