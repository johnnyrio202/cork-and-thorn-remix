export const siteInfo = {
  name: "Cork and Thorn",
  tagline: "The way Nightlife should be",
  description:
    "Las Vegas' premier live events lounge. Premium hookah, craft cocktails, and nightly R&B and hip-hop.",
  about:
    "Forget the manufactured neon of the Boulevard. Cork & Thorn is where the city actually comes to play. We are an unapologetic, high-energy live music and hookah lounge planted right in the center of Las Vegas Arts District. If you're looking for real culture, premium service, and a room full of people who actually know how to have a good time, you've found it.",
  address: "70 West Imperial Avenue",
  cityStateZip: "Las Vegas, NV 89102",
  phone: "(725) 208-9328",
  hours: "Wed–Sun · 8PM – Late",
  hoursNote: "Fri & Sat reservations after 10PM",
  ageGate: "Drink responsibly. Must be 21+ with valid ID.",
  socials: {
    instagram: "https://www.instagram.com/corkandthorn",
    facebook: "https://www.facebook.com/1294533044008267",
    yelp: "https://www.yelp.com/biz/cork-and-thorn-las-vegas-2",
  },
};

export const weeklyLineup = [
  {
    day: "Sunday",
    title: "For the Love of R&B",
    performer: "Kuntry 601",
    time: "5:00 PM",
  },
];

export const happyHour = {
  label: "Happy Hour",
  time: "5:00 PM – 8:00 PM",
  description: "Daily specials on cocktails & hookah",
};

export const reservationTiers = [
  {
    slug: "standard",
    name: "Standard VIP",
    guests: "2–4 guests",
    deposit: "$150 deposit",
    minimum: "$300 minimum spend",
    perks: ["Reserved booth", "Dedicated server", "Priority entry"],
  },
  {
    slug: "premium",
    name: "Premium VIP",
    guests: "4–8 guests",
    deposit: "$350 deposit",
    minimum: "$700 minimum spend",
    perks: ["Gold or Center booth", "Bottle service", "Dedicated host", "Skip the line"],
  },
  {
    slug: "ultra",
    name: "Ultra VIP",
    guests: "8–20 guests",
    deposit: "$600 deposit",
    minimum: "$1500 minimum spend",
    perks: ["Stage / Blue / Back / Teremana booth", "Two-bottle minimum", "Personal mixologist", "Reserved hookah", "VIP entrance"],
  },
];

export const bottleAddOns = [
  { name: "Tequila — Añejo", price: "$425" },
  { name: "Champagne — Brut", price: "$295" },
  { name: "Cognac — VSOP", price: "$380" },
  { name: "Vodka — Premium", price: "$350" },
  { name: "Whiskey — Single Barrel", price: "$450" },
  { name: "Rosé Magnum", price: "$320" },
];

export type FloorTable = {
  name: string;
  capacity: string;
  zone: string;
};

export const floorPlanZones: { zone: string; tables: FloorTable[] }[] = [
  {
    zone: "Stage",
    tables: [
      { name: "Stage VIP", capacity: "4–12 ppl", zone: "Stage" },
      { name: "DJ VIP", capacity: "2–4 ppl", zone: "Stage" },
    ],
  },
  {
    zone: "Center",
    tables: [
      { name: "Center 1", capacity: "4–8 ppl", zone: "Center" },
      { name: "B Center 1", capacity: "2–4 ppl", zone: "Center" },
      { name: "Center 2", capacity: "4–8 ppl", zone: "Center" },
      { name: "B Center 2", capacity: "2–4 ppl", zone: "Center" },
    ],
  },
  {
    zone: "Gold Row",
    tables: [
      { name: "Gold 1", capacity: "4–8 ppl", zone: "Gold Row" },
      { name: "Gold 2", capacity: "4–8 ppl", zone: "Gold Row" },
      { name: "Gold 3", capacity: "4–8 ppl", zone: "Gold Row" },
    ],
  },
  {
    zone: "Circle",
    tables: [
      { name: "Circle 1", capacity: "2–4 ppl", zone: "Circle" },
      { name: "Circle 2", capacity: "2–4 ppl", zone: "Circle" },
      { name: "Circle 4", capacity: "2–4 ppl", zone: "Circle" },
    ],
  },
  {
    zone: "Flower",
    tables: [
      { name: "Flower Couch", capacity: "4–8 ppl", zone: "Flower" },
      { name: "Flower VIP", capacity: "4–12 ppl", zone: "Flower" },
      { name: "Randi VIP", capacity: "2–4 ppl", zone: "Flower" },
      { name: "Brian VIP", capacity: "2–4 ppl", zone: "Flower" },
    ],
  },
  {
    zone: "Side & Back",
    tables: [
      { name: "Side VIP", capacity: "4–8 ppl", zone: "Side & Back" },
      { name: "Back VIP", capacity: "8–20 ppl", zone: "Side & Back" },
      { name: "Teremana VIP", capacity: "8–12 ppl", zone: "Side & Back" },
    ],
  },
  {
    zone: "Blue & Bellaire",
    tables: [
      { name: "Blue 1", capacity: "8–12 ppl", zone: "Blue & Bellaire" },
      { name: "Blue 2", capacity: "8–20 ppl", zone: "Blue & Bellaire" },
      { name: "Bellaire VIP", capacity: "2–6 ppl", zone: "Blue & Bellaire" },
    ],
  },
];

export const shopProducts = [
  {
    name: "Neon Logo Tee",
    description: "Premium heavyweight cotton tee with neon-pink embroidered logo.",
    price: "$38",
  },
];

export const privatePartiesIncluded = [
  "Dedicated event coordinator from booking to last call",
  "Custom hookah, cocktail, and bottle service packages",
  "Live DJ or curated R&B / hip-hop playlist",
  "Reserved VIP sections and full venue buyouts",
  "Bespoke food and small-bites menus",
  "Personalized décor, signage, and lighting",
];
