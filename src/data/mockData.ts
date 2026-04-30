// TYPES
export type Product = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  description: string;
  stock: number;
  isFeatured?: boolean;
};

export type Category = {
  id: string;
  name: string;
  image: string;
};

export type Offer = {
  id: string;
  title: string;
  description: string;
  code: string;
  image: string;
  color: string;
};

// CATEGORIES (TOP UI)
export const CATEGORIES: Category[] = [
  { id: 'c1', name: 'Rice & Atta', image: 'https://images.unsplash.com/photo-1586201375761-83865001e8ac?auto=format&fit=crop&w=200&q=80' },
  { id: 'c2', name: 'Snacks', image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?auto=format&fit=crop&w=200&q=80' },
  { id: 'c3', name: 'Beverages', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=200&q=80' },
  { id: 'c4', name: 'Dairy', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=200&q=80' },
  { id: 'c5', name: 'Household', image: 'https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?auto=format&fit=crop&w=200&q=80' },
  { id: 'c6', name: 'Spices', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=200&q=80' },
  { id: 'c7', name: 'Hardware', image: 'https://images.unsplash.com/photo-1588881266008-0118fb20d43a?auto=format&fit=crop&w=200&q=80' },
];

// SIDEBAR CATEGORIES
export const SIDEBAR_CATEGORIES = [
  "Cold Drinks",
  "Water & Juices",
  "Dairy",
  "Bread & Bakery",
  "Cereals & Breakfast Items",
  "Rice & Atta",
  "Pulses & Lentils",
  "Snacks & Namkeen",
  "Biscuits & Cookies",
  "Chocolates & Sweets",
  "Instant Foods",
  "Spices",
  "Cooking Oil & Ghee",
  "Dry Fruits & Nuts",
  "Personal Care",
  "Baby Care",
  "Household",
  "Cleaning Supplies",
  "Stationery",
  "Pet Food",
  "Tea & Coffee",
  "Hardware"
];

// OFFERS
export const OFFERS: Offer[] = [
  {
    id: 'o1',
    title: '50% OFF',
    description: 'On your first order up to ₹100',
    code: 'NEW50',
    image: '🎉',
    color: 'bg-emerald-100 text-emerald-800'
  },
  {
    id: 'o2',
    title: 'Flat ₹50 OFF',
    description: 'On orders above ₹500',
    code: 'SAVE50',
    image: '🏷️',
    color: 'bg-blue-100 text-blue-800'
  }
];

// IMAGE MAP (REAL URLS)
const categoryImageMap: Record<string, string> = {
  "Cold Drinks": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=300&q=80",
  "Water & Juices": "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=300&q=80",
  "Dairy": "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=300&q=80",
  "Bread & Bakery": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=300&q=80",
  "Cereals & Breakfast Items": "https://images.unsplash.com/photo-1521401830884-6c03c1c87ebb?auto=format&fit=crop&w=300&q=80",
  "Rice & Atta": "https://images.unsplash.com/photo-1586201375761-83865001e8ac?auto=format&fit=crop&w=300&q=80",
  "Pulses & Lentils": "https://images.unsplash.com/photo-1585141979929-23f2b1d06e22?auto=format&fit=crop&w=300&q=80",
  "Snacks & Namkeen": "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?auto=format&fit=crop&w=300&q=80",
  "Biscuits & Cookies": "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=300&q=80",
  "Chocolates & Sweets": "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=300&q=80",
  "Instant Foods": "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=300&q=80",
  "Spices": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=300&q=80",
  "Cooking Oil & Ghee": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=300&q=80",
  "Dry Fruits & Nuts": "https://images.unsplash.com/photo-1599598425947-3300bfddafec?auto=format&fit=crop&w=300&q=80",
  "Personal Care": "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=300&q=80",
  "Baby Care": "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=300&q=80",
  "Household": "https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?auto=format&fit=crop&w=300&q=80",
  "Cleaning Supplies": "https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?auto=format&fit=crop&w=300&q=80",
  "Stationery": "https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?auto=format&fit=crop&w=300&q=80",
  "Pet Food": "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=300&q=80",
  "Tea & Coffee": "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=300&q=80",
  "Hardware": "https://images.unsplash.com/photo-1588881266008-0118fb20d43a?auto=format&fit=crop&w=300&q=80"
};

// PRICE RANGE (REALISTIC)
const priceRange: Record<string, [number, number]> = {
  "Cold Drinks": [35, 60],
  "Water & Juices": [20, 120],
  "Dairy": [25, 80],
  "Bread & Bakery": [20, 70],
  "Cereals & Breakfast Items": [80, 250],
  "Rice & Atta": [200, 600],
  "Pulses & Lentils": [100, 300],
  "Snacks & Namkeen": [10, 50],
  "Biscuits & Cookies": [10, 40],
  "Chocolates & Sweets": [20, 200],
  "Instant Foods": [30, 120],
  "Spices": [20, 150],
  "Cooking Oil & Ghee": [120, 300],
  "Dry Fruits & Nuts": [200, 800],
  "Personal Care": [50, 300],
  "Baby Care": [100, 500],
  "Household": [100, 400],
  "Cleaning Supplies": [50, 250],
  "Stationery": [10, 100],
  "Pet Food": [150, 500],
  "Tea & Coffee": [80, 300],
  "Hardware": [100, 1000]
};

// PRODUCTS
export const PRODUCTS: Product[] = [
  // 🥤 Cold Drinks
  {
    id: 'cd1',
    name: 'Coca Cola 750ml',
    price: 40,
    image: 'https://res.cloudinary.com/dgobeiwem/image/upload/f_auto,q_auto/v1777276963/coca_mzmu05.jpg',
    category: 'Cold Drinks',
    description: 'Refreshing Coca Cola soft drink bottle.',
    stock: 15,
    isFeatured: true
  },
  {
    id: 'cd2',
    name: 'Pepsi 750ml',
    price: 40,
    image: 'https://res.cloudinary.com/dgobeiwem/image/upload/f_auto,q_auto/v1777276963/pepsi_dvmtup.jpg',
    category: 'Cold Drinks',
    description: 'Chilled Pepsi soft drink.',
    stock: 12
  },
  {
    id: 'cd3',
    name: 'Sprite 750ml',
    price: 40,
    image: 'https://res.cloudinary.com/dgobeiwem/image/upload/f_auto,q_auto/v1777276962/SPRITE-750ML_x1h5gy.png',
    category: 'Cold Drinks',
    description: 'Lemon flavored Sprite drink.',
    stock: 10
  },
  {
    id: 'cd4',
    name: 'Mountain Dew 750ml',
    price: 40,
    image: 'https://res.cloudinary.com/dgobeiwem/image/upload/q_auto,f_auto/v1777276962/dew_mqyfrb.jpg',
    category: 'Cold Drinks',
    description: 'Mountain Dew energy drink.',
    stock: 8
  },
  {
    id: 'cd5',
    name: 'Fanta Orange 750ml',
    price: 40,
    image: 'https://res.cloudinary.com/dgobeiwem/image/upload/q_auto,f_auto/v1777276961/fanta_t7ryjw.jpg',
    category: 'Cold Drinks',
    description: 'Orange flavored Fanta drink.',
    stock: 10
  },

  // 🥛 Dairy
  {
    id: 'd1',
    name: 'Amul Milk 1L',
    price: 60,
    image: 'https://res.cloudinary.com/dgobeiwem/image/upload/q_auto,f_auto/v1777276960/milk_mtclh2.jpg',
    category: 'Dairy',
    description: 'Fresh Amul milk packet.',
    stock: 20,
    isFeatured: true
  },
  {
    id: 'd2',
    name: 'Amul Butter 500g',
    price: 280,
    image: 'https://res.cloudinary.com/dgobeiwem/image/upload/q_auto,f_auto/v1777276960/butter_slwoo8.jpg',
    category: 'Dairy',
    description: 'Creamy Amul butter.',
    stock: 10
  },
  {
    id: 'd3',
    name: 'Amul Cheese Slices',
    price: 140,
    image: 'https://res.cloudinary.com/dgobeiwem/image/upload/q_auto,f_auto/v1777276949/amul_cheese_a8iufv.jpg',
    category: 'Dairy',
    description: 'Processed cheese slices.',
    stock: 12
  },
  {
    id: 'd4',
    name: 'Curd Cup',
    price: 40,
    image: 'https://res.cloudinary.com/dgobeiwem/image/upload/q_auto,f_auto/v1777276949/curd_ek0suv.jpg',
    category: 'Dairy',
    description: 'Fresh curd cup.',
    stock: 15
  },

  // 🍫 Snacks
  {
    id: 's1',
    name: 'Lays Chips',
    price: 20,
    image: 'https://res.cloudinary.com/dgobeiwem/image/upload/q_auto,f_auto/v1777276950/lays_r6yhkr.jpg',
    category: 'Snacks & Namkeen',
    description: 'Crunchy potato chips.',
    stock: 25,
    isFeatured: true
  },
  {
    id: 's2',
    name: 'Kurkure Masala',
    price: 20,
    image: 'https://res.cloudinary.com/dgobeiwem/image/upload/q_auto,f_auto/v1777276951/kurkure_ie7ol9.jpg',
    category: 'Snacks & Namkeen',
    description: 'Spicy Kurkure snack.',
    stock: 20
  },
  {
    id: 's3',
    name: 'Haldiram Bhujia',
    price: 60,
    image: 'https://res.cloudinary.com/dgobeiwem/image/upload/q_auto,f_auto/v1777276951/haldiram_op3cof.jpg',
    category: 'Snacks & Namkeen',
    description: 'Traditional namkeen.',
    stock: 15
  },
  {
    id: 's4',
    name: 'Bingo Chips',
    price: 20,
    image: 'https://res.cloudinary.com/dgobeiwem/image/upload/q_auto,f_auto/v1777276952/bingo_wcjrls.jpg',
    category: 'Snacks & Namkeen',
    description: 'Tasty Bingo chips.',
    stock: 18
  },
  {
    id: 's5',
    name: 'Parle G Biscuit',
    price: 10,
    image: 'https://res.cloudinary.com/dgobeiwem/image/upload/q_auto,f_auto/v1777276952/parle_obzksv.jpg',
    category: 'Snacks & Namkeen',
    description: 'Classic glucose biscuits.',
    stock: 30
  },

  // 🍞 Bread & Bakery
  {
    id: 'b1',
    name: 'White Bread',
    price: 40,
    image: 'https://res.cloudinary.com/dgobeiwem/image/upload/q_auto,f_auto/v1777276949/white_bread_oudhaq.jpg',
    category: 'Bread & Bakery',
    description: 'Fresh white bread loaf.',
    stock: 15
  },
  {
    id: 'b2',
    name: 'Brown Bread',
    price: 50,
    image: 'https://res.cloudinary.com/dgobeiwem/image/upload/q_auto,f_auto/v1777276949/brown_bread_zlu6xl.jpg',
    category: 'Bread & Bakery',
    description: 'Healthy brown bread.',
    stock: 12
  },
  {
    id: 'b3',
    name: 'Burger Buns',
    price: 35,
    image: 'https://res.cloudinary.com/dgobeiwem/image/upload/q_auto,f_auto/v1777276949/burger_buna_mprvef.jpg',
    category: 'Bread & Bakery',
    description: 'Soft burger buns.',
    stock: 10
  },
  {
    id: 'b4',
    name: 'Cake Slice',
    price: 60,
    image: 'https://res.cloudinary.com/dgobeiwem/image/upload/q_auto,f_auto/v1777276950/cake_slice_wsvj7o.jpg',
    category: 'Bread & Bakery',
    description: 'Delicious cake slice.',
    stock: 8
  },
  {
    id: 'b5',
    name: 'Pav Bread',
    price: 30,
    image: 'https://res.cloudinary.com/dgobeiwem/image/upload/q_auto,f_auto/v1777276949/Ladi_pav_awkloq.jpg',
    category: 'Bread & Bakery',
    description: 'Fresh pav bread.',
    stock: 15
  },

  // 🍜 Instant Foods
  {
    id: 'i1',
    name: 'Maggi Noodles',
    price: 14,
    image: 'https://res.cloudinary.com/dgobeiwem/image/upload/q_auto,f_auto/v1777276950/R_noodle_evuado.jpg',
    category: 'Instant Foods',
    description: 'Instant Maggi noodles.',
    stock: 30
  },
  {
    id: 'i2',
    name: 'Yippee Noodles',
    price: 14,
    image: 'https://res.cloudinary.com/dgobeiwem/image/upload/q_auto,f_auto/v1777276950/yippee_s81f2e.jpg',
    category: 'Instant Foods',
    description: 'Yippee instant noodles.',
    stock: 25
  },
  {
    id: 'i3',
    name: 'Cup Noodles',
    price: 50,
    image: 'https://res.cloudinary.com/dgobeiwem/image/upload/q_auto,f_auto/v1777276950/cup_noodle_cust7e.jpg',
    category: 'Instant Foods',
    description: 'Ready cup noodles.',
    stock: 20
  },
  {
    id: 'i4',
    name: 'Pasta Packet',
    price: 80,
    image: 'https://res.cloudinary.com/dgobeiwem/image/upload/q_auto,f_auto/v1777276950/magic_pasta_luvn3g.jpg',
    category: 'Instant Foods',
    description: 'Instant pasta pack.',
    stock: 18
  },
  {
    id: 'i5',
    name: 'Ready Biryani',
    price: 120,
    image: 'https://res.cloudinary.com/dgobeiwem/image/upload/q_auto,f_auto/v1777276950/ready_biryani_ypuewd.jpg',
    category: 'Instant Foods',
    description: 'Ready to eat biryani.',
    stock: 10
  },

  // 🥤 Beverages
  {
    id: 'bev1',
    name: 'Coca Cola 1.25L',
    price: 70,
    image: 'https://res.cloudinary.com/dgobeiwem/image/upload/q_auto,f_auto/v1777276953/cola_xvl8lp.jpg',
    category: 'Beverages',
    description: 'Large Coca Cola bottle.',
    stock: 12
  },
  {
    id: 'bev2',
    name: 'Thums Up',
    price: 70,
    image: 'https://res.cloudinary.com/dgobeiwem/image/upload/q_auto,f_auto/v1777276953/thumbup_dc7ffi.jpg',
    category: 'Beverages',
    description: 'Strong Thums Up drink.',
    stock: 10
  },
  {
    id: 'bev3',
    name: 'Frooti',
    price: 20,
    image: 'https://res.cloudinary.com/dgobeiwem/image/upload/q_auto,f_auto/v1777276953/frooti_wvwu5r.jpg',
    category: 'Beverages',
    description: 'Mango Frooti drink.',
    stock: 25
  },
  {
    id: 'bev4',
    name: 'Real Juice',
    price: 120,
    image: 'https://res.cloudinary.com/dgobeiwem/image/upload/q_auto,f_auto/v1777276954/Real_vpkrnu.jpg',
    category: 'Beverages',
    description: 'Fruit juice pack.',
    stock: 15
  },
  {
    id: 'bev5',
    name: 'Slice',
    price: 20,
    image: 'https://res.cloudinary.com/dgobeiwem/image/upload/q_auto,f_auto/v1777276954/slice_yafq0r.jpg',
    category: 'Beverages',
    description: 'Slice mango drink.',
    stock: 20
  },

  // 🍚 Rice & Atta
  {
    id: 'r1',
    name: 'Aashirvaad Atta 5kg',
    price: 280,
    image: 'https://res.cloudinary.com/dgobeiwem/image/upload/q_auto,f_auto/v1777276954/a_aatta_qjjzlw.jpg',
    category: 'Rice & Atta',
    description: 'Premium wheat flour.',
    stock: 10
  },
  {
    id: 'r2',
    name: 'Fortune Atta',
    price: 260,
    image: 'https://res.cloudinary.com/dgobeiwem/image/upload/q_auto,f_auto/v1777276955/fortue_atta_weu8pl.jpg',
    category: 'Rice & Atta',
    description: 'Fortune atta pack.',
    stock: 12
  },
  {
    id: 'r3',
    name: 'India Gate Rice',
    price: 350,
    image: 'https://res.cloudinary.com/dgobeiwem/image/upload/q_auto,f_auto/v1777276955/inda_gate_d0hyjt.jpg',
    category: 'Rice & Atta',
    description: 'Basmati rice.',
    stock: 8
  },
  {
    id: 'r4',
    name: 'Daawat Rice',
    price: 320,
    image: 'https://res.cloudinary.com/dgobeiwem/image/upload/q_auto,f_auto/v1777276955/dawat_i88oum.jpg',
    category: 'Rice & Atta',
    description: 'Premium rice.',
    stock: 10
  },
  {
    id: 'r5',
    name: 'Tata Sampann Atta',
    price: 300,
    image: 'https://res.cloudinary.com/dgobeiwem/image/upload/q_auto,f_auto/v1777276956/tata_sapan_akny07.jpg',
    category: 'Rice & Atta',
    description: 'High quality atta.',
    stock: 10
  },

  // 🌶️ Spices
  {
    id: 'sp1',
    name: 'MDH Garam Masala',
    price: 80,
    image: 'https://res.cloudinary.com/dgobeiwem/image/upload/q_auto,f_auto/v1777276956/garam_masala_eckdv6.jpg',
    category: 'Spices',
    description: 'Authentic spice mix.',
    stock: 20
  },
  {
    id: 'sp2',
    name: 'Turmeric Powder',
    price: 60,
    image: 'https://res.cloudinary.com/dgobeiwem/image/upload/q_auto,f_auto/v1777276956/termiric_ooxwbq.jpg',
    category: 'Spices',
    description: 'Pure turmeric powder.',
    stock: 18
  },
  {
    id: 'sp3',
    name: 'Red Chilli Powder',
    price: 70,
    image: 'https://res.cloudinary.com/dgobeiwem/image/upload/q_auto,f_auto/v1777276957/red_chilli_uvvff2.jpg',
    category: 'Spices',
    description: 'Spicy chilli powder.',
    stock: 15
  },
  {
    id: 'sp4',
    name: 'Coriander Powder',
    price: 60,
    image: 'https://res.cloudinary.com/dgobeiwem/image/upload/q_auto,f_auto/v1777276957/coriender_ukywuv.jpg',
    category: 'Spices',
    description: 'Ground coriander powder.',
    stock: 15
  },
  {
    id: 'sp5',
    name: 'Chaat Masala',
    price: 50,
    image: 'https://res.cloudinary.com/dgobeiwem/image/upload/q_auto,f_auto/v1777276957/mdh_qt5jkd.jpg',
    category: 'Spices',
    description: 'Tangy spice mix.',
    stock: 20
  },

  // 🧴 Household
  {
    id: 'h1',
    name: 'Surf Excel',
    price: 120,
    image: 'https://res.cloudinary.com/dgobeiwem/image/upload/q_auto,f_auto/v1777276958/surf_hglasp.jpg',
    category: 'Household',
    description: 'Detergent powder.',
    stock: 12
  },
  {
    id: 'h2',
    name: 'Tide Powder',
    price: 110,
    image: 'https://res.cloudinary.com/dgobeiwem/image/upload/q_auto,f_auto/v1777276958/Tide_o9pbx0.jpg',
    category: 'Household',
    description: 'Laundry detergent.',
    stock: 10
  },
  {
    id: 'h3',
    name: 'Vim Bar',
    price: 10,
    image: 'https://res.cloudinary.com/dgobeiwem/image/upload/q_auto,f_auto/v1777276959/vim_cts76z.jpg',
    category: 'Household',
    description: 'Dishwash bar.',
    stock: 25
  },
  {
    id: 'h4',
    name: 'Harpic Cleaner',
    price: 95,
    image: 'https://res.cloudinary.com/dgobeiwem/image/upload/q_auto,f_auto/v1777276959/harpic_sgkrx3.jpg',
    category: 'Household',
    description: 'Toilet cleaner.',
    stock: 15
  },
  {
    id: 'h5',
    name: 'Lizol Cleaner',
    price: 150,
    image: 'https://res.cloudinary.com/dgobeiwem/image/upload/q_auto,f_auto/v1777276960/lizo_ykoazg.jpg',
    category: 'Household',
    description: 'Floor cleaner.',
    stock: 10
  }
];

const manualCategories = [
  "Cold Drinks", 
  "Dairy", 
  "Snacks & Namkeen",
  "Bread & Bakery",
  "Instant Foods",
  "Beverages",
  "Rice & Atta",
  "Spices",
  "Household"
];

SIDEBAR_CATEGORIES.forEach((cat) => {
  if (manualCategories.includes(cat)) return;

  for (let i = 1; i <= 5; i++) {

    const [min, max] = priceRange[cat] || [20, 200];
    const imgUrl = categoryImageMap[cat] || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=300&q=80";

    PRODUCTS.push({
      id: `${cat.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}-${i}`,
      name: `${cat} Item ${i}`,
      price: Math.floor(Math.random() * (max - min)) + min,

      image: imgUrl,

      category: cat,
      description: `Best quality ${cat.toLowerCase()} available at affordable price.`,
      stock: Math.floor(Math.random() * 15) + 5,

      isFeatured: i === 1
    });
  }
});
