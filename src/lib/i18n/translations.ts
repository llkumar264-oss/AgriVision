export type AppLanguage = 'en' | 'hi' | 'hinglish';

export interface Translations {
  appName: string;
  appSubtitle: string;
  nav: {
    overview: string;
    twin: string;
    crops: string;
    livestock: string;
    marketplace: string;
    community: string;
    vision: string;
    advisory: string;
    timeline: string;
    analytics: string;
    weather: string;
    tasks: string;
    alerts: string;
    assistant: string;
  };
  header: {
    synced: string;
    syncing: string;
    offline: string;
    searchPlaceholder: string;
    demoMode: string;
    simpleMode: string;
    switchLanguage: string;
    profileSettings: string;
    signOut: string;
    editProfile: string;
    farmerName: string;
    phone: string;
    farmName: string;
    saveChanges: string;
  };
  dashboard: {
    goodMorning: string;
    farmHealthTitle: string;
    criticalAlerts: string;
    quickActions: string;
    soilMoisture: string;
    marketRates: string;
    weatherForecast: string;
  };
  crops: {
    title: string;
    subtitle: string;
    addCrop: string;
    searchCrops: string;
    healthIndex: string;
    diseaseRisk: string;
    estYield: string;
    marketValue: string;
    fullDossier: string;
    overviewTab: string;
    agronomyTab: string;
    lifecycleTab: string;
    pestsTab: string;
    harvestTab: string;
  };
  twin: {
    title: string;
    subtitle: string;
    layers: {
      topology: string;
      ndvi: string;
      moisture: string;
      hydraulic: string;
    };
    droneMission: string;
    startDrone: string;
    droneScanning: string;
    remoteAutomation: string;
    pumpStatus: string;
    turnOn: string;
    turnOff: string;
    climateShockSimulator: string;
  };
  simpleMode: {
    title: string;
    subtitle: string;
    exit: string;
    listening: string;
    speakNow: string;
    askPlaceholder: string;
  };
  aiVision: {
    title: string;
    subtitle: string;
    maturityTab: string;
    pathologyTab: string;
    wheatRustTab: string;
  };
}

export const TRANSLATIONS: Record<AppLanguage, Translations> = {
  en: {
    appName: 'AgriVision',
    appSubtitle: 'UNIFIED FARM INTEL',
    nav: {
      overview: 'Overview',
      twin: 'Farm Twin',
      crops: 'Crops (35+)',
      livestock: 'Livestock (USP)',
      marketplace: 'Marketplace',
      community: 'Community Hub',
      vision: 'AI Vision',
      advisory: 'Advisory',
      timeline: 'Timeline',
      analytics: 'Analytics',
      weather: 'Weather',
      tasks: 'Tasks',
      alerts: 'Notifications',
      assistant: 'AI Assistant',
    },
    header: {
      synced: 'Synced',
      syncing: 'Syncing',
      offline: 'Offline Mode',
      searchPlaceholder: 'Search crops, tasks, mandi rates, diseases (Ctrl+K)...',
      demoMode: '20s Interactive Demo',
      simpleMode: 'Simple Kisan Mode',
      switchLanguage: 'Language',
      profileSettings: 'Profile Settings',
      signOut: 'Switch Account / Logout',
      editProfile: 'Edit Farmer Profile & Farm',
      farmerName: 'Farmer Full Name',
      phone: 'Phone Number',
      farmName: 'Farm Location / Name',
      saveChanges: 'Save Profile Information',
    },
    dashboard: {
      goodMorning: 'Good morning',
      farmHealthTitle: 'Farm Health & Telemetry Overview',
      criticalAlerts: 'Active Critical Alerts',
      quickActions: 'Quick Agronomic Actions',
      soilMoisture: 'Average Soil Moisture',
      marketRates: 'Live Mandi Price Tracker',
      weatherForecast: 'Hyper-Local Microclimate Forecast',
    },
    crops: {
      title: 'Crop Inventory & Health Matrix',
      subtitle: '35+ Real-time crop records, health scores, disease risk & yield projections',
      addCrop: 'Add Crop Record',
      searchCrops: 'Search 35+ crops by name or variety...',
      healthIndex: 'Health Index',
      diseaseRisk: 'Disease Risk',
      estYield: 'Estimated Yield',
      marketValue: 'Est. Market Value',
      fullDossier: 'Full Dossier',
      overviewTab: 'Overview & Yield',
      agronomyTab: 'Agronomic Specs',
      lifecycleTab: 'Growth Lifecycle',
      pestsTab: 'Pests & Cures',
      harvestTab: 'Harvest Maturity',
    },
    twin: {
      title: 'Spatial Farm Digital Twin (3D & GIS)',
      subtitle: 'Live IoT sensors, drone multispectral NDVI, remote irrigation valves & AI stress simulator',
      layers: {
        topology: '3D Spatial Grid',
        ndvi: 'Satellite NDVI Health',
        moisture: 'Soil Moisture Heatmap',
        hydraulic: 'Smart Drip Pipe Network',
      },
      droneMission: 'Autonomous Drone Aerial Survey',
      startDrone: 'Launch 30s Aerial Drone Scan',
      droneScanning: 'Drone Survey Mission Active...',
      remoteAutomation: 'Remote Borewell & Valve Automation',
      pumpStatus: 'Main Submersible Borewell',
      turnOn: 'Turn ON (Drip Flow)',
      turnOff: 'Turn OFF (Stop Flow)',
      climateShockSimulator: 'AI Climate Shock & Yield Stress Simulator',
    },
    simpleMode: {
      title: 'AgriVision Real Voice & Conversational Kisan Guide',
      subtitle: 'Multimodal Gemini AI + Multilingual Speech-to-Text & Narration',
      exit: 'Exit Simple Mode',
      listening: 'Listening to your voice... Speak now!',
      speakNow: 'Tap microphone to speak in your language',
      askPlaceholder: 'Ask anything about crops, pests, fertilizers, cattle feed or mandi rates...',
    },
    aiVision: {
      title: 'Precision AI Vision & Pathology Diagnostics',
      subtitle: 'Maturity stage countdowns, Brix sugar indices, Wheat Rust dataset & disease cures',
      maturityTab: 'Crop Maturity & Harvest Readiness AI',
      pathologyTab: 'Pathology Diagnostic Scanner',
      wheatRustTab: 'Wheat Rust Dataset Benchmark',
    },
  },

  hi: {
    appName: 'एग्रीविज़न (AgriVision)',
    appSubtitle: 'स्मार्ट कृषि एवं डिजिटल फार्म प्रणाली',
    nav: {
      overview: 'विहंगावलोकन (Overview)',
      twin: 'डिजिटल खेत (Farm Twin)',
      crops: 'फसलें (Crops 35+)',
      livestock: 'पशुपालन (Livestock)',
      marketplace: 'मंडी बाज़ार (Marketplace)',
      community: 'किसान चौपाल (Community)',
      vision: 'एआई विज़न (AI Vision)',
      advisory: 'कृषि सलाह (Advisory)',
      timeline: 'टाइमलाइन (Timeline)',
      analytics: 'आंकड़े (Analytics)',
      weather: 'मौसम (Weather)',
      tasks: 'कार्य सूची (Tasks)',
      alerts: 'सूचनाएं (Alerts)',
      assistant: 'एआई सहायक (AI Assistant)',
    },
    header: {
      synced: 'सिंक हुआ (Synced)',
      syncing: 'सिंक हो रहा है',
      offline: 'ऑफ़लाइन मोड',
      searchPlaceholder: 'फसल, रोग, मंडी भाव, खाद खोजें (Ctrl+K)...',
      demoMode: '20 सेकंड डेमो',
      simpleMode: 'सरल किसान मोड (Simple Mode)',
      switchLanguage: 'भाषा (Language)',
      profileSettings: 'प्रोफ़ाइल सेटिंग्स',
      signOut: 'खाता बदलें / लॉग आउट',
      editProfile: 'किसान प्रोफ़ाइल व खेत विवरण बदलें',
      farmerName: 'किसान का पूरा नाम',
      phone: 'मोबाइल नंबर',
      farmName: 'खेत का नाम / स्थान',
      saveChanges: 'प्रोफ़ाइल विवरण सुरक्षित करें',
    },
    dashboard: {
      goodMorning: 'शुभ प्रभात',
      farmHealthTitle: 'खेत स्वास्थ्य व टेलीमेट्री रिपोर्ट',
      criticalAlerts: 'सक्रिय चेतावनी व रोग अलर्ट',
      quickActions: 'त्वरित कृषि कार्य',
      soilMoisture: 'औसत मिट्टी की नमी',
      marketRates: 'आज का लाइव मंडी भाव',
      weatherForecast: 'स्थानीय मौसम व वर्षा पूर्वानुमान',
    },
    crops: {
      title: 'फसल प्रबंधन एवं स्वास्थ्य मेट्रिक्स',
      subtitle: '35+ फसलों का लाइव रिकॉर्ड, विकास चरण, रोग जोखिम व अनुमानित पैदावार',
      addCrop: 'नई फसल जोड़ें',
      searchCrops: '35+ फसलों में नाम या किस्म से खोजें...',
      healthIndex: 'स्वास्थ्य स्कोर',
      diseaseRisk: 'रोग खतरा',
      estYield: 'अनुमानित पैदावार',
      marketValue: 'अनुमानित बाज़ार मूल्य',
      fullDossier: 'पूरा विवरण (Dossier)',
      overviewTab: 'विवरण व पैदावार',
      agronomyTab: 'कृषि वैज्ञानिक आवश्यकताएं',
      lifecycleTab: 'विकास चरण (Lifecycle)',
      pestsTab: 'कीट व जैविक/रासायनिक उपचार',
      harvestTab: 'कटाई परिपक्वता संकेत',
    },
    twin: {
      title: 'स्थानिक फार्म डिजिटल ट्विन (3D व सेटेलाइट)',
      subtitle: 'लाइव IoT सेंसर, सेटेलाइट NDVI, रिमोट बोरवेल/ड्रिप वाल्व नियंत्रण व एआई पैदावार सिमुलेटर',
      layers: {
        topology: '3D स्थानिक ग्रिड',
        ndvi: 'सेटेलाइट NDVI फसल स्वास्थ्य',
        moisture: 'मिट्टी नमी हीटमैप',
        hydraulic: 'स्मार्ट ड्रिप पाइपलाइन नेटवर्क',
      },
      droneMission: 'स्वायत्त ड्रोन हवाई सर्वेक्षण',
      startDrone: '30 सेकंड ड्रोन मिशन शुरू करें',
      droneScanning: 'ड्रोन फसल स्कैनिंग सक्रिय है...',
      remoteAutomation: 'रिमोट बोरवेल व वाल्व स्वचालन',
      pumpStatus: 'मुख्य सबमर्सिबल बोरवेल पंप',
      turnOn: 'पंप चालू करें (पानी प्रवाह)',
      turnOff: 'पंप बंद करें',
      climateShockSimulator: 'एआई मौसम आघात व पैदावार सिमुलेटर',
    },
    simpleMode: {
      title: 'एग्रीविज़न वॉयस एवं एआई किसान मार्गदर्शक',
      subtitle: 'जेमिनी एआई + बहुभाषी आवाज़ पहचान व ऑडियो उत्तर',
      exit: 'सरल मोड से बाहर आएं',
      listening: 'आपकी आवाज़ सुन रहा हूँ... बोलिए!',
      speakNow: 'अपनी भाषा में बोलने के लिए माइक दबाएं',
      askPlaceholder: 'फसल, रोग, खाद, पशु आहार, जीवामृत या मंडी भाव के बारे में पूछें...',
    },
    aiVision: {
      title: 'सटीक एआई विज़न व रोग पहचान प्रणाली',
      subtitle: 'फसल परिपक्वता दिन, ब्रिक्स मिठास, गेहूँ रतुआ (Rust) डेटासेट व सटीक उपचार',
      maturityTab: 'फसल परिपक्वता व कटाई समय एआई',
      pathologyTab: 'रोग नैदानिक स्कैनर (Pathology)',
      wheatRustTab: 'गेहूँ रतुआ डेटासेट बेंचमार्क (Wheat Rust)',
    },
  },

  hinglish: {
    appName: 'AgriVision AI',
    appSubtitle: 'Smart Kheti & Digital Farm Intel',
    nav: {
      overview: 'Overview',
      twin: 'Digital Khet (Farm Twin)',
      crops: 'Faslein (Crops 35+)',
      livestock: 'Pashupalan (Livestock)',
      marketplace: 'Mandi Bazaar',
      community: 'Kisan Chaupal',
      vision: 'AI Vision Scanner',
      advisory: 'Krishi Salah',
      timeline: 'Timeline',
      analytics: 'Analytics',
      weather: 'Mausam (Weather)',
      tasks: 'Farm Tasks',
      alerts: 'Notifications',
      assistant: 'AI Assistant',
    },
    header: {
      synced: 'Cloud Synced',
      syncing: 'Syncing Data...',
      offline: 'Offline Mode',
      searchPlaceholder: 'Crops, bimari, mandi bhav, spray khojein (Ctrl+K)...',
      demoMode: '20s Live Demo',
      simpleMode: 'Simple Kisan Mode',
      switchLanguage: 'Language Badlein',
      profileSettings: 'Profile Settings',
      signOut: 'Switch Account / Logout',
      editProfile: 'Kisan Profile & Khet Details',
      farmerName: 'Kisan Ka Naam',
      phone: 'Mobile Number',
      farmName: 'Farm Name & Location',
      saveChanges: 'Save Profile Details',
    },
    dashboard: {
      goodMorning: 'Namaste',
      farmHealthTitle: 'Farm Health & Live Sensors Overview',
      criticalAlerts: 'Active Bimari & Risk Alerts',
      quickActions: 'Quick Farm Actions',
      soilMoisture: 'Average Mitti Ki Nami',
      marketRates: 'Aaj Ka Live Mandi Bhav',
      weatherForecast: 'Hyper-Local Mausam & Rain Forecast',
    },
    crops: {
      title: 'Crop Inventory & Health Matrix',
      subtitle: '35+ Faslo ka real-time health score, growth stages, disease risk & yield',
      addCrop: 'Nayi Crop Add Karein',
      searchCrops: '35+ faslo me naam ya variety se search karein...',
      healthIndex: 'Health Score',
      diseaseRisk: 'Bimari Ka Risk',
      estYield: 'Estimated Paidawar',
      marketValue: 'Est. Mandi Value',
      fullDossier: 'Poori Detail (Dossier)',
      overviewTab: 'Overview & Yield',
      agronomyTab: 'Agronomic Specs',
      lifecycleTab: 'Growth Lifecycle',
      pestsTab: 'Keet & Spray Ilaj',
      harvestTab: 'Harvest Maturity Signs',
    },
    twin: {
      title: 'Spatial Farm Digital Twin (3D & Satellite)',
      subtitle: 'Live IoT sensors, drone NDVI, remote borewell motor control & AI stress simulator',
      layers: {
        topology: '3D Field Topology',
        ndvi: 'Satellite NDVI Greenness',
        moisture: 'Soil Moisture Heatmap',
        hydraulic: 'Smart Drip Pipe Network',
      },
      droneMission: 'Autonomous Drone Aerial Survey',
      startDrone: 'Launch 30s Drone Mission',
      droneScanning: 'Drone Crop Health Scan Chal Raha Hai...',
      remoteAutomation: 'Remote Borewell & Valve Control',
      pumpStatus: 'Main Borewell Submersible Motor',
      turnOn: 'Motor ON Karein (Pani Flow)',
      turnOff: 'Motor OFF Karein',
      climateShockSimulator: 'AI Mausam Shock & Yield Stress Simulator',
    },
    simpleMode: {
      title: 'AgriVision Real Voice Kisan Guide',
      subtitle: 'Gemini AI + Multi-language Voice Input & Bolkar Batane Wala Assistant',
      exit: 'Exit Simple Mode',
      listening: 'Sun raha hu... Boliye!',
      speakNow: 'Bolne ke liye mic button dabayein',
      askPlaceholder: 'Fasal, bimari, khad, pashu aahar, jeevamrut ya mandi bhav puchein...',
    },
    aiVision: {
      title: 'Precision AI Vision & Pathology Diagnostics',
      subtitle: 'Maturity countdown, Brix sweetness, Gehun Ratuwa (Rust) dataset & exact ilaj',
      maturityTab: 'Fasal Maturity & Kataai Timing AI',
      pathologyTab: 'Pathology Diagnostic Scanner',
      wheatRustTab: 'Wheat Rust Dataset Benchmark',
    },
  },
};
