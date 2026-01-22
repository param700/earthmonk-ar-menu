export interface MenuItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  currency: string;
  description: string;
  image: string;
  model3D?: string;
  modelAR?: string;
  ingredients: string[];
  isVeg: boolean;
  isSpicy: boolean;
  isPopular: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  thumbnail: string;
  description: string;
  items: MenuItem[];
}

// Cloudinary paths for categories
const CATEGORY_IMAGES = {
  italian: "italian_uazwiy.jpg",
  thai: "thai_zemzpw.jpg",
  continental: "continental_f9fjpo.jpg",
  beverages: "beverages_f4fvnu.jpg",
  desserts: "desserts_thrr0i.jpg",
};

// Cloudinary paths for menu items
const MENU_IMAGES = {
  margherita: "margherita_lazhuf.jpg",
  pastaAlfredo: "pasta-alfredo_v1loz1.jpg",
  bruschetta: "bruschetta_zf5wsf.jpg",
  padThai: "pad-thai_jsicvm.jpg",
  greenCurry: "green-curry_jnqyym.jpg",
  tomYum: "tom-yum_hj9fkn.jpg",
  grilledSandwich: "grilled-sandwich_hwabv7.jpg",
  caesarSalad: "caesar-salad_idqw3v.jpg",
  latte: "latte_gobzwx.jpg",
  mojito: "mojito_ohemoj.jpg",
  mangoSmoothie: "mango-smoothie_enxzrz.jpg",
  tiramisu: "tiramisu_ujrrfs.jpg",
  chocolateLava: "chocolate-lava_vyvmlg.jpg",
};

// Cloudinary paths for 3D models
const MODEL_3D = {
  sampleDish: "output_bk3tev",
};

export const menuCategories: Category[] = [
  {
    id: "italian",
    name: "Italian Cuisine",
    slug: "italian",
    thumbnail: CATEGORY_IMAGES.italian,
    description: "Authentic Italian flavors with a vegetarian twist",
    items: [
      {
        id: "margherita-pizza",
        name: "Margherita Pizza",
        slug: "margherita-pizza",
        price: 350,
        currency: "₹",
        description: "Classic Italian pizza with fresh basil, mozzarella cheese, and our signature tomato sauce on a perfectly crispy crust",
        image: MENU_IMAGES.margherita,
        model3D: MODEL_3D.sampleDish,
        ingredients: ["Tomato Sauce", "Fresh Mozzarella", "Basil", "Olive Oil", "Oregano"],
        isVeg: true,
        isSpicy: false,
        isPopular: true,
      },
      {
        id: "pasta-alfredo",
        name: "Pasta Alfredo",
        slug: "pasta-alfredo",
        price: 320,
        currency: "₹",
        description: "Creamy fettuccine pasta with our rich homemade Alfredo sauce and fresh herbs",
        image: MENU_IMAGES.pastaAlfredo,
        model3D: MODEL_3D.sampleDish,
        ingredients: ["Fettuccine", "Cream", "Parmesan", "Garlic", "Herbs"],
        isVeg: true,
        isSpicy: false,
        isPopular: true,
      },
      {
        id: "bruschetta",
        name: "Garden Bruschetta",
        slug: "bruschetta",
        price: 220,
        currency: "₹",
        description: "Toasted artisan bread topped with fresh tomatoes, basil, and balsamic glaze",
        image: MENU_IMAGES.bruschetta,
        model3D: MODEL_3D.sampleDish,
        ingredients: ["Artisan Bread", "Tomatoes", "Basil", "Balsamic", "Garlic"],
        isVeg: true,
        isSpicy: false,
        isPopular: false,
      },
    ],
  },
  {
    id: "thai",
    name: "Thai Cuisine",
    slug: "thai",
    thumbnail: CATEGORY_IMAGES.thai,
    description: "Aromatic Thai dishes with authentic flavors",
    items: [
      {
        id: "pad-thai",
        name: "Vegetable Pad Thai",
        slug: "pad-thai",
        price: 280,
        currency: "₹",
        description: "Stir-fried rice noodles with tofu, vegetables, crushed peanuts, and our signature tamarind sauce",
        image: MENU_IMAGES.padThai,
        model3D: MODEL_3D.sampleDish,
        ingredients: ["Rice Noodles", "Tofu", "Bean Sprouts", "Peanuts", "Tamarind"],
        isVeg: true,
        isSpicy: true,
        isPopular: true,
      },
      {
        id: "green-curry",
        name: "Thai Green Curry",
        slug: "green-curry",
        price: 300,
        currency: "₹",
        description: "Aromatic coconut curry with fresh vegetables and Thai basil",
        image: MENU_IMAGES.greenCurry,
        model3D: MODEL_3D.sampleDish,
        ingredients: ["Coconut Milk", "Green Curry Paste", "Vegetables", "Thai Basil"],
        isVeg: true,
        isSpicy: true,
        isPopular: true,
      },
      {
        id: "tom-yum",
        name: "Tom Yum Soup",
        slug: "tom-yum",
        price: 180,
        currency: "₹",
        description: "Hot and sour Thai soup with mushrooms, lemongrass, and galangal",
        image: MENU_IMAGES.tomYum,
        model3D: MODEL_3D.sampleDish,
        ingredients: ["Lemongrass", "Galangal", "Mushrooms", "Lime", "Chili"],
        isVeg: true,
        isSpicy: true,
        isPopular: false,
      },
    ],
  },
  {
    id: "continental",
    name: "Continental",
    slug: "continental",
    thumbnail: CATEGORY_IMAGES.continental,
    description: "Classic European dishes with modern presentation",
    items: [
      {
        id: "grilled-sandwich",
        name: "Garden Grilled Sandwich",
        slug: "grilled-sandwich",
        price: 220,
        currency: "₹",
        description: "Multigrain bread with grilled vegetables, cheese, and herb mayo",
        image: MENU_IMAGES.grilledSandwich,
        model3D: MODEL_3D.sampleDish,
        ingredients: ["Multigrain Bread", "Grilled Vegetables", "Cheese", "Herbs"],
        isVeg: true,
        isSpicy: false,
        isPopular: true,
      },
      {
        id: "caesar-salad",
        name: "Classic Caesar Salad",
        slug: "caesar-salad",
        price: 260,
        currency: "₹",
        description: "Fresh romaine lettuce with caesar dressing, croutons, and parmesan",
        image: MENU_IMAGES.caesarSalad,
        model3D: MODEL_3D.sampleDish,
        ingredients: ["Romaine Lettuce", "Caesar Dressing", "Croutons", "Parmesan"],
        isVeg: true,
        isSpicy: false,
        isPopular: false,
      },
    ],
  },
  {
    id: "beverages",
    name: "Beverages",
    slug: "beverages",
    thumbnail: CATEGORY_IMAGES.beverages,
    description: "Refreshing drinks and specialty coffees",
    items: [
      {
        id: "earthmonk-latte",
        name: "Earthmonk Special Latte",
        slug: "earthmonk-latte",
        price: 180,
        currency: "₹",
        description: "Our signature blend with notes of caramel and a hint of vanilla",
        image: MENU_IMAGES.latte,
        model3D: MODEL_3D.sampleDish,
        ingredients: ["Espresso", "Steamed Milk", "Caramel", "Vanilla"],
        isVeg: true,
        isSpicy: false,
        isPopular: true,
      },
      {
        id: "mint-mojito",
        name: "Fresh Mint Mojito",
        slug: "mint-mojito",
        price: 150,
        currency: "₹",
        description: "Refreshing mocktail with fresh mint, lime, and soda",
        image: MENU_IMAGES.mojito,
        model3D: MODEL_3D.sampleDish,
        ingredients: ["Fresh Mint", "Lime", "Sugar", "Soda"],
        isVeg: true,
        isSpicy: false,
        isPopular: true,
      },
      {
        id: "mango-smoothie",
        name: "Tropical Mango Smoothie",
        slug: "mango-smoothie",
        price: 160,
        currency: "₹",
        description: "Creamy mango smoothie with a hint of honey",
        image: MENU_IMAGES.mangoSmoothie,
        model3D: MODEL_3D.sampleDish,
        ingredients: ["Fresh Mango", "Yogurt", "Honey", "Ice"],
        isVeg: true,
        isSpicy: false,
        isPopular: false,
      },
    ],
  },
  {
    id: "desserts",
    name: "Desserts",
    slug: "desserts",
    thumbnail: CATEGORY_IMAGES.desserts,
    description: "Sweet endings to your meal",
    items: [
      {
        id: "tiramisu",
        name: "Classic Tiramisu",
        slug: "tiramisu",
        price: 280,
        currency: "₹",
        description: "Layers of coffee-soaked ladyfingers with mascarpone cream",
        image: MENU_IMAGES.tiramisu,
        model3D: MODEL_3D.sampleDish,
        ingredients: ["Mascarpone", "Coffee", "Ladyfingers", "Cocoa"],
        isVeg: true,
        isSpicy: false,
        isPopular: true,
      },
      {
        id: "chocolate-lava",
        name: "Chocolate Lava Cake",
        slug: "chocolate-lava",
        price: 260,
        currency: "₹",
        description: "Warm chocolate cake with a molten center, served with vanilla ice cream",
        image: MENU_IMAGES.chocolateLava,
        ingredients: ["Dark Chocolate", "Butter", "Eggs", "Vanilla Ice Cream"],
        isVeg: true,
        isSpicy: false,
        isPopular: true,
      },
    ],
  },
];

export const getCategoryBySlug = (slug: string): Category | undefined => {
  return menuCategories.find((cat) => cat.slug === slug);
};

export const getItemBySlug = (categorySlug: string, itemSlug: string): MenuItem | undefined => {
  const category = getCategoryBySlug(categorySlug);
  return category?.items.find((item) => item.slug === itemSlug);
};

export const getAllItems = (): { category: Category; item: MenuItem }[] => {
  const items: { category: Category; item: MenuItem }[] = [];
  menuCategories.forEach((category) => {
    category.items.forEach((item) => {
      items.push({ category, item });
    });
  });
  return items;
};

// Cloudinary video path for intro
export const INTRO_VIDEO_PATH = "earthmonk-intro_oucm79.mp4";
