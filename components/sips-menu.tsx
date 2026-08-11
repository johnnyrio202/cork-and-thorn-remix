'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Wine,
  Sparkles,
  Leaf,
  GlassWater,
  Droplets,
  Flame,
  Wheat,
  Coffee,
  Grape,
  Beer,
  Waves,
} from 'lucide-react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type Pour = { label: string; price: number; bottlePrice?: number }
type Item = { name: string; sub?: string; pours: Pour[] }
type Section = { heading: string; items: Item[] }
type Category = {
  id: string
  label: string
  icon: React.ElementType
  sections: Section[]
  note?: string
}

// ---------------------------------------------------------------------------
// Menu Data — OTD Menu prices only, no POS prices
// ---------------------------------------------------------------------------
const cocktailsData: Category = {
  id: 'cocktails',
  label: 'Cocktails',
  icon: Sparkles,
  sections: [
    {
      heading: 'Vol. 1 — The Blooms',
      items: [
        { name: 'Desert Rose', sub: 'Teremana Blanco, Hibiscus, Fresh Lime/Lemon', pours: [{ label: 'Cocktail', price: 20 }] },
        { name: 'Golden Nugget', sub: 'Watermelon Basil Vodka, St-Germain, Guava, Prosecco', pours: [{ label: 'Cocktail', price: 22 }] },
        { name: 'Indigo Roller', sub: 'McQueen Ultraviolet Gin, Lychee, Lavender & Earl Grey', pours: [{ label: 'Cocktail', price: 22 }] },
        { name: 'Fremont Orchid', sub: 'Ketel One, Chambord, Passionfruit, Vanilla', pours: [{ label: 'Cocktail', price: 20 }] },
        { name: 'Chamomile Crown', sub: 'Crown Royal, Pineapple Water, Burnt Honey, Champagne Float', pours: [{ label: 'Cocktail', price: 22 }] },
        { name: 'Bellagio Botanist', sub: 'Bombay Sapphire, Campari, Passionfruit, Tonic', pours: [{ label: 'Cocktail', price: 21 }] },
        { name: 'Arts District Mule', sub: "Tito's, Strawberry & Black Pepper, Fever-Tree Ginger Beer", pours: [{ label: 'Cocktail', price: 19 }] },
      ],
    },
    {
      heading: 'Vol. 2 — The Roots',
      items: [
        { name: 'Stardust Shadow', sub: 'Ilegal Mezcal, Gran Malo Tamarind, Mango, Habanero', pours: [{ label: 'Cocktail', price: 22 }] },
        { name: 'Whiskey Farmer', sub: "Frey Ranch Bourbon, Burnt Honey, Muddled Orange & Cherry", pours: [{ label: 'Cocktail', price: 28 }] },
        { name: 'Main Street Manhattan', sub: 'Frey Ranch Bottled-in-Bond Rye, Lo-Fi Sweet Vermouth, Clove Bitters', pours: [{ label: 'Cocktail', price: 28 }] },
        { name: 'Water Street Bloom', sub: 'Las Vegas Distillery Nevada Vodka, Lychee, Jasmine Tea', pours: [{ label: 'Cocktail', price: 20 }] },
        { name: 'The Rio', sub: 'Don Fulano Blanco, Lo-Fi Gentian Amaro, Fresh Grapefruit, Rosemary', pours: [{ label: 'Cocktail', price: 22 }] },
        { name: 'Mandalay Heat', sub: "Bumbu Rum, Myers's Dark, Guava, Jalapeño", pours: [{ label: 'Cocktail', price: 21 }] },
        { name: 'Tropicana', sub: 'Captain Morgan Spiced, Peach, Black Pepper, Ginger Beer', pours: [{ label: 'Cocktail', price: 19 }] },
      ],
    },
    {
      heading: 'Vol. 3 — The Mock Garden',
      items: [
        { name: 'Flamingo Fizz', sub: 'Fresh Lime, Agave, Mint-Hibiscus Syrup, Purrizza', pours: [{ label: 'Zero-Proof', price: 12 }] },
        { name: 'Mojave Mule', sub: 'Mango, Fresh Lemon, House Gum Syrup, Ginger Beer', pours: [{ label: 'Zero-Proof', price: 14 }] },
        { name: 'Lavender Haze', sub: 'Fresh Lemon, Purrizza, Butterfly Pea Flower Tea Float', pours: [{ label: 'Zero-Proof', price: 14 }] },
        { name: 'The Mirage', sub: 'Pineapple, Passionfruit, Fresh Lime, House Gum Syrup', pours: [{ label: 'Zero-Proof', price: 12 }] },
        { name: 'Desert Dove', sub: 'Fresh Grapefruit, Fresh Lime, Burnt Honey — Tajín/Black Lava Salt Rim', pours: [{ label: 'Zero-Proof', price: 14 }] },
        { name: 'Sunset Vine', sub: 'Fresh Lemon, Peach, Fresh Basil, Ginger Beer', pours: [{ label: 'Zero-Proof', price: 14 }] },
        { name: 'Crimson Petal', sub: 'Fresh Lemon, Strawberry, Fever-Tree Pink Grapefruit Soda', pours: [{ label: 'Zero-Proof', price: 12 }] },
      ],
    },
  ],
}

const vodkaData: Category = {
  id: 'vodka',
  label: 'Vodka',
  icon: Droplets,
  sections: [
    {
      heading: 'Vodka',
      items: [
        { name: 'SKYY', sub: 'House / Well', pours: [{ label: 'Pour', price: 10, bottlePrice: 165 }] },
        { name: "Tito's", sub: 'Handmade', pours: [{ label: 'Pour', price: 12, bottlePrice: 175 }] },
        { name: 'Absolut Citron', pours: [{ label: 'Pour', price: 15, bottlePrice: 200 }] },
        { name: 'Aspen Distillers', sub: 'Aspen Vodka', pours: [{ label: 'Pour', price: 15, bottlePrice: 200 }] },
        { name: 'Haku', sub: 'Japanese Vodka', pours: [{ label: 'Pour', price: 15, bottlePrice: 200 }] },
        { name: 'Las Vegas Distillery', sub: 'Nevada Vodka', pours: [{ label: 'Pour', price: 15, bottlePrice: 200 }] },
        { name: 'Ketel One', sub: 'Original / Espresso Martini RTD', pours: [{ label: 'Pour', price: 15, bottlePrice: 200 }] },
        { name: 'Cîroc', sub: 'Original, Apple, Coconut, Mango, Passion, Peach, Pineapple, Pomegranate, Red Berry, Strawberry Lemonade', pours: [{ label: 'Pour', price: 17, bottlePrice: 225 }] },
        { name: 'Grey Goose', sub: 'Original / Watermelon & Basil', pours: [{ label: 'Pour', price: 20, bottlePrice: 300 }] },
      ],
    },
  ],
}

const tequilaData: Category = {
  id: 'tequila',
  label: 'Tequila & Mezcal',
  icon: Flame,
  sections: [
    {
      heading: 'Tequila & Mezcal',
      items: [
        { name: 'Sauza Hacienda', sub: 'Gold — House / Well', pours: [{ label: 'Pour', price: 10, bottlePrice: 165 }] },
        { name: 'Teremana Blanco', pours: [{ label: 'Pour', price: 12, bottlePrice: 175 }] },
        { name: 'Teremana Reposado', pours: [{ label: 'Pour', price: 15, bottlePrice: 200 }] },
        { name: 'Teremana Añejo', pours: [{ label: 'Pour', price: 20, bottlePrice: 300 }] },
        { name: 'Hornitos', sub: 'Cucumber Jalapeño', pours: [{ label: 'Pour', price: 14, bottlePrice: 175 }] },
        { name: 'Hornitos', sub: 'Pineapple', pours: [{ label: 'Pour', price: 14, bottlePrice: 170 }] },
        { name: 'Ilegal Mezcal', sub: 'Joven', pours: [{ label: 'Pour', price: 14, bottlePrice: 200 }] },
        { name: 'Rosaluna Mezcal', sub: 'Joven', pours: [{ label: 'Pour', price: 16, bottlePrice: 225 }] },
        { name: 'DeLeon Blanco', pours: [{ label: 'Pour', price: 15, bottlePrice: 200 }] },
        { name: 'Don Fulano Blanco', pours: [{ label: 'Pour', price: 18, bottlePrice: 225 }] },
        { name: 'Don Fulano Reposado', pours: [{ label: 'Pour', price: 20, bottlePrice: 275 }] },
        { name: 'Don Fulano Añejo', pours: [{ label: 'Pour', price: 23, bottlePrice: 350 }] },
        { name: 'Casamigos Blanco', pours: [{ label: 'Pour', price: 20, bottlePrice: 275 }] },
        { name: 'Casamigos Reposado', pours: [{ label: 'Pour', price: 22, bottlePrice: 315 }] },
        { name: 'Casamigos Añejo', pours: [{ label: 'Pour', price: 25, bottlePrice: 400 }] },
        { name: 'Patrón Silver', pours: [{ label: 'Pour', price: 20, bottlePrice: 275 }] },
        { name: 'Patrón Reposado', pours: [{ label: 'Pour', price: 22, bottlePrice: 315 }] },
        { name: 'Patrón Añejo', pours: [{ label: 'Pour', price: 25, bottlePrice: 400 }] },
        { name: 'Patrón Extra Añejo', pours: [{ label: 'Pour', price: 40, bottlePrice: 550 }] },
        { name: 'Don Julio Blanco', pours: [{ label: 'Pour', price: 20, bottlePrice: 275 }] },
        { name: 'Don Julio Reposado', pours: [{ label: 'Pour', price: 22, bottlePrice: 315 }] },
        { name: 'Don Julio Añejo', pours: [{ label: 'Pour', price: 25, bottlePrice: 400 }] },
        { name: 'Don Julio Alma Miel', pours: [{ label: 'Pour', price: 40, bottlePrice: 550 }] },
        { name: 'Don Julio 1942', pours: [{ label: 'Pour', price: 55, bottlePrice: 800 }] },
        { name: 'Clase Azul Reposado', pours: [{ label: 'Pour', price: 55, bottlePrice: 800 }] },
        { name: 'Clase Azul Gold', pours: [{ label: 'Pour', price: 85, bottlePrice: 1200 }] },
        { name: 'Clase Azul Añejo', pours: [{ label: 'Pour', price: 55, bottlePrice: 2000 }] },
      ],
    },
  ],
}

const rumData: Category = {
  id: 'rum',
  label: 'Rum',
  icon: Waves,
  sections: [
    {
      heading: 'Rum',
      items: [
        { name: 'Bacardi Superior', sub: 'House / Well', pours: [{ label: 'Pour', price: 10, bottlePrice: 165 }] },
        { name: 'Malibu', sub: 'Original Coconut', pours: [{ label: 'Pour', price: 12, bottlePrice: 175 }] },
        { name: 'Captain Morgan', sub: 'Original Spiced', pours: [{ label: 'Pour', price: 12, bottlePrice: 175 }] },
        { name: "Myers's", sub: 'Dark Rum', pours: [{ label: 'Pour', price: 12, bottlePrice: 175 }] },
        { name: 'Ron Del Barrilito', sub: '2 Stars', pours: [{ label: 'Pour', price: 15, bottlePrice: 200 }] },
        { name: 'Bumbu', sub: 'The Original', pours: [{ label: 'Pour', price: 18, bottlePrice: 250 }] },
      ],
    },
  ],
}

const whiskeyData: Category = {
  id: 'whiskey',
  label: 'Whiskey & Bourbon',
  icon: Wheat,
  sections: [
    {
      heading: 'Bourbon, Whiskey & Rye',
      items: [
        { name: 'Benchmark Straight Bourbon', sub: 'House / Well', pours: [{ label: 'Pour', price: 10, bottlePrice: 165 }] },
        { name: 'Fireball', sub: 'Cinnamon / CinnaApple Whisky', pours: [{ label: 'Pour', price: 12, bottlePrice: 175 }] },
        { name: 'Paddy Irish Whiskey', pours: [{ label: 'Pour', price: 12, bottlePrice: 175 }] },
        { name: "Jack Daniel's", sub: 'Old No. 7 Black Label', pours: [{ label: 'Pour', price: 12, bottlePrice: 175 }] },
        { name: 'Jameson Irish Whiskey', pours: [{ label: 'Pour', price: 15, bottlePrice: 200 }] },
        { name: 'Crown Royal', sub: 'Original, Apple, Peach, Vanilla & Chocolate', pours: [{ label: 'Pour', price: 15, bottlePrice: 200 }] },
        { name: 'Wild Turkey 101', sub: 'Bourbon', pours: [{ label: 'Pour', price: 15, bottlePrice: 200 }] },
        { name: "Maker's Mark", sub: 'Bourbon', pours: [{ label: 'Pour', price: 18, bottlePrice: 250 }] },
        { name: 'Sazerac Rye 6 Year', pours: [{ label: 'Pour', price: 18, bottlePrice: 250 }] },
        { name: 'Bulleit Bourbon', pours: [{ label: 'Pour', price: 18, bottlePrice: 250 }] },
        { name: 'Bulleit Rye', pours: [{ label: 'Pour', price: 18, bottlePrice: 250 }] },
        { name: "Jefferson's Bourbon Rye", pours: [{ label: 'Pour', price: 20, bottlePrice: 275 }] },
        { name: 'Woodford Reserve', sub: 'Bourbon', pours: [{ label: 'Pour', price: 20, bottlePrice: 275 }] },
        { name: 'Frey Ranch', sub: 'Straight Bourbon', pours: [{ label: 'Pour', price: 23, bottlePrice: 325 }] },
        { name: 'Frey Ranch', sub: 'Straight Rye', pours: [{ label: 'Pour', price: 23, bottlePrice: 325 }] },
        { name: 'Uncle Nearest 1856', sub: 'Premium Whiskey', pours: [{ label: 'Pour', price: 25, bottlePrice: 350 }] },
        { name: 'SirDavis American Whisky', pours: [{ label: 'Pour', price: 30, bottlePrice: 415 }] },
        { name: 'Suntory Hibiki Harmony', pours: [{ label: 'Pour', price: 30, bottlePrice: 415 }] },
      ],
    },
  ],
}

const cognacData: Category = {
  id: 'cognac',
  label: 'Cognac & Scotch',
  icon: Coffee,
  sections: [
    {
      heading: 'Cognac & Scotch',
      items: [
        { name: 'Glenmorangie X', pours: [{ label: 'Pour', price: 16, bottlePrice: 250 }] },
        { name: 'Courvoisier VS', pours: [{ label: 'Pour', price: 17, bottlePrice: 250 }] },
        { name: 'Johnnie Walker Black Label', pours: [{ label: 'Pour', price: 17, bottlePrice: 250 }] },
        { name: 'Johnnie Walker Black Cask', pours: [{ label: 'Pour', price: 23, bottlePrice: 325 }] },
        { name: 'Hennessy VS', pours: [{ label: 'Pour', price: 18, bottlePrice: 275 }] },
        { name: 'Rémy Martin VSOP', pours: [{ label: 'Pour', price: 23, bottlePrice: 325 }] },
        { name: 'Rémy Martin 1738', pours: [{ label: 'Pour', price: 30, bottlePrice: 415 }] },
        { name: "D'Ussé VSOP", pours: [{ label: 'Pour', price: 25, bottlePrice: 350 }] },
        { name: 'The Glenlivet 12 Yr', pours: [{ label: 'Pour', price: 25, bottlePrice: 350 }] },
        { name: 'The Macallan Double Cask 12 Yr', pours: [{ label: 'Pour', price: 25, bottlePrice: 350 }] },
        { name: 'The Macallan Double Cask 15 Yr', pours: [{ label: 'Pour', price: 55, bottlePrice: 800 }] },
      ],
    },
  ],
}

const ginData: Category = {
  id: 'gin',
  label: 'Gin',
  icon: Leaf,
  sections: [
    {
      heading: 'Gin',
      items: [
        { name: 'Tanqueray', sub: 'London Dry', pours: [{ label: 'Pour', price: 10, bottlePrice: 165 }] },
        { name: 'Bombay Sapphire', sub: 'Original', pours: [{ label: 'Pour', price: 15, bottlePrice: 200 }] },
        { name: 'Roku Gin', sub: 'Japanese', pours: [{ label: 'Pour', price: 15, bottlePrice: 200 }] },
        { name: 'McQueen & the Violet Fog', sub: 'Original', pours: [{ label: 'Pour', price: 18, bottlePrice: 250 }] },
        { name: 'McQueen UltraViolet Fog', pours: [{ label: 'Pour', price: 18, bottlePrice: 250 }] },
        { name: "Hendrick's", sub: 'Original', pours: [{ label: 'Pour', price: 18, bottlePrice: 250 }] },
        { name: 'Empress 1908', sub: 'Indigo Gin', pours: [{ label: 'Pour', price: 18, bottlePrice: 250 }] },
      ],
    },
  ],
}

const liqueursData: Category = {
  id: 'liqueurs',
  label: 'Liqueurs',
  icon: GlassWater,
  sections: [
    {
      heading: 'Coffees & Cream',
      items: [
        { name: 'Kahlúa', sub: 'Coffee Liqueur', pours: [{ label: 'Pour', price: 12 }] },
        { name: 'Mr Black', sub: 'Cold Brew Coffee Liqueur', pours: [{ label: 'Pour', price: 12 }] },
        { name: 'Baileys', sub: 'Irish Cream', pours: [{ label: 'Pour', price: 12, bottlePrice: 175 }] },
        { name: 'Boston Bourbon Cream', sub: 'House Cream', pours: [{ label: 'Pour', price: 12 }] },
      ],
    },
    {
      heading: 'Orange Liqueurs',
      items: [
        { name: 'Cointreau', sub: 'Orange Liqueur', pours: [{ label: 'Pour', price: 15 }] },
        { name: 'Grand Marnier', sub: 'Orange Liqueur', pours: [{ label: 'Pour', price: 15, bottlePrice: 200 }] },
      ],
    },
    {
      heading: 'Fruit & Floral',
      items: [
        { name: 'Chambord', sub: 'Black Raspberry', pours: [{ label: 'Pour', price: 15 }] },
        { name: 'Chinola', sub: 'Passion Fruit', pours: [{ label: 'Pour', price: 12 }] },
        { name: 'Kanade', sub: 'White Peach', pours: [{ label: 'Pour', price: 15 }] },
        { name: 'Kanade', sub: 'Yuzu', pours: [{ label: 'Pour', price: 15 }] },
        { name: 'St-Germain', sub: 'Elderflower', pours: [{ label: 'Pour', price: 15 }] },
      ],
    },
    {
      heading: 'Nut & Seed',
      items: [
        { name: 'Frangelico', sub: 'Hazelnut', pours: [{ label: 'Pour', price: 12 }] },
        { name: 'Disaronno', sub: 'Amaretto', pours: [{ label: 'Pour', price: 15, bottlePrice: 200 }] },
      ],
    },
    {
      heading: 'Aperitif & Amaro',
      items: [
        { name: 'Aperol', sub: 'Aperitivo', pours: [{ label: 'Pour', price: 10, bottlePrice: 165 }] },
        { name: 'Campari', sub: 'Aperitivo', pours: [{ label: 'Pour', price: 12, bottlePrice: 175 }] },
        { name: 'Lo-Fi Gentian Amaro', pours: [{ label: 'Pour', price: 10 }] },
        { name: 'Lo-Fi Sweet Vermouth', pours: [{ label: 'Pour', price: 10 }] },
        { name: 'Lo-Fi Dry Vermouth', pours: [{ label: 'Pour', price: 10 }] },
      ],
    },
    {
      heading: 'Schnapps & Modifiers',
      items: [
        { name: 'Midori', sub: 'Melon', pours: [{ label: 'Pour', price: 10 }] },
        { name: 'Blue Curaçao', sub: 'DeKuyper', pours: [{ label: 'Pour', price: 10 }] },
        { name: 'Peach Schnapps', sub: 'DeKuyper', pours: [{ label: 'Pour', price: 10 }] },
        { name: 'Watermelon Schnapps', sub: 'DeKuyper', pours: [{ label: 'Pour', price: 10 }] },
        { name: 'Sour Apple Schnapps', sub: 'DeKuyper', pours: [{ label: 'Pour', price: 10 }] },
        { name: 'Crème de Cacao Dark', pours: [{ label: 'Pour', price: 10 }] },
        { name: 'Crème de Cacao White', pours: [{ label: 'Pour', price: 10 }] },
      ],
    },
    {
      heading: 'Herbal & Mint',
      items: [
        { name: 'Jägermeister', sub: 'Herbal', pours: [{ label: 'Pour', price: 10, bottlePrice: 165 }] },
        { name: 'Rumple Minze', sub: 'Peppermint Schnapps', pours: [{ label: 'Pour', price: 10 }] },
      ],
    },
  ],
}

const wineData: Category = {
  id: 'wine',
  label: 'Wine',
  icon: Wine,
  sections: [
    {
      heading: 'Red Wine',
      items: [
        { name: 'Line 39', sub: 'Merlot — House Red', pours: [{ label: 'Glass', price: 10, bottlePrice: 40 }] },
        { name: 'Drop of Sunshine', sub: 'Red Blend', pours: [{ label: 'Glass', price: 15, bottlePrice: 60 }] },
        { name: 'J Vineyard', sub: 'Pinot Noir', pours: [{ label: 'Glass', price: 18, bottlePrice: 75 }] },
        { name: 'Piattelli Vineyards', sub: 'Reserve Malbec', pours: [{ label: 'Glass', price: 20, bottlePrice: 80 }] },
        { name: 'Cambria (Julia\'s Vineyard)', sub: 'Pinot Noir', pours: [{ label: 'Glass', price: 22, bottlePrice: 85 }] },
        { name: 'Earthquake', sub: 'Cabernet Sauvignon', pours: [{ label: 'Glass', price: 22, bottlePrice: 85 }] },
        { name: 'The Prisoner', sub: 'Red Blend', pours: [{ label: 'Glass', price: 25, bottlePrice: 100 }] },
        { name: 'Raymond Vineyards', sub: 'Reserve Merlot', pours: [{ label: 'Glass', price: 37, bottlePrice: 150 }] },
        { name: 'Justin Vineyards (Isosceles)', sub: 'Cabernet Blend', pours: [{ label: 'Glass', price: 40, bottlePrice: 160 }] },
      ],
    },
    {
      heading: 'White Wine',
      items: [
        { name: 'Line 39', sub: 'Sauvignon Blanc — House White', pours: [{ label: 'Glass', price: 10, bottlePrice: 40 }] },
        { name: 'Kendall-Jackson', sub: 'Chardonnay — House White', pours: [{ label: 'Glass', price: 10, bottlePrice: 40 }] },
        { name: 'Kendall-Jackson', sub: 'Riesling', pours: [{ label: 'Glass', price: 12, bottlePrice: 48 }] },
        { name: 'Lunardi', sub: 'Pinot Grigio', pours: [{ label: 'Glass', price: 14, bottlePrice: 56 }] },
        { name: 'Ruffino', sub: 'Moscato D\'Asti', pours: [{ label: 'Glass', price: 14, bottlePrice: 56 }] },
        { name: 'Sun Goddess', sub: 'Pinot Grigio', pours: [{ label: 'Glass', price: 16, bottlePrice: 64 }] },
        { name: 'Cambria Vineyard', sub: 'Chardonnay', pours: [{ label: 'Glass', price: 22, bottlePrice: 85 }] },
        { name: 'Kirchberg de Barr', sub: 'Riesling', pours: [{ label: 'Glass', price: 25, bottlePrice: 100 }] },
        { name: 'Rombauer', sub: 'Chardonnay', pours: [{ label: 'Glass', price: 30, bottlePrice: 120 }] },
      ],
    },
    {
      heading: 'Rosé',
      items: [
        { name: 'Day Owl', sub: 'Rosé — House Rosé', pours: [{ label: 'Glass', price: 14, bottlePrice: 56 }] },
      ],
    },
  ],
}

const bubblesData: Category = {
  id: 'bubbles',
  label: 'Bubbles',
  icon: Grape,
  sections: [
    {
      heading: 'Champagne & Prosecco',
      items: [
        { name: 'Wycliff Brut', sub: 'House Bubbles / Mimosa Base', pours: [{ label: 'Glass', price: 10, bottlePrice: 40 }] },
        { name: 'Wycliff Brut Rosé', pours: [{ label: 'Glass', price: 10, bottlePrice: 40 }] },
        { name: 'Benvolio Prosecco', pours: [{ label: 'Glass', price: 12, bottlePrice: 48 }] },
        { name: 'Caposaldo Prosecco', pours: [{ label: 'Glass', price: 14, bottlePrice: 56 }] },
        { name: 'Caposaldo Peach Moscato', pours: [{ label: 'Glass', price: 14, bottlePrice: 56 }] },
        { name: 'Risata Moscato d\'Asti', pours: [{ label: 'Glass', price: 14, bottlePrice: 56 }] },
        { name: 'Risata Moscato d\'Asti Red', pours: [{ label: 'Glass', price: 14, bottlePrice: 56 }] },
      ],
    },
    {
      heading: 'VIP Bottle Service — Champagne',
      items: [
        { name: 'Moët & Chandon', sub: 'Brut Impérial', pours: [{ label: 'Bottle', price: 250 }] },
        { name: 'Moët & Chandon', sub: 'Brut Rosé', pours: [{ label: 'Bottle', price: 325 }] },
        { name: 'Veuve Clicquot', sub: 'Yellow Label', pours: [{ label: 'Bottle', price: 300 }] },
      ],
    },
  ],
}

const beerData: Category = {
  id: 'beer',
  label: 'Beer',
  icon: Beer,
  sections: [
    {
      heading: 'Draft & Bottle',
      items: [
        { name: '805', sub: 'Firestone Walker', pours: [{ label: 'Bottle', price: 8 }] },
        { name: 'Angry Orchard', sub: 'Crisp Apple', pours: [{ label: 'Bottle', price: 8 }] },
        { name: 'Ballast Point Sculpin', sub: 'IPA', pours: [{ label: 'Bottle', price: 8 }] },
        { name: 'Blue Moon', pours: [{ label: 'Bottle', price: 8 }] },
        { name: 'Corona Extra', pours: [{ label: 'Bottle', price: 8 }] },
        { name: 'Dos Equis XX', pours: [{ label: 'Bottle', price: 8 }] },
        { name: 'Guinness Draught', pours: [{ label: 'Bottle', price: 8 }] },
        { name: 'Heineken', pours: [{ label: 'Bottle', price: 8 }] },
        { name: 'Heineken 0.0', sub: 'Non-Alcoholic', pours: [{ label: 'Bottle', price: 8 }] },
        { name: 'Modelo Especial', pours: [{ label: 'Bottle', price: 8 }] },
        { name: 'Modelo Negra', pours: [{ label: 'Bottle', price: 8 }] },
        { name: 'Red Stripe', pours: [{ label: 'Bottle', price: 8 }] },
        { name: 'Stella Artois', pours: [{ label: 'Bottle', price: 8 }] },
      ],
    },
    {
      heading: 'Bucket of Beer',
      items: [
        { name: 'Mix & Match Bucket', sub: '5 bottles, your choice', pours: [{ label: 'Bucket', price: 40 }] },
      ],
    },
  ],
}

const ALL_CATEGORIES: Category[] = [
  cocktailsData,
  vodkaData,
  tequilaData,
  rumData,
  whiskeyData,
  cognacData,
  ginData,
  liqueursData,
  wineData,
  bubblesData,
  beerData,
]

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------
function MenuItemRow({ item }: { item: Item }) {
  const pour = item.pours[0]
  const hasBottle = pour.bottlePrice !== undefined
  return (
    <div className="flex items-start justify-between gap-4 py-3.5 border-b border-white/[0.06] last:border-0 group">
      <div className="flex-1 min-w-0">
        <p className="font-sans text-sm md:text-base text-white/90 group-hover:text-primary transition-colors duration-200 leading-snug">
          {item.name}
        </p>
        {item.sub && (
          <p className="font-sans text-xs text-white/40 mt-0.5 leading-snug">{item.sub}</p>
        )}
      </div>
      <div className="flex items-center gap-4 shrink-0">
        <div className="text-right">
          <span className="font-sans text-xs uppercase tracking-widest text-white/30 mr-1.5">{pour.label}</span>
          <span className="font-sans text-sm md:text-base text-primary font-medium">${pour.price}</span>
        </div>
        {hasBottle && (
          <div className="text-right hidden sm:block">
            <span className="font-sans text-xs uppercase tracking-widest text-white/30 mr-1.5">Bottle</span>
            <span className="font-sans text-sm md:text-base text-white/60">${pour.bottlePrice}</span>
          </div>
        )}
      </div>
    </div>
  )
}

function SectionBlock({ section }: { section: Section }) {
  return (
    <div className="mb-8 last:mb-0">
      <h4 className="font-sans text-xs uppercase tracking-[0.3em] text-primary/60 mb-4 pb-2 border-b border-primary/15">
        {section.heading}
      </h4>
      <div>
        {section.items.map((item) => (
          <MenuItemRow key={`${item.name}-${item.sub ?? ''}`} item={item} />
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------
export function SipsMenu() {
  const [activeCat, setActiveCat] = useState<string>('cocktails')
  const category = ALL_CATEGORIES.find((c) => c.id === activeCat) ?? ALL_CATEGORIES[0]

  return (
    <section className="relative w-full bg-[#0B111B] px-4 sm:px-6 py-16 md:py-24">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10 md:mb-14">
          <p className="font-sans text-xs uppercase tracking-[0.35em] text-primary/70 mb-3">
            The Sips
          </p>
          <h2 className="font-sans text-4xl sm:text-5xl md:text-6xl text-white mb-4">
            Full Menu
          </h2>
          <p className="font-sans text-sm text-white/40 tracking-wide">
            Menu prices shown &mdash; all spirits available by pour or bottle service
          </p>
        </div>

        {/* Category tabs — horizontal scroll on mobile */}
        <div className="overflow-x-auto pb-1 mb-10 md:mb-12 -mx-4 px-4">
          <div className="flex gap-2 w-max mx-auto">
            {ALL_CATEGORIES.map((cat) => {
              const Icon = cat.icon
              const isActive = cat.id === activeCat
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCat(cat.id)}
                  className={`relative flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-medium uppercase tracking-widest transition-all duration-300 whitespace-nowrap ${
                    isActive
                      ? 'text-black'
                      : 'text-white/50 hover:text-white/80 bg-white/[0.04] border border-white/10 hover:border-white/20'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="sips-tab-bg"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      className="absolute inset-0 rounded-full bg-primary shadow-[0_0_20px_rgba(226,182,54,0.45)]"
                    />
                  )}
                  <Icon className="w-3.5 h-3.5 relative shrink-0" strokeWidth={2} />
                  <span className="relative">{cat.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Content panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCat}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm p-6 md:p-10"
          >
            {/* Pour / Bottle column headers for spirits */}
            {category.id !== 'cocktails' && (
              <div className="flex justify-end gap-4 mb-4 pb-3 border-b border-white/[0.08]">
                <span className="font-sans text-xs uppercase tracking-widest text-white/25 w-20 text-right">Pour</span>
                <span className="font-sans text-xs uppercase tracking-widest text-white/25 w-20 text-right hidden sm:block">Bottle</span>
              </div>
            )}

            {category.sections.map((section) => (
              <SectionBlock key={section.heading} section={section} />
            ))}
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  )
}
