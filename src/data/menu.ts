export type MenuItem = {
  name: string;
  detail?: string;
  note?: string;
  price?: string;
  pour?: string;
  bottle?: string;
  glass?: string;
  happyHour?: string;
};

export type MenuCategory = {
  slug: string;
  title: string;
  description?: string;
  items: MenuItem[];
};

export type MenuVolume = {
  slug: string;
  title: string;
  description: string;
  items: MenuItem[];
};

export const cocktailVolumes: MenuVolume[] = [
  {
    slug: "blooms",
    title: "Vol 1 — The Blooms",
    description:
      "Light, floral, and aromatic — built around house-made botanical syrups, fresh citrus, and seasonal fruit. These cocktails open the night with elegance and color.",
    items: [
      { name: "Desert Rose", detail: "Teremana Blanco, Hibiscus, Fresh Lime/Lemon", note: "Floral and bright with a citrus finish.", price: "$20" },
      { name: "Golden Nugget", detail: "Watermelon Basil Vodka, St-Germain, Guava, Prosecco", note: "Fruity and elegant with botanical undertones.", price: "$22" },
      { name: "Indigo Roller", detail: "McQueen Ultraviolet Gin, Lychee, Lavender & Earl Grey", note: "Aromatic with floral complexity and stone fruit notes.", price: "$22" },
      { name: "Fremont Orchid", detail: "Ketel One, Chambord, Passionfruit, Vanilla", note: "Smooth and rich with tropical sweetness.", price: "$20" },
      { name: "Chamomile Crown", detail: "Crown Royal, Pineapple Water, Burnt Honey, Champagne Float", note: "Creamy and luxurious with warm honey notes.", price: "$22" },
      { name: "Bellagio Botanist", detail: "Bombay Sapphire, Campari, Passionfruit, Tonic", note: "Sophisticated aperitif with bitter-sweet balance.", price: "$21" },
      { name: "Arts District Mule", detail: "Tito's, Strawberry & Black Pepper, Fever-Tree Ginger Beer", note: "Spicy and refreshing with berry undertones.", price: "$19" },
    ],
  },
  {
    slug: "roots",
    title: "Vol 2 — The Roots",
    description:
      "Inspired by Nevada's high desert terroir — earthy heat, burnt honey, and locally distilled spirits. Spirit-forward builds with intentional depth and a warm, smoky edge.",
    items: [
      { name: "Stardust Shadow", detail: "Ilegal Mezcal, Gran Malo Tamarind, Mango, Habanero", note: "Complex and smoky with sweet and spicy layers.", price: "$22" },
      { name: "Whiskey Farmer", detail: "Frey Ranch Bourbon, Burnt Honey, Muddled Orange & Cherry", note: "Bold and warming with caramelized fruit notes.", price: "$28" },
      { name: "Main Street Manhattan", detail: "Frey Ranch Bottled-in-Bond Rye, Lo-Fi Sweet Vermouth, Clove Bitters", note: "Classic and complex with aromatic spice.", price: "$28" },
      { name: "Water Street Bloom", detail: "Las Vegas Distillery Nevada Vodka, Lychee, Jasmine Tea", note: "Refined and delicate with floral essence.", price: "$20" },
      { name: "The Rio", detail: "Don Fulano Blanco, Lo-Fi Gentian Amaro, Fresh Grapefruit, Rosemary", note: "Herbaceous and citrus-forward with dry finish.", price: "$22" },
      { name: "Mandalay Heat", detail: "Bumbu Rum, Myers's Dark, Guava, Jalapeño", note: "Tropical with a spicy kick and dark fruit depth." },
    ],
  },
  {
    slug: "mock-garden",
    title: "Vol 3 — The Mock Garden",
    description:
      "Zero-proof, full experience. House-pressed juices, botanical infusions, and ceremonial teas — crafted with the same care as our full bar program. Clean, complex, and completely satisfying.",
    items: [
      { name: "Flamingo Fizz", detail: "Fresh Lime, Agave, Mint-Hibiscus Syrup, Purrizza", note: "Vibrant and floral with bright citrus notes.", price: "$12" },
      { name: "Mojave Mule", detail: "Mango, Fresh Lemon, House Gum Syrup, Ginger Beer", note: "Tropical and spicy with refreshing ginger warmth.", price: "$14" },
      { name: "Lavender Haze", detail: "Fresh Lemon, Purrizza, Butterfly Pea Flower Tea Float", note: "Floral and aromatic with delicate complexity.", price: "$14" },
      { name: "The Mirage", detail: "Pineapple, Passionfruit, Fresh Lime, House Gum Syrup", note: "Exotic and creamy with tropical passion fruit.", price: "$12" },
      { name: "Desert Dove", detail: "Fresh Grapefruit, Fresh Lime, Burnt Honey — Tajín/Black Lava Salt Rim", note: "Citrus-driven with savory umami depth and honey richness.", price: "$14" },
      { name: "Sunset Vine", detail: "Fresh Lemon, Peach, Fresh Basil, Ginger Beer", note: "Stone fruit with herbaceous and spiced ginger notes." },
    ],
  },
];

export const spiritCategories: MenuCategory[] = [
  {
    slug: "vodka",
    title: "Vodka",
    items: [
      { name: "SKYY", detail: "House / Well", pour: "$10", bottle: "$165" },
      { name: "Tito's", detail: "Handmade", pour: "$12", bottle: "$175" },
      { name: "Absolut Citron", detail: "Citrus Vodka", pour: "$15", bottle: "$200" },
      { name: "Aspen Vodka", detail: "Aspen Distillers", pour: "$15", bottle: "$200" },
      { name: "Haku", detail: "Japanese Vodka", pour: "$15", bottle: "$200" },
      { name: "Las Vegas Distillery", detail: "Nevada Vodka", pour: "$15", bottle: "$200" },
      { name: "Ketel One", detail: "Original", pour: "$15", bottle: "$200" },
      { name: "Ketel One Espresso Martini", detail: "Ready to Drink", pour: "$15", bottle: "$200" },
      { name: "Cîroc", detail: "Original / Apple / Coconut / Mango / Passion / Peach / Pineapple / Pomegranate / Red Berry / Strawberry Lemonade", pour: "$17", bottle: "$225" },
      { name: "Grey Goose", detail: "Original", pour: "$20", bottle: "$300" },
      { name: "Grey Goose Essences", detail: "Watermelon & Basil", pour: "$20", bottle: "$300" },
    ],
  },
  {
    slug: "tequila-mezcal",
    title: "Tequila & Mezcal",
    items: [
      { name: "Sauza Hacienda Gold", detail: "House / Well", pour: "$10", bottle: "$165" },
      { name: "Teremana Blanco", pour: "$12", bottle: "$175" },
      { name: "Teremana Reposado", pour: "$15", bottle: "$200" },
      { name: "Teremana Añejo", pour: "$20", bottle: "$300" },
      { name: "Hornitos Cucumber Jalapeño", pour: "$14", bottle: "$175" },
      { name: "Hornitos Pineapple", pour: "$14", bottle: "$170" },
      { name: "Ilegal Mezcal", detail: "Joven", pour: "$14", bottle: "$200" },
      { name: "Rosaluna Mezcal", detail: "Joven", pour: "$16", bottle: "$225" },
      { name: "DeLeon Blanco", pour: "$15", bottle: "$200" },
      { name: "Don Fulano Blanco", pour: "$18", bottle: "$225" },
      { name: "Don Fulano Reposado", pour: "$20", bottle: "$275" },
      { name: "Don Fulano Añejo", pour: "$23", bottle: "$350" },
      { name: "Casamigos Blanco", pour: "$20", bottle: "$275" },
      { name: "Casamigos Reposado", pour: "$22", bottle: "$315" },
      { name: "Casamigos Añejo", pour: "$25", bottle: "$400" },
      { name: "Patrón Silver", pour: "$20", bottle: "$275" },
      { name: "Patrón Reposado", pour: "$22", bottle: "$315" },
      { name: "Patrón Añejo", pour: "$25", bottle: "$400" },
      { name: "Patrón Extra Añejo", pour: "$40", bottle: "$550" },
      { name: "Don Julio Blanco", pour: "$20", bottle: "$275" },
      { name: "Don Julio Reposado", pour: "$22", bottle: "$315" },
      { name: "Don Julio Añejo", pour: "$25", bottle: "$400" },
    ],
  },
  {
    slug: "gin",
    title: "Gin",
    items: [
      { name: "Tanqueray", detail: "London Dry — House / Well", pour: "$10", bottle: "$165" },
      { name: "Bombay Sapphire", detail: "Original", pour: "$15", bottle: "$200" },
      { name: "Roku Gin", detail: "Japanese Gin", pour: "$15", bottle: "$200" },
      { name: "McQueen and the Violet Fog", detail: "Original", pour: "$18", bottle: "$250" },
      { name: "McQueen UltraViolet Fog", detail: "Color-changing botanical gin", pour: "$18", bottle: "$250" },
      { name: "Hendrick's", detail: "Original", pour: "$18", bottle: "$250" },
      { name: "Empress 1908", detail: "Indigo Gin", pour: "$18", bottle: "$250" },
    ],
  },
  {
    slug: "rum",
    title: "Rum",
    items: [
      { name: "Bacardi Superior", detail: "House / Well", pour: "$10", bottle: "$165" },
      { name: "Malibu", detail: "Original Coconut", pour: "$12", bottle: "$175" },
      { name: "Captain Morgan", detail: "Original Spiced", pour: "$12", bottle: "$175" },
      { name: "Myers's", detail: "Dark Rum", pour: "$12", bottle: "$175" },
      { name: "Ron Del Barrilito", detail: "2 Stars", pour: "$15", bottle: "$200" },
      { name: "Bumbu", detail: "The Original", pour: "$18", bottle: "$250" },
    ],
  },
  {
    slug: "whiskey-bourbon",
    title: "Whiskey & Bourbon",
    items: [
      { name: "Benchmark Straight Bourbon", detail: "House / Well", pour: "$10", bottle: "$165" },
      { name: "Fireball Cinnamon Whisky", detail: "CinnaApple available", pour: "$12", bottle: "$175" },
      { name: "Paddy Irish Whiskey", pour: "$12", bottle: "$175" },
      { name: "Jack Daniel's Old No. 7", detail: "Black Label", pour: "$12", bottle: "$175" },
      { name: "Jameson Irish Whiskey", pour: "$15", bottle: "$200" },
      { name: "Crown Royal", detail: "Original / Apple / Peach / Vanilla / Chocolate", pour: "$15", bottle: "$200" },
      { name: "Wild Turkey 101", detail: "Bourbon", pour: "$15", bottle: "$200" },
      { name: "Maker's Mark", detail: "Bourbon", pour: "$18", bottle: "$250" },
      { name: "Sazerac Rye 6 Year", pour: "$18", bottle: "$250" },
      { name: "Bulleit Bourbon", pour: "$18", bottle: "$250" },
      { name: "Bulleit Rye", pour: "$18", bottle: "$250" },
      { name: "Jefferson's Bourbon Rye", pour: "$20", bottle: "$275" },
      { name: "Woodford Reserve", detail: "Bourbon", pour: "$20", bottle: "$275" },
      { name: "Frey Ranch Straight Bourbon", detail: "Nevada Distillery", pour: "$23", bottle: "$325" },
      { name: "Frey Ranch Straight Rye", detail: "Nevada Distillery", pour: "$23", bottle: "$325" },
      { name: "Uncle Nearest 1856", detail: "Premium Whiskey", pour: "$25", bottle: "$350" },
      { name: "SirDavis American Whisky", detail: "350ml / 750ml available", pour: "$30" },
    ],
  },
  {
    slug: "cognac-scotch",
    title: "Cognac & Scotch",
    items: [
      { name: "Courvoisier VS", detail: "Cognac", pour: "$17", bottle: "$250" },
      { name: "Hennessy VS", detail: "Cognac", pour: "$18", bottle: "$275" },
      { name: "Rémy Martin VSOP", detail: "Cognac", pour: "$23", bottle: "$325" },
      { name: "D'Ussé VSOP", detail: "Cognac", pour: "$25", bottle: "$350" },
      { name: "Rémy Martin 1738", detail: "Cognac", pour: "$30", bottle: "$415" },
      { name: "Glenmorangie X", detail: "Single Malt Scotch", pour: "$16", bottle: "$250" },
      { name: "Johnnie Walker Black Label", detail: "Blended Scotch", pour: "$17", bottle: "$250" },
      { name: "Johnnie Walker Black Cask", detail: "Blended Scotch", pour: "$23", bottle: "$325" },
      { name: "The Glenlivet 12 Yr", detail: "Single Malt Scotch", pour: "$25", bottle: "$350" },
      { name: "The Macallan Double Cask 12 Yr", detail: "Single Malt Scotch", pour: "$25", bottle: "$350" },
      { name: "The Macallan Double Cask 15 Yr", detail: "Single Malt Scotch", pour: "$55", bottle: "$800" },
    ],
  },
  {
    slug: "liqueurs",
    title: "Liqueurs & Cordials",
    items: [
      { name: "Kahlúa", detail: "Coffee Liqueur", pour: "$12" },
      { name: "Mr Black", detail: "Cold Brew Coffee Liqueur", pour: "$12" },
      { name: "Baileys Irish Cream", pour: "$12", bottle: "$175" },
      { name: "Boston Bourbon Cream", detail: "House Bourbon Cream", pour: "$12" },
      { name: "Cointreau", detail: "Orange Liqueur", pour: "$15" },
      { name: "Grand Marnier", detail: "Orange Liqueur", pour: "$15", bottle: "$200" },
      { name: "Chambord", detail: "Black Raspberry Liqueur", pour: "$15" },
      { name: "Chinola", detail: "Passion Fruit Liqueur", pour: "$12" },
      { name: "Kanade White Peach", detail: "Japanese Liqueur", pour: "$15" },
      { name: "Kanade Yuzu", detail: "Japanese Liqueur", pour: "$15" },
      { name: "St-Germain", detail: "Elderflower Liqueur", pour: "$15" },
      { name: "Frangelico", detail: "Hazelnut Liqueur", pour: "$12" },
      { name: "Disaronno", detail: "Amaretto", pour: "$15", bottle: "$200" },
      { name: "Midori", detail: "Melon Liqueur", pour: "$10" },
      { name: "DeKuyper Blue Curaçao", pour: "$10" },
      { name: "DeKuyper Peach Schnapps", pour: "$10" },
      { name: "DeKuyper Watermelon Schnapps", pour: "$10" },
      { name: "DeKuyper Sour Apple Schnapps", pour: "$10" },
      { name: "Crème de Cacao Dark", pour: "$10" },
      { name: "Crème de Cacao White", pour: "$10" },
      { name: "Aperol", detail: "Aperitivo", pour: "$10", bottle: "$165" },
      { name: "Campari", detail: "Aperitivo", pour: "$12", bottle: "$175" },
      { name: "Lo-Fi Gentian Amaro", pour: "$10" },
    ],
  },
];

export const wineCategories: MenuCategory[] = [
  {
    slug: "red",
    title: "Red Wine",
    description: "Wine selection rotates seasonally. Ask your server for current availability.",
    items: [
      { name: "House Merlot", detail: "Line 39", glass: "$10", bottle: "$40" },
      { name: "Drop of Sunshine", detail: "Red Blend", glass: "$15", bottle: "$60" },
      { name: "J Vineyard", detail: "Pinot Noir", glass: "$18", bottle: "$75" },
      { name: "Piattelli Vineyards", detail: "Reserve Malbec", glass: "$20", bottle: "$80" },
      { name: "Cambria — Julia's Vineyard", detail: "Pinot Noir", glass: "$22", bottle: "$85" },
      { name: "Earthquake", detail: "Cabernet Sauvignon", glass: "$22", bottle: "$85" },
      { name: "The Prisoner", detail: "Red Blend", glass: "$25", bottle: "$100" },
      { name: "Raymond Vineyards", detail: "Reserve Merlot", glass: "$37", bottle: "$150" },
      { name: "Justin Vineyards — Isosceles", detail: "Cabernet Blend", glass: "$40", bottle: "$160" },
    ],
  },
  {
    slug: "white-rose",
    title: "White Wine & Rosé",
    description: "Wine selection rotates seasonally. Ask your server for current availability.",
    items: [
      { name: "Line 39", detail: "Sauvignon Blanc", glass: "$10", bottle: "$40" },
      { name: "Kendall-Jackson Vintner's Reserve", detail: "Chardonnay — House White", glass: "$10", bottle: "$40" },
      { name: "Kendall-Jackson Vintner's Reserve", detail: "Riesling", glass: "$12", bottle: "$48" },
      { name: "Lunardi", detail: "Pinot Grigio", glass: "$14", bottle: "$56" },
      { name: "Ruffino", detail: "Moscato D'Asti", glass: "$14", bottle: "$56" },
      { name: "Sun Goddess", detail: "Pinot Grigio", glass: "$16", bottle: "$64" },
      { name: "Cambria Vineyard", detail: "Chardonnay", glass: "$22", bottle: "$85" },
      { name: "Kirchberg de Barr", detail: "Riesling", glass: "$25", bottle: "$100" },
      { name: "Rombauer", detail: "Chardonnay", glass: "$30", bottle: "$120" },
      { name: "Day Owl", detail: "Rosé — House Rosé", glass: "$14", bottle: "$56" },
    ],
  },
];

export const bubblesCategory: MenuCategory = {
  slug: "bubbles",
  title: "Champagne & Bubbles",
  description: "Bottle service includes glassware, ice bucket, and table presentation.",
  items: [
    { name: "Wycliff Brut", detail: "House Champagne / Mimosa Base", glass: "$10", bottle: "$40" },
    { name: "Wycliff Brut Rosé", detail: "House Champagne Rosé", glass: "$10", bottle: "$40" },
    { name: "Benvolio", detail: "Prosecco", glass: "$12", bottle: "$48" },
    { name: "Caposaldo", detail: "Prosecco", glass: "$14", bottle: "$56" },
    { name: "Caposaldo", detail: "Peach Moscato", glass: "$14", bottle: "$56" },
    { name: "Risata", detail: "Moscato d'Asti", glass: "$14", bottle: "$56" },
    { name: "Risata", detail: "Moscato d'Asti Red", glass: "$14", bottle: "$56" },
    { name: "Moët & Chandon Brut Impérial", detail: "VIP Bottle Service", bottle: "$250" },
    { name: "Moët & Chandon Brut Rosé", detail: "VIP Bottle Service", bottle: "$325" },
    { name: "Veuve Clicquot Yellow Label", detail: "VIP Bottle Service", bottle: "$300" },
  ],
};

export const beerCategory: MenuCategory = {
  slug: "beer",
  title: "Beer",
  items: [
    { name: "805", detail: "Firestone Walker", price: "$8", happyHour: "$7" },
    { name: "Angry Orchard", detail: "Crisp Apple Hard Cider", price: "$8", happyHour: "$7" },
    { name: "Ballast Point Sculpin IPA", detail: "Craft IPA", price: "$8", happyHour: "$7" },
    { name: "Blue Moon", detail: "Belgian White Ale", price: "$8", happyHour: "$7" },
    { name: "Corona Extra", detail: "Import — Mexico", price: "$8", happyHour: "$7" },
    { name: "Dos Equis (XX)", detail: "Import — Mexico", price: "$8", happyHour: "$7" },
    { name: "Guinness Draught", detail: "Import — Ireland", price: "$8", happyHour: "$7" },
    { name: "Heineken", detail: "Import — Netherlands", price: "$8", happyHour: "$7" },
    { name: "Heineken 0.0", detail: "Non-Alcoholic", price: "$8", happyHour: "$7" },
    { name: "Modelo Especial", detail: "Import — Mexico", price: "$8", happyHour: "$7" },
    { name: "Modelo Negra", detail: "Import — Mexico", price: "$8", happyHour: "$7" },
    { name: "Red Stripe", detail: "Import — Jamaica", price: "$8", happyHour: "$7" },
    { name: "Stella Artois", detail: "Import — Belgium", price: "$8", happyHour: "$7" },
    { name: "Bucket of Beer", detail: "Mix & Match — any 6 bottles", price: "$40" },
  ],
};

export const hookahSessionAndUpgrades = {
  session: [
    { name: "Weekday Session", detail: "Mon – Thu", price: "$32" },
    { name: "Weekend Session", detail: "Fri – Sun", price: "$58" },
  ] as MenuItem[],
  bowlRefills: [
    { name: "Weekday Refill", detail: "Mon – Thu", price: "$15" },
    { name: "Weekend Refill", detail: "Fri & Sat only", price: "$25" },
  ] as MenuItem[],
  upgrades: [
    { name: "Premium Upgrade", detail: "Premium German hookahs", price: "+$15" },
    { name: "Gold LED Upgrade", detail: "Premium German hookahs with LED lighting", price: "+$30" },
  ] as MenuItem[],
  premiumAddOns: [
    { name: "Hookalit Pro", detail: "Personal e-hookah pen — Blackcurrant Ice / Fcuking Fab / Sweet Passion Fruit / Two Apple", price: "$50" },
    { name: "3D Tips", detail: "Hello Kitty / Popeye / Bart", price: "$18" },
    { name: "Ice Tip", detail: "Chill your session", price: "$10" },
    { name: "Disposable Hose", detail: "Single-use hygiene option", price: "$7" },
  ] as MenuItem[],
};

export const hookahSignatureBowls: MenuItem[] = [
  { name: "Weekend Sunset", detail: "Watermelon, Guava, Mint" },
  { name: "Tropic Breeze", detail: "Orange, Peach Lit, Mint" },
  { name: "Mari Bowl", detail: "Blueberry Lit, Peach Lit, Kiwi" },
  { name: "Big Mo", detail: "White Gummy, Peach Lit, Lime Lit" },
  { name: "Nelly's Cookies", detail: "Cookies & Crème, Mint" },
  { name: "Strawberry Lemonade", detail: "Strawberry, Lime Lit, White Gummy" },
  { name: "Cork & Thorn Special", detail: "Peach Lit, Red Lips, White Gummy" },
];

export type FlavorLibraryBrand = { brand: string; flavors: string[] };

export const hookahFlavorLibrary: FlavorLibraryBrand[] = [
  {
    brand: "Al Fakher Flavors",
    flavors: [
      "Orange", "Blueberry", "Peach", "Mint", "Watermelon", "Mango",
      "Pineapple", "Strawberry", "Kiwi", "Vanilla", "Guava", "Magic Love",
      "Coconut", "Cherry", "Lemon", "Grapefruit", "Cinnamon", "Hubbly",
      "Harvest Moon",
    ],
  },
  {
    brand: "Eternal Flavors",
    flavors: [
      "Blue Lit", "Peach Lit", "Lime Lit", "Lemon Lit", "Red Lips",
      "Orange Lit", "Houdini Secret", "Milk & Cookies",
    ],
  },
  {
    brand: "Mazaya Flavors",
    flavors: [
      "Watermelon w/Mint", "Orange w/Mint", "Love Candy Drop", "Raspberry",
      "Blueberry", "Mango", "Peach", "Lemon",
    ],
  },
  {
    brand: "Fumari Flavors",
    flavors: ["White Gummy", "Red Gummy", "Pink Gummy"],
  },
];

export const cigarsCategory: MenuCategory = {
  slug: "cigars",
  title: "Cigars",
  description: "Cut and lit table-side. Ask your server about private reserve selections.",
  items: [
    { name: "Cohiba", detail: "Full Smoke", price: "$27" },
    { name: "Flathead", detail: "Full Smoke", price: "$21" },
    { name: "Punch", detail: "Medium Smoke", price: "$19" },
    { name: "Perdomo", detail: "Medium Smoke", price: "$16" },
    { name: "Crazy Alice", detail: "Original", price: "$14" },
    { name: "Diesel Rabbit Hole", detail: "Medium / Full Smoke", price: "$10" },
    { name: "Tatiana", detail: "Chocolate / Groovy Blue / Honey", price: "$10" },
    { name: "Butane Refills", detail: "Lighter fuel", price: "$2" },
  ],
};
