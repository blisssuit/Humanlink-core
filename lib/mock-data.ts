export const mockWeather = {
  temperature: 28,
  condition: 'Partly Cloudy',
  humidity: 65,
  rainfall: '2.4mm',
  windSpeed: 12,
  uvIndex: 7,
}

export const mockFarmHealth = {
  score: 82,
  status: 'Excellent',
  lastUpdated: '2 hours ago',
  alerts: 1,
}

export const mockRecommendedCrops = [
  {
    id: '1',
    name: 'Maize',
    suitability: 94,
    season: 'Rainy Season',
    expectedYield: '2.8 tons/acre',
    reasoning: 'Optimal soil pH and rainfall pattern',
  },
  {
    id: '2',
    name: 'Beans',
    suitability: 87,
    season: 'Dry Season',
    expectedYield: '1.2 tons/acre',
    reasoning: 'Good drainage, nitrogen-fixing benefits',
  },
  {
    id: '3',
    name: 'Cassava',
    suitability: 81,
    season: 'Year-round',
    expectedYield: '4.5 tons/acre',
    reasoning: 'Drought-resistant, suitable for clay soil',
  },
]

export const mockMarketPrices = [
  { crop: 'Maize', price: '₦18,500/50kg', trend: 'up', change: '+3.2%' },
  { crop: 'Beans', price: '₦24,000/50kg', trend: 'stable', change: '±0%' },
  { crop: 'Rice', price: '₦22,000/50kg', trend: 'down', change: '-1.8%' },
  { crop: 'Tomatoes', price: '₦8,500/crate', trend: 'up', change: '+5.1%' },
]

export const mockDiseases = [
  {
    id: '1',
    name: 'Maize Leaf Blight',
    confidence: 92,
    symptoms: ['Brown lesions on leaves', 'Yellow halo around spots', 'Premature leaf death'],
    treatment: 'Apply fungicide (Chlorothalonil), Remove infected leaves, Improve drainage',
    riskLevel: 'High',
    recovery: '7-10 days with treatment',
  },
  {
    id: '2',
    name: 'Early Blight',
    confidence: 78,
    symptoms: ['Target-like spots', 'Brown concentric rings', 'Leaf yellowing'],
    treatment: 'Copper-based fungicide, Prune affected areas, Space plants for airflow',
    riskLevel: 'Medium',
    recovery: '5-7 days',
  },
]

export const mockMarketplace = [
  {
    id: '1',
    name: 'Premium White Maize',
    farmer: 'Adeyemi Farms',
    price: '₦18,500',
    quantity: '50kg bag',
    location: 'Oyo State',
    rating: 4.8,
    reviews: 234,
    grade: 'A',
    image: 'https://images.unsplash.com/photo-1574943320219-553eb20e72f3?w=400&h=300&fit=crop',
  },
  {
    id: '2',
    name: 'Fresh Organic Tomatoes',
    farmer: 'Lagos Valley Cooperative',
    price: '₦8,500',
    quantity: 'Per Crate',
    location: 'Lagos State',
    rating: 4.6,
    reviews: 189,
    grade: 'A',
    image: 'https://images.unsplash.com/photo-1592841519144-ffa2b7e15286?w=400&h=300&fit=crop',
  },
  {
    id: '3',
    name: 'Golden Red Pepper',
    farmer: 'Kano Harvest Inc.',
    price: '₦12,000',
    quantity: '25kg bag',
    location: 'Kano State',
    rating: 4.7,
    reviews: 156,
    grade: 'B+',
    image: 'https://images.unsplash.com/photo-1599599810694-b5ac4dd64b10?w=400&h=300&fit=crop',
  },
  {
    id: '4',
    name: 'Premium Rice',
    farmer: 'Niger Delta Farms',
    price: '₦22,000',
    quantity: '50kg bag',
    location: 'Delta State',
    rating: 4.5,
    reviews: 312,
    grade: 'A+',
    image: 'https://images.unsplash.com/photo-1582082743221-0a49f73b6da0?w=400&h=300&fit=crop',
  },
]

export const mockTrucks = [
  {
    id: '1',
    driverName: 'Chisom Okafor',
    vehicleType: 'Truck (5 tons)',
    rating: 4.9,
    pricePerKm: '₦80',
    availability: 'Available now',
    capacity: '5 tons',
    image: 'https://images.unsplash.com/photo-1493773671923-90ac2bae2149?w=400&h=300&fit=crop',
  },
  {
    id: '2',
    driverName: 'Emmanuel Adebayo',
    vehicleType: 'Truck (10 tons)',
    rating: 4.7,
    pricePerKm: '₦120',
    availability: 'Available in 1 hour',
    capacity: '10 tons',
    image: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=400&h=300&fit=crop',
  },
  {
    id: '3',
    driverName: 'Grace Eze',
    vehicleType: 'Van (2 tons)',
    rating: 4.8,
    pricePerKm: '₦50',
    availability: 'Available now',
    capacity: '2 tons',
    image: 'https://images.unsplash.com/photo-1527274537519-b8f69ede0ceb?w=400&h=300&fit=crop',
  },
]

export const mockFarmData = {
  totalHarvest: '425 tons',
  profit: '₦1,240,500',
  expenses: '₦845,200',
  cropHistory: [
    { crop: 'Maize', harvested: '180 tons', profit: '₦585,000', date: '2024-06-15' },
    { crop: 'Beans', harvested: '95 tons', profit: '₦380,000', date: '2024-05-20' },
    { crop: 'Rice', harvested: '150 tons', profit: '₦275,500', date: '2024-04-10' },
  ],
  upcomingTasks: [
    { task: 'Fertilizer application', dueDate: 'Tomorrow', priority: 'High' },
    { task: 'Pest monitoring', dueDate: 'In 3 days', priority: 'Medium' },
    { task: 'Irrigation check', dueDate: 'In 5 days', priority: 'Low' },
  ],
}

export const premiumBenefits = [
  {
    title: 'Unlimited AI Crop Scans',
    description: 'Scan unlimited crops for diseases and get instant AI diagnosis',
    icon: '🔍',
  },
  {
    title: 'Advanced Crop Recommendations',
    description: 'Get personalized crop recommendations based on your farm data',
    icon: '🌱',
  },
  {
    title: 'Yield Prediction',
    description: 'AI-powered predictions for your expected harvest yields',
    icon: '📊',
  },
  {
    title: 'Market Forecasts',
    description: 'Real-time market trends and price predictions',
    icon: '📈',
  },
  {
    title: 'Priority Support',
    description: '24/7 dedicated support from agricultural experts',
    icon: '🎯',
  },
  {
    title: 'Monthly Analytics',
    description: 'Comprehensive farm performance analytics and insights',
    icon: '📋',
  },
]
