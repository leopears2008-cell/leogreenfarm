export interface TNDistrict {
  id: string;
  name: string;
  nameTa: string;
  zone: string;
  zoneTa: string;
  lat: number;
  lon: number;
  primaryCrops: string[];
  soilType: string;
  headquarters: string;
}

export const TN_ALL_DISTRICTS: TNDistrict[] = [
  {
    id: 'ariyalur',
    name: 'Ariyalur',
    nameTa: 'அரியலூர்',
    zone: 'Cauvery Delta Zone',
    zoneTa: 'காவிரி டெல்டா மண்டலம்',
    lat: 11.1401,
    lon: 79.0786,
    primaryCrops: ['Cashew', 'Sugarcane', 'Paddy', 'Groundnut', 'Maize'],
    soilType: 'Red Loam & Black Soil',
    headquarters: 'Ariyalur'
  },
  {
    id: 'chengalpattu',
    name: 'Chengalpattu',
    nameTa: 'செங்கல்பட்டு',
    zone: 'North Eastern Agro-Zone',
    zoneTa: 'வடகிழக்கு மண்டலம்',
    lat: 12.6841,
    lon: 79.9836,
    primaryCrops: ['Paddy', 'Groundnut', 'Watermelon', 'Vegetables'],
    soilType: 'Coastal Alluvium & Red Sandy Loam',
    headquarters: 'Chengalpattu'
  },
  {
    id: 'chennai',
    name: 'Chennai',
    nameTa: 'சென்னை',
    zone: 'North Eastern Coastal Zone',
    zoneTa: 'வடகிழக்கு கடலோர மண்டலம்',
    lat: 13.0827,
    lon: 80.2707,
    primaryCrops: ['Horticulture', 'Urban Hydroponics', 'Flowers'],
    soilType: 'Coastal Sandy Alluvium',
    headquarters: 'Chennai'
  },
  {
    id: 'coimbatore',
    name: 'Coimbatore',
    nameTa: 'கோயம்புத்தூர்',
    zone: 'Western Agro-Zone',
    zoneTa: 'மேற்கு மண்டலம்',
    lat: 11.0168,
    lon: 76.9558,
    primaryCrops: ['Coconut', 'Cotton', 'Maize', 'Tea', 'Tomato', 'Nutmeg'],
    soilType: 'Red Loamy & Black Calcareous Soil',
    headquarters: 'Coimbatore'
  },
  {
    id: 'cuddalore',
    name: 'Cuddalore',
    nameTa: 'கடலூர்',
    zone: 'North Eastern Coastal Zone',
    zoneTa: 'வடகிழக்கு கடலோர மண்டலம்',
    lat: 11.7480,
    lon: 79.7714,
    primaryCrops: ['Cashew', 'Sugarcane', 'Paddy', 'Jackfruit', 'Tapioca'],
    soilType: 'Coastal Alluvial & Lateritic Loam',
    headquarters: 'Cuddalore'
  },
  {
    id: 'dharmapuri',
    name: 'Dharmapuri',
    nameTa: 'தருமபுரி',
    zone: 'North Western Agro-Zone',
    zoneTa: 'வடமேற்கு மண்டலம்',
    lat: 12.1211,
    lon: 78.1582,
    primaryCrops: ['Mango', 'Ragi (Finger Millet)', 'Tomato', 'Chilli', 'Turmeric'],
    soilType: 'Red Loam & Sandy Clay Loam',
    headquarters: 'Dharmapuri'
  },
  {
    id: 'dindigul',
    name: 'Dindigul',
    nameTa: 'திண்டுக்கல்',
    zone: 'Southern Rainfed Agro-Zone',
    zoneTa: 'தெற்கு மானாவாரி மண்டலம்',
    lat: 10.3673,
    lon: 77.9803,
    primaryCrops: ['Small Onion (Shallots)', 'Drumstick', 'Garlic', 'Coffee', 'Flowers'],
    soilType: 'Red Soil & Black Cotton Soil',
    headquarters: 'Dindigul'
  },
  {
    id: 'erode',
    name: 'Erode',
    nameTa: 'ஈரோடு',
    zone: 'Western Agro-Zone',
    zoneTa: 'மேற்கு மண்டலம்',
    lat: 11.3410,
    lon: 77.7172,
    primaryCrops: ['Turmeric', 'Sugarcane', 'Banana', 'Tapioca', 'Paddy'],
    soilType: 'Red Sandy Loam & Clay Loam',
    headquarters: 'Erode'
  },
  {
    id: 'kallakurichi',
    name: 'Kallakurichi',
    nameTa: 'கள்ளக்குறிச்சி',
    zone: 'North Eastern Agro-Zone',
    zoneTa: 'வடகிழக்கு மண்டலம்',
    lat: 11.7383,
    lon: 78.9639,
    primaryCrops: ['Paddy', 'Sugarcane', 'Maize', 'Groundnut', 'Blackgram'],
    soilType: 'Red Loam & Black Soil',
    headquarters: 'Kallakurichi'
  },
  {
    id: 'kanchipuram',
    name: 'Kanchipuram',
    nameTa: 'காஞ்சிபுரம்',
    zone: 'North Eastern Agro-Zone',
    zoneTa: 'வடகிழக்கு மண்டலம்',
    lat: 12.8342,
    lon: 79.7036,
    primaryCrops: ['Paddy', 'Sugarcane', 'Groundnut', 'Jasmine', 'Vegetables'],
    soilType: 'Clay Loam & Sandy Alluvial',
    headquarters: 'Kanchipuram'
  },
  {
    id: 'kanyakumari',
    name: 'Kanyakumari',
    nameTa: 'கன்னியாகுமரி',
    zone: 'High Rainfall Southern Zone',
    zoneTa: 'அதிக மழைப்பொழிவு தெற்கு மண்டலம்',
    lat: 8.0883,
    lon: 77.5385,
    primaryCrops: ['Rubber', 'Banana', 'Coconut', 'Paddy', 'Clove', 'Pepper'],
    soilType: 'Laterite & Coastal Alluvium',
    headquarters: 'Nagercoil'
  },
  {
    id: 'karur',
    name: 'Karur',
    nameTa: 'கரூர்',
    zone: 'Central Alluvial Plain',
    zoneTa: 'மத்திய வண்டல் மண் மண்டலம்',
    lat: 10.9601,
    lon: 78.0766,
    primaryCrops: ['Banana', 'Sugarcane', 'Paddy', 'Betel Vine', 'Drumstick'],
    soilType: 'Alluvial & Red Soil',
    headquarters: 'Karur'
  },
  {
    id: 'krishnagiri',
    name: 'Krishnagiri',
    nameTa: 'கிருஷ்ணகிரி',
    zone: 'North Western Agro-Zone',
    zoneTa: 'வடமேற்கு மண்டலம்',
    lat: 12.5186,
    lon: 78.2137,
    primaryCrops: ['Mango (Totapuri/Alphonso)', 'Tomato', 'Ragi', 'Rose Flowers', 'Mulberry'],
    soilType: 'Red Sandy Loam & Gravelly Loam',
    headquarters: 'Krishnagiri'
  },
  {
    id: 'madurai',
    name: 'Madurai',
    nameTa: 'மதுரை',
    zone: 'Southern Rainfed Agro-Zone',
    zoneTa: 'தெற்கு மானாவாரி மண்டலம்',
    lat: 9.9252,
    lon: 78.1198,
    primaryCrops: ['Madurai Malli (Jasmine)', 'Paddy', 'Pulses', 'Millets', 'Cotton'],
    soilType: 'Black Cotton Soil & Red Sandy Loam',
    headquarters: 'Madurai'
  },
  {
    id: 'mayiladuthurai',
    name: 'Mayiladuthurai',
    nameTa: 'மயிலாடுதுறை',
    zone: 'Cauvery Delta Zone',
    zoneTa: 'காவிரி டெல்டா மண்டலம்',
    lat: 11.1075,
    lon: 79.6524,
    primaryCrops: ['Paddy (Kuruvai/Thaladi)', 'Blackgram', 'Greengram', 'Banana', 'Coconut'],
    soilType: 'Deep Deltaic Alluvium',
    headquarters: 'Mayiladuthurai'
  },
  {
    id: 'nagapattinam',
    name: 'Nagapattinam',
    nameTa: 'நாகப்பட்டினம்',
    zone: 'Cauvery Delta Coastal Zone',
    zoneTa: 'காவிரி டெல்டா கடலோர மண்டலம்',
    lat: 10.7656,
    lon: 79.8424,
    primaryCrops: ['Paddy', 'Pulses', 'Casuarina', 'Coconut', 'Groundnut'],
    soilType: 'Coastal Saline & Alluvial Soil',
    headquarters: 'Nagapattinam'
  },
  {
    id: 'namakkal',
    name: 'Namakkal',
    nameTa: 'நாமக்கல்',
    zone: 'North Western Agro-Zone',
    zoneTa: 'வடமேற்கு மண்டலம்',
    lat: 11.2189,
    lon: 78.1674,
    primaryCrops: ['Tapioca', 'Maize', 'Groundnut', 'Turmeric', 'Poultry Feed Grains'],
    soilType: 'Red Loam & Sandy Soil',
    headquarters: 'Namakkal'
  },
  {
    id: 'nilgiris',
    name: 'Nilgiris',
    nameTa: 'நீலகிரி',
    zone: 'High Altitude Hilly Agro-Zone',
    zoneTa: 'உயர்மலை தோட்டப்பயிர் மண்டலம்',
    lat: 11.4102,
    lon: 76.6950,
    primaryCrops: ['Tea', 'Coffee', 'Potato', 'Carrot', 'Cabbage', 'Cardamom', 'Eucalyptus'],
    soilType: 'Hill Humus & Acidic Clay Loam',
    headquarters: 'Udhagamandalam (Ooty)'
  },
  {
    id: 'perambalur',
    name: 'Perambalur',
    nameTa: 'பெரம்பலூர்',
    zone: 'Cauvery Delta / Central Zone',
    zoneTa: 'காவிரி டெல்டா / மத்திய மண்டலம்',
    lat: 11.2342,
    lon: 78.8820,
    primaryCrops: ['Small Onion', 'Maize', 'Cotton', 'Sugarcane', 'Paddy'],
    soilType: 'Black Cotton Soil & Red Loam',
    headquarters: 'Perambalur'
  },
  {
    id: 'pudukkottai',
    name: 'Pudukkottai',
    nameTa: 'புதுக்கோட்டை',
    zone: 'Southern Coastal & Delta Zone',
    zoneTa: 'தெற்கு கடலோர டெல்டா மண்டலம்',
    lat: 10.3797,
    lon: 78.8208,
    primaryCrops: ['Paddy', 'Groundnut', 'Cashew', 'Pulses', 'Coconut'],
    soilType: 'Red Lateritic & Sandy Clay Loam',
    headquarters: 'Pudukkottai'
  },
  {
    id: 'ramanathapuram',
    name: 'Ramanathapuram',
    nameTa: 'ராமநாதபுரம்',
    zone: 'Southern Coastal Semi-Arid Zone',
    zoneTa: 'தெற்கு கடலோர வறட்சி மண்டலம்',
    lat: 9.3639,
    lon: 78.8395,
    primaryCrops: ['Gundu Chilli (குண்டு மிளகாய்)', 'Cotton', 'Paddy', 'Millets', 'Coconut'],
    soilType: 'Saline Coastal & Sandy Clay',
    headquarters: 'Ramanathapuram'
  },
  {
    id: 'ranipet',
    name: 'Ranipet',
    nameTa: 'இராணிப்பேட்டை',
    zone: 'North Eastern Agro-Zone',
    zoneTa: 'வடகிழக்கு மண்டலம்',
    lat: 12.9279,
    lon: 79.3330,
    primaryCrops: ['Paddy', 'Sugarcane', 'Groundnut', 'Banana', 'Vegetables'],
    soilType: 'Red Loam & Sandy Alluvial',
    headquarters: 'Ranipet'
  },
  {
    id: 'salem',
    name: 'Salem',
    nameTa: 'சேலம்',
    zone: 'North Western Agro-Zone',
    zoneTa: 'வடமேற்கு மண்டலம்',
    lat: 11.6643,
    lon: 78.1460,
    primaryCrops: ['Salem Mango (Malgova)', 'Tapioca', 'Coffee', 'Turmeric', 'Cotton'],
    soilType: 'Red Loam & Black Soil',
    headquarters: 'Salem'
  },
  {
    id: 'sivaganga',
    name: 'Sivaganga',
    nameTa: 'சிவகங்கை',
    zone: 'Southern Rainfed Agro-Zone',
    zoneTa: 'தெற்கு மானாவாரி மண்டலம்',
    lat: 9.8433,
    lon: 78.4809,
    primaryCrops: ['Paddy', 'Groundnut', 'Pulses', 'Chilli', 'Sugarcane'],
    soilType: 'Red Sandy Loam & Clay Soil',
    headquarters: 'Sivaganga'
  },
  {
    id: 'tenkasi',
    name: 'Tenkasi',
    nameTa: 'தென்காசி',
    zone: 'Western Ghats Sub-Zone',
    zoneTa: 'மேற்கு தொடர்ச்சி மலை அடிவார மண்டலம்',
    lat: 8.9594,
    lon: 77.3152,
    primaryCrops: ['Paddy', 'Banana', 'Mango', 'Coconut', 'Spices (Pepper/Nutmeg)'],
    soilType: 'Alluvial & Forest Loam',
    headquarters: 'Tenkasi'
  },
  {
    id: 'thanjavur',
    name: 'Thanjavur',
    nameTa: 'தஞ்சாவூர்',
    zone: 'Cauvery Delta Zone (Granary of TN)',
    zoneTa: 'காவிரி டெல்டா மண்டலம் (நெற்களஞ்சியம்)',
    lat: 10.7870,
    lon: 79.1378,
    primaryCrops: ['Paddy (Ponni/CR1009)', 'Blackgram', 'Banana', 'Coconut', 'Sugarcane'],
    soilType: 'Fertile Riverine Alluvial & Clay Loam',
    headquarters: 'Thanjavur'
  },
  {
    id: 'theni',
    name: 'Theni',
    nameTa: 'தேனி',
    zone: 'Southern Hill Valley Zone',
    zoneTa: 'தெற்கு பள்ளத்தாக்கு மண்டலம்',
    lat: 10.0104,
    lon: 77.4768,
    primaryCrops: ['Grapes (Cumbum Valley)', 'Cardamom', 'Cotton', 'Sugarcane', 'Banana'],
    soilType: 'Red Soil & Valley Alluvium',
    headquarters: 'Theni'
  },
  {
    id: 'thoothukudi',
    name: 'Thoothukudi',
    nameTa: 'தூத்துக்குடி',
    zone: 'Southern Coastal Semi-Arid Zone',
    zoneTa: 'தெற்கு கடலோர வறட்சி மண்டலம்',
    lat: 8.7642,
    lon: 78.1348,
    primaryCrops: ['Pulses', 'Chilli', 'Cotton', 'Millets', 'Banana', 'Palmyra'],
    soilType: 'Deep Black Cotton Soil & Coastal Sand',
    headquarters: 'Thoothukudi'
  },
  {
    id: 'tiruchirappalli',
    name: 'Tiruchirappalli',
    nameTa: 'திருச்சிராப்பள்ளி',
    zone: 'Central Alluvial Plain',
    zoneTa: 'மத்திய வண்டல் மண் மண்டலம்',
    lat: 10.7905,
    lon: 78.7047,
    primaryCrops: ['Banana (NRCB Varieties)', 'Paddy', 'Sugarcane', 'Cotton', 'Maize'],
    soilType: 'Alluvial & Red Soil',
    headquarters: 'Tiruchirappalli'
  },
  {
    id: 'tirunelveli',
    name: 'Tirunelveli',
    nameTa: 'திருநெல்வேலி',
    zone: 'Southern Alluvial & Rainfed Zone',
    zoneTa: 'தெற்கு தாமிரபரணி பாசன மண்டலம்',
    lat: 8.7139,
    lon: 77.7567,
    primaryCrops: ['Paddy', 'Banana', 'Cotton', 'Palmyra', 'Pulses', 'Groundnut'],
    soilType: 'Thamirabarani Alluvium & Red Loam',
    headquarters: 'Tirunelveli'
  },
  {
    id: 'tirupathur',
    name: 'Tirupathur',
    nameTa: 'திருப்பத்தூர்',
    zone: 'North Eastern Agro-Zone',
    zoneTa: 'வடகிழக்கு மண்டலம்',
    lat: 12.4926,
    lon: 78.5678,
    primaryCrops: ['Groundnut', 'Paddy', 'Ragi', 'Sugarcane', 'Mango'],
    soilType: 'Red Sandy Loam',
    headquarters: 'Tirupathur'
  },
  {
    id: 'tiruppur',
    name: 'Tiruppur',
    nameTa: 'திருப்பூர்',
    zone: 'Western Agro-Zone',
    zoneTa: 'மேற்கு மண்டலம்',
    lat: 11.1085,
    lon: 77.3411,
    primaryCrops: ['Maize', 'Coconut', 'Cotton', 'Tomato', 'Sunflower'],
    soilType: 'Red Loam & Black Soil',
    headquarters: 'Tiruppur'
  },
  {
    id: 'tiruvallur',
    name: 'Tiruvallur',
    nameTa: 'திருவள்ளூர்',
    zone: 'North Eastern Coastal Zone',
    zoneTa: 'வடகிழக்கு கடலோர மண்டலம்',
    lat: 13.1432,
    lon: 79.9074,
    primaryCrops: ['Paddy', 'Groundnut', 'Watermelon', 'Sugarcane', 'Jasmine'],
    soilType: 'Coastal Sandy Alluvium & Clay Loam',
    headquarters: 'Tiruvallur'
  },
  {
    id: 'tiruvannamalai',
    name: 'Tiruvannamalai',
    nameTa: 'திருவண்ணாமலை',
    zone: 'North Eastern Agro-Zone',
    zoneTa: 'வடகிழக்கு மண்டலம்',
    lat: 12.2253,
    lon: 79.0747,
    primaryCrops: ['Groundnut', 'Paddy', 'Sugarcane', 'Banana', 'Sesame'],
    soilType: 'Red Sandy Loam & Clay Soil',
    headquarters: 'Tiruvannamalai'
  },
  {
    id: 'tiruvarur',
    name: 'Tiruvarur',
    nameTa: 'திருவாரூர்',
    zone: 'Cauvery Delta Zone',
    zoneTa: 'காவிரி டெல்டா மண்டலம்',
    lat: 10.7725,
    lon: 79.6365,
    primaryCrops: ['Paddy (Kuruvai/Samba)', 'Pulses', 'Cotton', 'Sugarcane', 'Banana'],
    soilType: 'Deltaic Clay Alluvium',
    headquarters: 'Tiruvarur'
  },
  {
    id: 'vellore',
    name: 'Vellore',
    nameTa: 'வேலூர்',
    zone: 'North Eastern Agro-Zone',
    zoneTa: 'வடகிழக்கு மண்டலம்',
    lat: 12.9165,
    lon: 79.1325,
    primaryCrops: ['Groundnut', 'Paddy', 'Sugarcane', 'Brinjal (Mullu Kathiri)', 'Coconut'],
    soilType: 'Red Sandy Loam & Gravelly Soil',
    headquarters: 'Vellore'
  },
  {
    id: 'viluppuram',
    name: 'Viluppuram',
    nameTa: 'விழுப்புரம்',
    zone: 'North Eastern Agro-Zone',
    zoneTa: 'வடகிழக்கு மண்டலம்',
    lat: 11.9401,
    lon: 79.4861,
    primaryCrops: ['Sugarcane', 'Paddy', 'Groundnut', 'Tapioca', 'Casuarina'],
    soilType: 'Clay Loam & Red Soil',
    headquarters: 'Viluppuram'
  },
  {
    id: 'virudhunagar',
    name: 'Virudhunagar',
    nameTa: 'விருதுநகர்',
    zone: 'Southern Rainfed Agro-Zone',
    zoneTa: 'தெற்கு மானாவாரி மண்டலம்',
    lat: 9.5872,
    lon: 77.9514,
    primaryCrops: ['Cotton', 'Samba Chilli', 'Millets', 'Pulses', 'Groundnut'],
    soilType: 'Black Cotton Soil & Deep Red Loam',
    headquarters: 'Virudhunagar'
  }
];

// Helper to look up a district by ID or name case-insensitively
export function findTNDistrict(query: string): TNDistrict {
  if (!query) return TN_ALL_DISTRICTS.find(d => d.id === 'thanjavur')!;
  const q = query.trim().toLowerCase();
  const match = TN_ALL_DISTRICTS.find(
    d => d.id === q || 
         d.name.toLowerCase() === q || 
         d.nameTa.toLowerCase() === q ||
         d.headquarters.toLowerCase() === q
  );
  return match || TN_ALL_DISTRICTS.find(d => d.id === 'thanjavur')!;
}
