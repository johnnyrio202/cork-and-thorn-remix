'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Zap, Wind, ChevronRight, Wine, Search, X } from 'lucide-react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type Pour = { label: string; price: number; bottlePrice?: number }
export type Item = { name: string; sub?: string; menuDescription?: string; hidePrice?: boolean; pours: Pour[] }

// ---------------------------------------------------------------------------
// Data — OTD prices only, no POS prices
// ---------------------------------------------------------------------------

export const VOL1: Item[] = [
  { name: 'Desert Rose', sub: 'Teremana Blanco, Hibiscus, Fresh Lime/Lemon', menuDescription: 'Floral and bright with a citrus finish.', pours: [{ label: 'Cocktail', price: 20 }] },
  { name: 'Golden Nugget', sub: 'Watermelon Basil Vodka, St-Germain, Guava, Prosecco', menuDescription: 'Fruity and elegant with botanical undertones.', pours: [{ label: 'Cocktail', price: 22 }] },
  { name: 'Indigo Roller', sub: 'McQueen Ultraviolet Gin, Lychee, Lavender & Earl Grey', menuDescription: 'Aromatic with floral complexity and stone fruit notes.', pours: [{ label: 'Cocktail', price: 22 }] },
  { name: 'Fremont Orchid', sub: 'Ketel One, Chambord, Passionfruit, Vanilla', menuDescription: 'Smooth and rich with tropical sweetness.', pours: [{ label: 'Cocktail', price: 20 }] },
  { name: 'Chamomile Crown', sub: 'Crown Royal, Pineapple Water, Burnt Honey, Champagne Float', menuDescription: 'Creamy and luxurious with warm honey notes.', pours: [{ label: 'Cocktail', price: 22 }] },
  { name: 'Bellagio Botanist', sub: 'Bombay Sapphire, Campari, Passionfruit, Tonic', menuDescription: 'Sophisticated aperitif with bitter-sweet balance.', pours: [{ label: 'Cocktail', price: 21 }] },
  { name: 'Arts District Mule', sub: "Tito's, Strawberry & Black Pepper, Fever-Tree Ginger Beer", menuDescription: 'Spicy and refreshing with berry undertones.', pours: [{ label: 'Cocktail', price: 19 }] },
]
export const VOL2: Item[] = [
  { name: 'Stardust Shadow', sub: 'Ilegal Mezcal, Gran Malo Tamarind, Mango, Habanero', menuDescription: 'Complex and smoky with sweet and spicy layers.', pours: [{ label: 'Cocktail', price: 22 }] },
  { name: 'Whiskey Farmer', sub: 'Frey Ranch Bourbon, Burnt Honey, Muddled Orange & Cherry', menuDescription: 'Bold and warming with caramelized fruit notes.', pours: [{ label: 'Cocktail', price: 28 }] },
  { name: 'Main Street Manhattan', sub: 'Frey Ranch Bottled-in-Bond Rye, Lo-Fi Sweet Vermouth, Clove Bitters', menuDescription: 'Classic and complex with aromatic spice.', pours: [{ label: 'Cocktail', price: 28 }] },
  { name: 'Water Street Bloom', sub: 'Las Vegas Distillery Nevada Vodka, Lychee, Jasmine Tea', menuDescription: 'Refined and delicate with floral essence.', pours: [{ label: 'Cocktail', price: 20 }] },
  { name: 'The Rio', sub: 'Don Fulano Blanco, Lo-Fi Gentian Amaro, Fresh Grapefruit, Rosemary', menuDescription: 'Herbaceous and citrus-forward with dry finish.', pours: [{ label: 'Cocktail', price: 22 }] },
  { name: 'Mandalay Heat', sub: "Bumbu Rum, Myers's Dark, Guava, Jalapeño", menuDescription: 'Tropical with a spicy kick and dark fruit depth.', pours: [{ label: 'Cocktail', price: 21 }] },
  { name: 'Tropicana', sub: 'Captain Morgan Spiced, Peach, Black Pepper, Ginger Beer', menuDescription: 'Sweet and zesty with a spiced edge.', pours: [{ label: 'Cocktail', price: 19 }] },
]
export const VOL3: Item[] = [
  { name: 'Flamingo Fizz', sub: 'Fresh Lime, Agave, Mint-Hibiscus Syrup, Purrizza', menuDescription: 'Vibrant and floral with bright citrus notes.', pours: [{ label: 'Zero-Proof', price: 12 }] },
  { name: 'Mojave Mule', sub: 'Mango, Fresh Lemon, House Gum Syrup, Ginger Beer', menuDescription: 'Tropical and spicy with refreshing ginger warmth.', pours: [{ label: 'Zero-Proof', price: 14 }] },
  { name: 'Lavender Haze', sub: 'Fresh Lemon, Purrizza, Butterfly Pea Flower Tea Float', menuDescription: 'Floral and aromatic with delicate complexity.', pours: [{ label: 'Zero-Proof', price: 14 }] },
  { name: 'The Mirage', sub: 'Pineapple, Passionfruit, Fresh Lime, House Gum Syrup', menuDescription: 'Exotic and creamy with tropical passion fruit.', pours: [{ label: 'Zero-Proof', price: 12 }] },
  { name: 'Desert Dove', sub: 'Fresh Grapefruit, Fresh Lime, Burnt Honey — Tajín/Black Lava Salt Rim', menuDescription: 'Citrus-driven with savory umami depth and honey richness.', pours: [{ label: 'Zero-Proof', price: 14 }] },
  { name: 'Sunset Vine', sub: 'Fresh Lemon, Peach, Fresh Basil, Ginger Beer', menuDescription: 'Stone fruit with herbaceous and spicy notes.', pours: [{ label: 'Zero-Proof', price: 14 }] },
  { name: 'Crimson Petal', sub: 'Fresh Lemon, Strawberry, Fever-Tree Pink Grapefruit Soda', menuDescription: 'Berry-forward and refreshing with citrus brightness.', pours: [{ label: 'Zero-Proof', price: 12 }] },
]
const SPIRITS: Record<string, { label: string; items: Item[] }> = {
  vodka: {
    label: 'Vodka',
    items: [
      { name: 'SKYY', sub: 'House / Well', pours: [{ label: 'Pour', price: 10, bottlePrice: 165 }] },
      { name: "Tito's", sub: 'Handmade', pours: [{ label: 'Pour', price: 12, bottlePrice: 175 }] },
      { name: 'Absolut Citron', sub: 'Citrus Vodka', pours: [{ label: 'Pour', price: 15, bottlePrice: 200 }] },
      { name: 'Aspen Vodka', sub: 'Aspen Distillers', pours: [{ label: 'Pour', price: 15, bottlePrice: 200 }] },
      { name: 'Haku', sub: 'Japanese Vodka', pours: [{ label: 'Pour', price: 15, bottlePrice: 200 }] },
      { name: 'Las Vegas Distillery', sub: 'Nevada Vodka', pours: [{ label: 'Pour', price: 15, bottlePrice: 200 }] },
      { name: 'Ketel One', sub: 'Original', pours: [{ label: 'Pour', price: 15, bottlePrice: 200 }] },
      { name: 'Ketel One Espresso Martini', sub: 'Ready to Drink', pours: [{ label: 'Pour', price: 15, bottlePrice: 200 }] },
      { name: 'Cîroc', sub: 'Original / Apple / Coconut / Mango / Passion / Peach / Pineapple / Pomegranate / Red Berry / Strawberry Lemonade', pours: [{ label: 'Pour', price: 17, bottlePrice: 225 }] },
      { name: 'Grey Goose', sub: 'Original', pours: [{ label: 'Pour', price: 20, bottlePrice: 300 }] },
      { name: 'Grey Goose Essences', sub: 'Watermelon & Basil', pours: [{ label: 'Pour', price: 20, bottlePrice: 300 }] },
    ],
  },
  rum: {
    label: 'Rum',
    items: [
      { name: 'Bacardi Superior', sub: 'House / Well', pours: [{ label: 'Pour', price: 10, bottlePrice: 165 }] },
      { name: 'Malibu', sub: 'Original Coconut', pours: [{ label: 'Pour', price: 12, bottlePrice: 175 }] },
      { name: 'Captain Morgan', sub: 'Original Spiced', pours: [{ label: 'Pour', price: 12, bottlePrice: 175 }] },
      { name: "Myers's", sub: 'Dark Rum', pours: [{ label: 'Pour', price: 12, bottlePrice: 175 }] },
      { name: 'Ron Del Barrilito', sub: '2 Stars', pours: [{ label: 'Pour', price: 15, bottlePrice: 200 }] },
      { name: 'Bumbu', sub: 'The Original', pours: [{ label: 'Pour', price: 18, bottlePrice: 250 }] },
    ],
  },
  tequila: {
    label: 'Tequila & Mezcal',
    items: [
      { name: 'Sauza Hacienda Gold', sub: 'House / Well', pours: [{ label: 'Pour', price: 10, bottlePrice: 165 }] },
      { name: 'Teremana Blanco', pours: [{ label: 'Pour', price: 12, bottlePrice: 175 }] },
      { name: 'Teremana Reposado', pours: [{ label: 'Pour', price: 15, bottlePrice: 200 }] },
      { name: 'Teremana Añejo', pours: [{ label: 'Pour', price: 20, bottlePrice: 300 }] },
      { name: 'Hornitos Cucumber Jalapeño', pours: [{ label: 'Pour', price: 14, bottlePrice: 175 }] },
      { name: 'Hornitos Pineapple', pours: [{ label: 'Pour', price: 14, bottlePrice: 170 }] },
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
  gin: {
    label: 'Gin',
    items: [
      { name: 'Tanqueray', sub: 'London Dry — House / Well', pours: [{ label: 'Pour', price: 10, bottlePrice: 165 }] },
      { name: 'Bombay Sapphire', sub: 'Original', pours: [{ label: 'Pour', price: 15, bottlePrice: 200 }] },
      { name: 'Roku Gin', sub: 'Japanese Gin', pours: [{ label: 'Pour', price: 15, bottlePrice: 200 }] },
      { name: 'McQueen and the Violet Fog', sub: 'Original', pours: [{ label: 'Pour', price: 18, bottlePrice: 250 }] },
      { name: 'McQueen UltraViolet Fog', sub: 'Color-changing botanical gin', pours: [{ label: 'Pour', price: 18, bottlePrice: 250 }] },
      { name: "Hendrick's", sub: 'Original', pours: [{ label: 'Pour', price: 18, bottlePrice: 250 }] },
      { name: 'Empress 1908', sub: 'Indigo Gin', pours: [{ label: 'Pour', price: 18, bottlePrice: 250 }] },
    ],
  },
  whiskey: {
    label: 'Whiskey & Bourbon',
    items: [
      { name: 'Benchmark Straight Bourbon', sub: 'House / Well', pours: [{ label: 'Pour', price: 10, bottlePrice: 165 }] },
      { name: 'Fireball Cinnamon Whisky', sub: 'CinnaApple available', pours: [{ label: 'Pour', price: 12, bottlePrice: 175 }] },
      { name: 'Paddy Irish Whiskey', pours: [{ label: 'Pour', price: 12, bottlePrice: 175 }] },
      { name: "Jack Daniel's Old No. 7", sub: 'Black Label', pours: [{ label: 'Pour', price: 12, bottlePrice: 175 }] },
      { name: 'Jameson Irish Whiskey', pours: [{ label: 'Pour', price: 15, bottlePrice: 200 }] },
      { name: 'Crown Royal', sub: 'Original / Apple / Peach / Vanilla / Chocolate', pours: [{ label: 'Pour', price: 15, bottlePrice: 200 }] },
      { name: 'Wild Turkey 101', sub: 'Bourbon', pours: [{ label: 'Pour', price: 15, bottlePrice: 200 }] },
      { name: "Maker's Mark", sub: 'Bourbon', pours: [{ label: 'Pour', price: 18, bottlePrice: 250 }] },
      { name: 'Sazerac Rye 6 Year', pours: [{ label: 'Pour', price: 18, bottlePrice: 250 }] },
      { name: 'Bulleit Bourbon', pours: [{ label: 'Pour', price: 18, bottlePrice: 250 }] },
      { name: 'Bulleit Rye', pours: [{ label: 'Pour', price: 18, bottlePrice: 250 }] },
      { name: "Jefferson's Bourbon Rye", pours: [{ label: 'Pour', price: 20, bottlePrice: 275 }] },
      { name: 'Woodford Reserve', sub: 'Bourbon', pours: [{ label: 'Pour', price: 20, bottlePrice: 275 }] },
      { name: 'Frey Ranch Straight Bourbon', sub: 'Nevada Distillery', pours: [{ label: 'Pour', price: 23, bottlePrice: 325 }] },
      { name: 'Frey Ranch Straight Rye', sub: 'Nevada Distillery', pours: [{ label: 'Pour', price: 23, bottlePrice: 325 }] },
      { name: 'Uncle Nearest 1856', sub: 'Premium Whiskey', pours: [{ label: 'Pour', price: 25, bottlePrice: 350 }] },
      { name: 'SirDavis American Whisky', sub: '350ml / 750ml available', pours: [{ label: 'Pour', price: 30, bottlePrice: 415 }] },
      { name: 'Suntory Hibiki Harmony', sub: 'Japanese Whisky', pours: [{ label: 'Pour', price: 30, bottlePrice: 415 }] },
    ],
  },
  cognac: {
    label: 'Cognac & Scotch',
    items: [
      // Cognac
      { name: 'Courvoisier VS', sub: 'Cognac', pours: [{ label: 'Pour', price: 17, bottlePrice: 250 }] },
      { name: 'Hennessy VS', sub: 'Cognac', pours: [{ label: 'Pour', price: 18, bottlePrice: 275 }] },
      { name: 'Rémy Martin VSOP', sub: 'Cognac', pours: [{ label: 'Pour', price: 23, bottlePrice: 325 }] },
      { name: "D'Ussé VSOP", sub: 'Cognac', pours: [{ label: 'Pour', price: 25, bottlePrice: 350 }] },
      { name: 'Rémy Martin 1738', sub: 'Cognac', pours: [{ label: 'Pour', price: 30, bottlePrice: 415 }] },
      // Scotch
      { name: 'Glenmorangie X', sub: 'Single Malt Scotch', pours: [{ label: 'Pour', price: 16, bottlePrice: 250 }] },
      { name: 'Johnnie Walker Black Label', sub: 'Blended Scotch', pours: [{ label: 'Pour', price: 17, bottlePrice: 250 }] },
      { name: 'Johnnie Walker Black Cask', sub: 'Blended Scotch', pours: [{ label: 'Pour', price: 23, bottlePrice: 325 }] },
      { name: 'The Glenlivet 12 Yr', sub: 'Single Malt Scotch', pours: [{ label: 'Pour', price: 25, bottlePrice: 350 }] },
      { name: 'The Macallan Double Cask 12 Yr', sub: 'Single Malt Scotch', pours: [{ label: 'Pour', price: 25, bottlePrice: 350 }] },
      { name: 'The Macallan Double Cask 15 Yr', sub: 'Single Malt Scotch', pours: [{ label: 'Pour', price: 55, bottlePrice: 800 }] },
    ],
  },
  liqueurs: {
    label: 'Liqueurs & Cordials',
    items: [
      // Coffees & Cream
      { name: 'Kahlúa', sub: 'Coffee Liqueur', pours: [{ label: 'Pour', price: 12 }] },
      { name: 'Mr Black', sub: 'Cold Brew Coffee Liqueur', pours: [{ label: 'Pour', price: 12 }] },
      { name: 'Baileys Irish Cream', pours: [{ label: 'Pour', price: 12, bottlePrice: 175 }] },
      { name: 'Boston Bourbon Cream', sub: 'House Bourbon Cream', pours: [{ label: 'Pour', price: 12 }] },
      // Orange Liqueurs
      { name: 'Cointreau', sub: 'Orange Liqueur', pours: [{ label: 'Pour', price: 15 }] },
      { name: 'Grand Marnier', sub: 'Orange Liqueur', pours: [{ label: 'Pour', price: 15, bottlePrice: 200 }] },
      // Fruit & Floral
      { name: 'Chambord', sub: 'Black Raspberry Liqueur', pours: [{ label: 'Pour', price: 15 }] },
      { name: 'Chinola', sub: 'Passion Fruit Liqueur', pours: [{ label: 'Pour', price: 12 }] },
      { name: 'Kanade White Peach', sub: 'Japanese Liqueur', pours: [{ label: 'Pour', price: 15 }] },
      { name: 'Kanade Yuzu', sub: 'Japanese Liqueur', pours: [{ label: 'Pour', price: 15 }] },
      { name: 'St-Germain', sub: 'Elderflower Liqueur', pours: [{ label: 'Pour', price: 15 }] },
      // Nut & Seed
      { name: 'Frangelico', sub: 'Hazelnut Liqueur', pours: [{ label: 'Pour', price: 12 }] },
      { name: 'Disaronno', sub: 'Amaretto', pours: [{ label: 'Pour', price: 15, bottlePrice: 200 }] },
      // Schnapps & House Modifiers
      { name: 'Midori', sub: 'Melon Liqueur', pours: [{ label: 'Pour', price: 10 }] },
      { name: 'DeKuyper Blue Curacao', pours: [{ label: 'Pour', price: 10 }] },
      { name: 'DeKuyper Peach Schnapps', pours: [{ label: 'Pour', price: 10 }] },
      { name: 'DeKuyper Watermelon Schnapps', pours: [{ label: 'Pour', price: 10 }] },
      { name: 'DeKuyper Sour Apple Schnapps', pours: [{ label: 'Pour', price: 10 }] },
      { name: 'Crème de Cacao Dark', pours: [{ label: 'Pour', price: 10 }] },
      { name: 'Crème de Cacao White', pours: [{ label: 'Pour', price: 10 }] },
      // Aperitif & Amaro
      { name: 'Aperol', sub: 'Aperitivo', pours: [{ label: 'Pour', price: 10, bottlePrice: 165 }] },
      { name: 'Campari', sub: 'Aperitivo', pours: [{ label: 'Pour', price: 12, bottlePrice: 175 }] },
      { name: 'Lo-Fi Gentian Amaro', pours: [{ label: 'Pour', price: 10 }] },
      { name: 'Lo-Fi Sweet Vermouth', pours: [{ label: 'Pour', price: 10 }] },
      { name: 'Lo-Fi Dry Vermouth', pours: [{ label: 'Pour', price: 10 }] },
      // Herbal & Mint
      { name: 'Jägermeister', sub: 'Herbal Liqueur', pours: [{ label: 'Pour', price: 10, bottlePrice: 165 }] },
      { name: 'Rumple Minze', sub: 'Peppermint Schnapps', pours: [{ label: 'Pour', price: 10 }] },
    ],
  },
}

// Wine, Bubbles, Beer — new categories
const WINE: Record<string, { label: string; items: Item[] }> = {
  red: {
    label: 'Red Wine',
    items: [
      { name: 'House Merlot', sub: 'Line 39', pours: [{ label: 'Glass', price: 10, bottlePrice: 40 }] },
      { name: 'Drop of Sunshine', sub: 'Red Blend', pours: [{ label: 'Glass', price: 15, bottlePrice: 60 }] },
      { name: 'J Vineyard', sub: 'Pinot Noir', pours: [{ label: 'Glass', price: 18, bottlePrice: 75 }] },
      { name: 'Piattelli Vineyards', sub: 'Reserve Malbec', pours: [{ label: 'Glass', price: 20, bottlePrice: 80 }] },
      { name: 'Cambria — Julia\'s Vineyard', sub: 'Pinot Noir', pours: [{ label: 'Glass', price: 22, bottlePrice: 85 }] },
      { name: 'Earthquake', sub: 'Cabernet Sauvignon', pours: [{ label: 'Glass', price: 22, bottlePrice: 85 }] },
      { name: 'The Prisoner', sub: 'Red Blend', pours: [{ label: 'Glass', price: 25, bottlePrice: 100 }] },
      { name: 'Raymond Vineyards', sub: 'Reserve Merlot', pours: [{ label: 'Glass', price: 37, bottlePrice: 150 }] },
      { name: 'Justin Vineyards — Isosceles', sub: 'Cabernet Blend', pours: [{ label: 'Glass', price: 40, bottlePrice: 160 }] },
    ],
  },
  white: {
    label: 'White Wine & Rosé',
    items: [
      { name: 'Line 39', sub: 'Sauvignon Blanc', pours: [{ label: 'Glass', price: 10, bottlePrice: 40 }] },
      { name: 'Kendall-Jackson Vintner\'s Reserve', sub: 'Chardonnay — House White', pours: [{ label: 'Glass', price: 10, bottlePrice: 40 }] },
      { name: 'Kendall-Jackson Vintner\'s Reserve', sub: 'Riesling', pours: [{ label: 'Glass', price: 12, bottlePrice: 48 }] },
      { name: 'Lunardi', sub: 'Pinot Grigio', pours: [{ label: 'Glass', price: 14, bottlePrice: 56 }] },
      { name: 'Ruffino', sub: 'Moscato D\'Asti', pours: [{ label: 'Glass', price: 14, bottlePrice: 56 }] },
      { name: 'Sun Goddess', sub: 'Pinot Grigio', pours: [{ label: 'Glass', price: 16, bottlePrice: 64 }] },
      { name: 'Cambria Vineyard', sub: 'Chardonnay', pours: [{ label: 'Glass', price: 22, bottlePrice: 85 }] },
      { name: 'Kirchberg de Barr', sub: 'Riesling', pours: [{ label: 'Glass', price: 25, bottlePrice: 100 }] },
      { name: 'Rombauer', sub: 'Chardonnay', pours: [{ label: 'Glass', price: 30, bottlePrice: 120 }] },
      { name: 'Day Owl', sub: 'Rosé — House Rosé', pours: [{ label: 'Glass', price: 14, bottlePrice: 56 }] },
    ],
  },
}

const BUBBLES: Item[] = [
  // House Bubbles / Mimosa Base
  { name: 'Wycliff Brut', sub: 'House Champagne / Mimosa Base', pours: [{ label: 'Glass', price: 10, bottlePrice: 40 }] },
  { name: 'Wycliff Brut Rosé', sub: 'House Champagne Rosé', pours: [{ label: 'Glass', price: 10, bottlePrice: 40 }] },
  // Prosecco
  { name: 'Benvolio', sub: 'Prosecco', pours: [{ label: 'Glass', price: 12, bottlePrice: 48 }] },
  { name: 'Caposaldo', sub: 'Prosecco', pours: [{ label: 'Glass', price: 14, bottlePrice: 56 }] },
  { name: 'Caposaldo', sub: 'Peach Moscato', pours: [{ label: 'Glass', price: 14, bottlePrice: 56 }] },
  // Moscato
  { name: 'Risata', sub: 'Moscato d\'Asti', pours: [{ label: 'Glass', price: 14, bottlePrice: 56 }] },
  { name: 'Risata', sub: 'Moscato d\'Asti Red', pours: [{ label: 'Glass', price: 14, bottlePrice: 56 }] },
  // VIP Bottle Service — Champagne
  { name: 'Moët & Chandon Brut Impérial', sub: 'VIP Bottle Service', pours: [{ label: 'Bottle', price: 250 }] },
  { name: 'Moët & Chandon Brut Rosé', sub: 'VIP Bottle Service', pours: [{ label: 'Bottle', price: 325 }] },
  { name: 'Veuve Clicquot Yellow Label', sub: 'VIP Bottle Service', pours: [{ label: 'Bottle', price: 300 }] },
]

const BEER: Item[] = [
  { name: '805', sub: 'Firestone Walker', pours: [{ label: 'Bottle', price: 8 }, { label: 'Happy Hour', price: 7 }] },
  { name: 'Angry Orchard', sub: 'Crisp Apple Hard Cider', pours: [{ label: 'Bottle', price: 8 }, { label: 'Happy Hour', price: 7 }] },
  { name: 'Ballast Point Sculpin IPA', sub: 'Craft IPA', pours: [{ label: 'Bottle', price: 8 }, { label: 'Happy Hour', price: 7 }] },
  { name: 'Blue Moon', sub: 'Belgian White Ale', pours: [{ label: 'Bottle', price: 8 }, { label: 'Happy Hour', price: 7 }] },
  { name: 'Corona Extra', sub: 'Import — Mexico', pours: [{ label: 'Bottle', price: 8 }, { label: 'Happy Hour', price: 7 }] },
  { name: 'Dos Equis (XX)', sub: 'Import — Mexico', pours: [{ label: 'Bottle', price: 8 }, { label: 'Happy Hour', price: 7 }] },
  { name: 'Guinness Draught', sub: 'Import — Ireland', pours: [{ label: 'Bottle', price: 8 }, { label: 'Happy Hour', price: 7 }] },
  { name: 'Heineken', sub: 'Import — Netherlands', pours: [{ label: 'Bottle', price: 8 }, { label: 'Happy Hour', price: 7 }] },
  { name: 'Heineken 0.0', sub: 'Non-Alcoholic', pours: [{ label: 'Bottle', price: 8 }, { label: 'Happy Hour', price: 7 }] },
  { name: 'Modelo Especial', sub: 'Import — Mexico', pours: [{ label: 'Bottle', price: 8 }, { label: 'Happy Hour', price: 7 }] },
  { name: 'Modelo Negra', sub: 'Import — Mexico', pours: [{ label: 'Bottle', price: 8 }, { label: 'Happy Hour', price: 7 }] },
  { name: 'Red Stripe', sub: 'Import — Jamaica', pours: [{ label: 'Bottle', price: 8 }, { label: 'Happy Hour', price: 7 }] },
  { name: 'Stella Artois', sub: 'Import — Belgium', pours: [{ label: 'Bottle', price: 8 }, { label: 'Happy Hour', price: 7 }] },
  { name: 'Bucket of Beer', sub: 'Mix & Match — any 6 bottles', pours: [{ label: 'Bucket', price: 40 }] },
]

// Hookah pricing — base session rates + upgrades
const HOOKAH_BASE: Item[] = [
  // Base sessions
  { name: 'Weekday Session', sub: 'Monday–Thursday', pours: [{ label: 'Base', price: 32 }] },
  { name: 'Weekend Session', sub: 'Friday–Sunday', pours: [{ label: 'Base', price: 58 }] },
  // Bowl refills
  { name: 'Weekday Bowl Refill', sub: 'Monday–Thursday', pours: [{ label: 'Refill', price: 15 }] },
  { name: 'Weekend Bowl Refill', sub: 'Friday & Saturday only', pours: [{ label: 'Refill', price: 25 }] },
  // Hookah upgrades
  { name: 'Premium Upgrade', sub: 'Upgrade to premium German hookahs. Additional', pours: [{ label: 'Add', price: 15 }] },
  { name: 'Gold LED Upgrade', sub: 'Premium German hookahs with LED lighting. Additional', pours: [{ label: 'Add', price: 30 }] },
  // Premium product
  { name: 'Hookalit Pro', sub: 'Personal e-hookah pen — Blackcurrant Ice / Fcuking Fab / Sweet Passion Fruit / Two Apple', pours: [{ label: 'Each', price: 50 }] },
  // 3D Tips
  { name: '3D Tips', sub: 'Hello Kitty / Popeye / Bart', pours: [{ label: 'Tip', price: 18 }] },
  // Add-ons
  { name: 'Ice Tip', sub: 'Chill your session', pours: [{ label: 'Add-on', price: 10 }] },
  { name: 'Disposable Hose', sub: 'Single-use hygiene option', pours: [{ label: 'Add-on', price: 7 }] },
]

// Signature bowl mixes — curated combinations
const HOOKAH_BOWLS: Item[] = [
  { name: 'Weekend Sunset', sub: 'Watermelon / Guava / Mint', hidePrice: true, pours: [{ label: 'Bowl', price: 0 }] },
  { name: 'Tropic Breeze', sub: 'Orange / Peach Lit / Mint', hidePrice: true, pours: [{ label: 'Bowl', price: 0 }] },
  { name: 'Mari Bowl', sub: 'Blueberry Lit / Peach Lit / Kiwi', hidePrice: true, pours: [{ label: 'Bowl', price: 0 }] },
  { name: 'Big Mo', sub: 'White Gummy / Peach Lit / Lime Lit', hidePrice: true, pours: [{ label: 'Bowl', price: 0 }] },
  { name: "Nelly's Cookies", sub: 'Cookies & Crème / Mint', hidePrice: true, pours: [{ label: 'Bowl', price: 0 }] },
  { name: 'Strawberry Lemonade', sub: 'Strawberry / Lime Lit / White Gummy', hidePrice: true, pours: [{ label: 'Bowl', price: 0 }] },
  { name: 'Cork & Thorn Special', sub: 'Peach Lit / Red Lips / White Gummy', hidePrice: true, pours: [{ label: 'Bowl', price: 0 }] },
]

// Flavor library — organized by brand
const HOOKAH_FLAVORS = {
  al_faker: {
    label: 'Al Faker Flavors',
    list: 'Orange / Blueberry / Peach / Mint / Watermelon / Mango / Pineapple / Strawberry / Kiwi / Vanilla / Guava / Magic Love / Coconut / Cherry / Lemon / Grapefruit / Cinnamon / Hubbly / Harvest Moon',
  },
  eternal: {
    label: 'Eternal Flavors',
    list: 'Blue Lit / Peach Lit / Lime Lit / Lemon Lit / Red Lips / Orange Lit / Houdini Secret / Milk & Cookies',
  },
  mazaya: {
    label: 'Mazaya Flavors',
    list: 'Watermelon w/Mint / Orange w/Mint / Love Candy Drop / Raspberry / Blueberry / Mango / Peach / Lemon',
  },
  fumari: {
    label: 'Fumari Flavors',
    list: 'White Gummy / Red Gummy / Pink Gummy',
  },
}

const CIGARS: Item[] = [
  { name: 'Cohiba', sub: 'Full Smoke', pours: [{ label: 'Cigar', price: 27 }] },
  { name: 'Flathead', sub: 'Full Smoke', pours: [{ label: 'Cigar', price: 21 }] },
  { name: 'Punch', sub: 'Medium Smoke', pours: [{ label: 'Cigar', price: 19 }] },
  { name: 'Perdomo', sub: 'Medium Smoke', pours: [{ label: 'Cigar', price: 16 }] },
  { name: 'Crazy Alice', sub: 'Original', pours: [{ label: 'Cigar', price: 14 }] },
  { name: 'Diesel Rabbit Hole', sub: 'Medium / Full Smoke', pours: [{ label: 'Cigar', price: 10 }] },
  { name: 'Tatiana', sub: 'Chocolate / Groovy Blue / Honey', pours: [{ label: 'Cigar', price: 10 }] },
  { name: 'Butane Refills', sub: 'Lighter fuel', pours: [{ label: 'Refill', price: 2 }] },
]

// ---------------------------------------------------------------------------
// Tier config
// ---------------------------------------------------------------------------
type Tier1Val = 'sips' | 'exhales'

const SIPS_TIER2 = [
  { id: 'cocktails', label: 'Cocktails' },
  { id: 'spirits',   label: 'Spirits'   },
  { id: 'wine',      label: 'Wine'      },
  { id: 'bubbles',   label: 'Bubbles'   },
  { id: 'beer',      label: 'Beer'      },
]
const EXHALES_TIER2 = [
  { id: 'hookah', label: 'Hookah' },
  { id: 'cigars', label: 'Cigars' },
]

const COCKTAIL_VOLS = [
  { id: 'vol1', label: 'Vol 1', sub: 'The Blooms'      },
  { id: 'vol2', label: 'Vol 2', sub: 'The Roots'       },
  { id: 'vol3', label: 'Vol 3', sub: 'The Mock Garden' },
]

const SPIRIT_CATS = [
  { id: 'vodka',    label: 'Vodka'             },
  { id: 'tequila',  label: 'Tequila & Mezcal'  },
  { id: 'gin',      label: 'Gin'               },
  { id: 'rum',      label: 'Rum'               },
  { id: 'whiskey',  label: 'Whiskey & Bourbon' },
  { id: 'cognac',   label: 'Cognac & Scotch'   },
  { id: 'liqueurs', label: 'Liqueurs'          },
]

const WINE_CATS = [
  { id: 'red',   label: 'Red'          },
  { id: 'white', label: 'White & Rosé' },
]

const HOOKAH_TIER3 = [
  { id: 'base',    label: 'Session & Upgrades' },
  { id: 'bowls',   label: 'Signature Bowls'    },
  { id: 'flavors', label: 'Flavor Library'     },
]

// ---------------------------------------------------------------------------
// ItemCard
// ---------------------------------------------------------------------------
function ItemCard({
  item,
  index,
  isSecret,
  categoryPath,
}: {
  item: Item
  index: number
  isSecret?: boolean
  // Shown as a footer badge — only set by search results, where items from
  // different categories mix in one grid. Normal category browsing relies
  // on the section heading above instead, so this stays unset there.
  categoryPath?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24, delay: index * 0.03, ease: 'easeOut' }}
      className={`group relative flex flex-col overflow-hidden rounded-xl border p-5 md:p-6 transition-transform duration-300 hover:-translate-y-1 ${
        isSecret
          ? 'border-primary/20 bg-primary/[0.04] hover:border-primary/40'
          : 'border-white/[0.06] bg-gradient-to-br from-[#12151c] to-[#1a1e26] hover:border-primary/20'
      }`}
    >
      {/* Gold top-edge reveal on hover */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100"
      />

      <h4 className="font-sans text-sm md:text-base text-white font-medium leading-snug mb-1.5">{item.name}</h4>
      {item.sub && <p className="text-xs md:text-sm italic text-white/35 leading-relaxed mb-1.5">{item.sub}</p>}
      {item.menuDescription && (
        <p className="text-xs md:text-sm text-primary/60 leading-relaxed mb-4">{item.menuDescription}</p>
      )}

      {(!item.hidePrice || categoryPath) && (
        <div className="mt-auto flex flex-wrap items-end justify-between gap-3 border-t border-white/[0.06] pt-3.5">
          {!item.hidePrice && (
            <div className="flex flex-wrap items-end gap-4">
              {item.pours.map((pour, i) => (
                <div key={i} className="flex items-end gap-3">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.15em] text-white/30 mb-0.5">{pour.label}</p>
                    <p className="text-sm md:text-base text-primary font-semibold">${pour.price}</p>
                  </div>
                  {pour.bottlePrice && (
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.15em] text-white/30 mb-0.5">Bottle</p>
                      <p className="text-sm md:text-base text-primary font-semibold">${pour.bottlePrice}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          {categoryPath && (
            <span className="ml-auto shrink-0 rounded-sm bg-primary/10 px-2 py-1 font-sans text-[10px] uppercase tracking-[0.1em] text-primary/80">
              {categoryPath}
            </span>
          )}
        </div>
      )}
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// Pill button
// ---------------------------------------------------------------------------
function Pill({
  active,
  onClick,
  children,
  size = 'md',
  isSecret = false,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
  size?: 'lg' | 'md' | 'sm'
  isSecret?: boolean
}) {
  const sizeClass =
    size === 'lg' ? 'px-6 py-2.5 md:px-8 md:py-3 text-xs md:text-sm tracking-[0.2em]' :
    size === 'md' ? 'px-4 py-2 md:px-5 md:py-2.5 text-xs tracking-[0.16em]'  :
                   'px-3.5 py-1.5 md:px-4 md:py-2 text-[11px] tracking-[0.12em]'

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      className={`relative inline-flex items-center gap-1.5 rounded-full font-semibold uppercase transition-all duration-300 ${sizeClass} ${
        active && !isSecret
          ? 'text-[#0B111B] bg-primary shadow-[0_0_24px_rgba(226,182,54,0.4)]'
          : active && isSecret
            ? 'text-primary bg-white/[0.04] border border-primary/70 shadow-[0_0_18px_rgba(226,182,54,0.3)]'
            : isSecret
              ? 'text-white/35 border border-white/[0.06] bg-white/[0.02] hover:border-primary/30 hover:text-primary/60'
              : 'text-white/45 border border-white/[0.08] bg-white/[0.02] hover:text-white hover:border-white/20'
      }`}
    >
      {isSecret && !active && <Lock className="w-3 h-3 shrink-0" />}
      {isSecret && active  && <Zap  className="w-3 h-3 shrink-0" />}

      {/* Secret: pulsing border glow when idle */}
      {isSecret && !active && (
        <motion.span
          aria-hidden
          className="absolute inset-0 rounded-full pointer-events-none"
          animate={{
            boxShadow: [
              '0 0 0px transparent',
              '0 0 10px rgba(0,255,255,0.3)',
              '0 0 10px rgba(255,0,255,0.3)',
              '0 0 0px transparent',
            ],
          }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
      {children}
    </motion.button>
  )
}

// ---------------------------------------------------------------------------
// Breadcrumb trail — shows the path taken so far and lets user jump back
// ---------------------------------------------------------------------------
function Breadcrumb({
  items,
}: {
  items: { label: string; onClick: () => void }[]
}) {
  if (items.length === 0) return null
  return (
    <div className="flex items-center gap-1.5 flex-wrap justify-center mb-6">
      {items.map((item, idx) => (
        <span key={idx} className="flex items-center gap-1.5">
          {idx > 0 && <ChevronRight className="w-3 h-3 text-white/20" />}
          <button
            onClick={item.onClick}
            className="text-[11px] uppercase tracking-[0.18em] text-white/35 hover:text-primary transition-colors duration-200"
          >
            {item.label}
          </button>
        </span>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Content panel
// ---------------------------------------------------------------------------
// A "group" is one tier3 sub-section (e.g. a cocktail volume, a spirit
// category). Categories that don't have a tier3 (Bubbles/Beer/Cigars)
// still produce a single-element group array, so ContentPanel always
// renders a uniform list of sections — no more gating on a selected tier3.
type Group = { id: string; heading: string; description?: string; note?: string }

function getGroups(tier1: Tier1Val, tier2: string): Group[] {
  if (tier1 === 'sips') {
    if (tier2 === 'cocktails') {
      return [
        {
          id: 'vol1',
          heading: 'Vol 1 — The Blooms',
          description: 'Light, floral, and aromatic — built around house-made botanical syrups, fresh citrus, and seasonal fruit. These cocktails open the night with elegance and color.',
        },
        {
          id: 'vol2',
          heading: 'Vol 2 — The Roots',
          description: 'Inspired by Nevada\'s high desert terroir — earthy heat, burnt honey, and locally distilled spirits. Spirit-forward builds with intentional depth and a warm, smoky edge.',
        },
        {
          id: 'vol3',
          heading: 'Vol 3 — The Mock Garden',
          description: 'Zero-proof, full experience. House-pressed juices, botanical infusions, and ceremonial teas — crafted with the same care as our full bar program. Clean, complex, and completely satisfying.',
        },
      ]
    }
    if (tier2 === 'spirits') {
      return SPIRIT_CATS.map((c) => ({
        id: c.id,
        heading: SPIRITS[c.id]?.label ?? c.label,
        note: 'All spirits available by the pour or bottle service.',
      }))
    }
    if (tier2 === 'wine') {
      return WINE_CATS.map((c) => ({
        id: c.id,
        heading: WINE[c.id]?.label ?? c.label,
        note: 'Wine selection rotates seasonally. Ask your server for current availability.',
      }))
    }
    if (tier2 === 'bubbles') {
      return [{ id: 'bubbles', heading: 'Champagne & Bubbles', note: 'Bottle service includes glassware, ice bucket, and table presentation.' }]
    }
    if (tier2 === 'beer') {
      return [{ id: 'beer', heading: 'Beer' }]
    }
  } else {
    if (tier2 === 'hookah') {
      return [
        { id: 'base', heading: 'Session & Upgrades' },
        { id: 'bowls', heading: 'Signature Bowls', note: 'Curated flavor combinations — select any as your custom mix.' },
        { id: 'flavors', heading: 'Flavor Library', note: 'Reference only — flavors are selected when ordering your bowl, not priced separately.' },
      ]
    }
    if (tier2 === 'cigars') {
      return [{ id: 'cigars', heading: 'Cigars', note: 'Cut and lit table-side. Ask your server about private reserve selections.' }]
    }
  }
  return []
}

function getItems(tier1: Tier1Val, tier2: string, groupId: string): Item[] {
  if (tier1 === 'sips') {
    if (tier2 === 'cocktails') return groupId === 'vol1' ? VOL1 : groupId === 'vol2' ? VOL2 : groupId === 'vol3' ? VOL3 : []
    if (tier2 === 'spirits') return SPIRITS[groupId]?.items ?? []
    if (tier2 === 'wine') return WINE[groupId]?.items ?? []
    if (tier2 === 'bubbles') return BUBBLES
    if (tier2 === 'beer') return BEER
  } else if (tier2 === 'cigars') {
    return CIGARS
  }
  return []
}

// getItems() returns [] for hookah (its content is mostly bespoke JSX, not
// Item[] data — see ContentGroup below) except Signature Bowls, which
// really is Item[] and belongs in the searchable index.
function getSearchableItems(tier1: Tier1Val, tier2: string, groupId: string): Item[] {
  if (tier1 === 'exhales' && tier2 === 'hookah' && groupId === 'bowls') return HOOKAH_BOWLS
  return getItems(tier1, tier2, groupId)
}

function matchesQuery(item: Item, query: string) {
  if (!query) return true
  const q = query.toLowerCase()
  return (
    item.name.toLowerCase().includes(q) ||
    !!item.sub?.toLowerCase().includes(q) ||
    !!item.menuDescription?.toLowerCase().includes(q)
  )
}

// Flat, searchable index of every real menu item, built once at module
// load. Session/Upgrades and the Flavor Library aren't priced item lists
// (they're bespoke pricing tiers / reference tags) so they're excluded,
// same as the /menu-test prototype.
type SearchEntry = { item: Item; path: string }

function buildSearchIndex(): SearchEntry[] {
  const pairs: { tier1: Tier1Val; tier2: string }[] = [
    { tier1: 'sips', tier2: 'cocktails' },
    { tier1: 'sips', tier2: 'spirits' },
    { tier1: 'sips', tier2: 'wine' },
    { tier1: 'sips', tier2: 'bubbles' },
    { tier1: 'sips', tier2: 'beer' },
    { tier1: 'exhales', tier2: 'hookah' },
    { tier1: 'exhales', tier2: 'cigars' },
  ]
  const entries: SearchEntry[] = []
  for (const { tier1, tier2 } of pairs) {
    const tier1Label = tier1 === 'sips' ? 'Sips' : 'Exhales'
    const tier2Label = [...SIPS_TIER2, ...EXHALES_TIER2].find((x) => x.id === tier2)?.label ?? tier2
    for (const group of getGroups(tier1, tier2)) {
      const items = getSearchableItems(tier1, tier2, group.id)
      const path = group.heading === tier2Label ? `${tier1Label} · ${tier2Label}` : `${tier1Label} · ${tier2Label} · ${group.heading}`
      for (const item of items) entries.push({ item, path })
    }
  }
  return entries
}

const SEARCH_INDEX = buildSearchIndex()

function ContentPanel({ tier1, tier2 }: { tier1: Tier1Val; tier2: string }) {
  const groups = getGroups(tier1, tier2)
  const isHookah = tier1 === 'exhales' && tier2 === 'hookah'

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${tier1}:${tier2}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        className="mt-8 md:mt-10 space-y-12 md:space-y-14"
      >
        {groups.map((group) => (
          <ContentGroup key={group.id} tier1={tier1} tier2={tier2} group={group} isHookah={isHookah} />
        ))}
      </motion.div>
    </AnimatePresence>
  )
}

function ContentGroup({
  tier1,
  tier2,
  group,
  isHookah,
}: {
  tier1: Tier1Val
  tier2: string
  group: Group
  isHookah: boolean
}) {
  const items = isHookah ? [] : getItems(tier1, tier2, group.id)
  const tier3 = group.id

  return (
    // scroll-mt so the jump-nav pills land the section below the sticky
    // tier1/tier2/tier3 pill rows above, not flush under them.
    <div id={group.id} className="scroll-mt-28">
      {group.description && (
        <p className="font-sans text-sm md:text-base text-white/55 leading-relaxed text-center max-w-sm mx-auto mb-8">
          {group.description}
        </p>
      )}
      <div className="flex items-baseline justify-between mb-5 pb-4 border-b border-white/[0.06]">
        <h3 className="font-sans text-sm uppercase tracking-[0.2em] text-white/40">
          {group.heading}
        </h3>
        {items.length > 0 && !isHookah && (
          <span className="text-xs text-white/20 uppercase tracking-[0.12em]">
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </span>
        )}
      </div>

      {/* ── Hookah: Session & Upgrades ── bespoke grouped layout */}
      {isHookah && tier3 === 'base' ? (
          <div className="space-y-8">
            {/* Sessions */}
            <div>
              <p className="font-sans text-[10px] uppercase tracking-[0.28em] text-white/30 mb-4">Session</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: 'Weekday', sub: 'Mon – Thu', price: 32 },
                  { name: 'Weekend', sub: 'Fri – Sun', price: 58 },
                ].map((s, i) => (
                  <motion.div
                    key={s.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.22, delay: i * 0.06 }}
                    className="rounded-xl border border-primary/20 bg-primary/[0.05] px-5 py-5 flex flex-col gap-1"
                    style={{ boxShadow: '0 0 24px rgba(226,182,54,0.06)' }}
                  >
                    <p className="font-sans text-lg font-bold text-primary">${s.price}</p>
                    <p className="font-sans text-sm font-semibold text-white">{s.name} Session</p>
                    <p className="font-sans text-xs text-white/35">{s.sub}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Bowl Refills */}
            <div>
              <p className="font-sans text-[10px] uppercase tracking-[0.28em] text-white/30 mb-4">Bowl Refills</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: 'Weekday Refill', sub: 'Mon – Thu', price: 15 },
                  { name: 'Weekend Refill', sub: 'Fri & Sat only', price: 25 },
                ].map((r, i) => (
                  <motion.div
                    key={r.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.22, delay: 0.12 + i * 0.06 }}
                    className="rounded-xl border border-white/[0.07] bg-white/[0.02] px-5 py-4 flex flex-col gap-1 transition-colors duration-300 hover:border-primary/25"
                  >
                    <p className="font-sans text-base font-bold text-white">${r.price}</p>
                    <p className="font-sans text-sm text-white/70">{r.name}</p>
                    <p className="font-sans text-xs text-white/30">{r.sub}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Upgrades */}
            <div>
              <p className="font-sans text-[10px] uppercase tracking-[0.28em] text-white/30 mb-4">Upgrades</p>
              <div className="space-y-2">
                {[
                  { name: 'Premium Upgrade', sub: 'Premium German hookahs', price: '+$15' },
                  { name: 'Gold LED Upgrade', sub: 'Premium German hookahs with LED lighting', price: '+$30' },
                ].map((u, i) => (
                  <motion.div
                    key={u.name}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: 0.24 + i * 0.05 }}
                    className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] px-5 py-3.5 transition-colors duration-300 hover:border-primary/25"
                  >
                    <div>
                      <p className="font-sans text-sm font-medium text-white">{u.name}</p>
                      <p className="font-sans text-xs text-white/35">{u.sub}</p>
                    </div>
                    <span className="font-sans text-sm font-bold text-primary/80">{u.price}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Premium Products & Add-ons */}
            <div>
              <p className="font-sans text-[10px] uppercase tracking-[0.28em] text-white/30 mb-4">Premium Products & Add-ons</p>
              <div className="space-y-2">
                {[
                  { name: 'Hookalit Pro', sub: 'Personal e-hookah pen — Blackcurrant Ice / Fcuking Fab / Sweet Passion Fruit / Two Apple', price: '$50' },
                  { name: '3D Tips', sub: 'Hello Kitty / Popeye / Bart', price: '$18' },
                  { name: 'Ice Tip', sub: 'Chill your session', price: '$10' },
                  { name: 'Disposable Hose', sub: 'Single-use hygiene option', price: '$7' },
                ].map((a, i) => (
                  <motion.div
                    key={a.name}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: 0.32 + i * 0.04 }}
                    className="flex items-start justify-between gap-4 rounded-lg border border-white/[0.06] bg-white/[0.02] px-5 py-3.5 transition-colors duration-300 hover:border-primary/25"
                  >
                    <div className="min-w-0">
                      <p className="font-sans text-sm font-medium text-white">{a.name}</p>
                      <p className="font-sans text-xs text-white/35 leading-relaxed mt-0.5">{a.sub}</p>
                    </div>
                    <span className="font-sans text-sm font-bold text-white/60 shrink-0">{a.price}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

        /* ── Hookah: Signature Bowls ── card grid */
        ) : isHookah && tier3 === 'bowls' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {HOOKAH_BOWLS.map((bowl, i) => (
              <motion.div
                key={bowl.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22, delay: i * 0.05 }}
                className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-5 py-4 hover:border-primary/25 transition-colors duration-200"
              >
                <p className="font-sans text-sm font-semibold text-white mb-1.5">{bowl.name}</p>
                <div className="flex flex-wrap gap-1.5">
                  {bowl.sub?.split(' / ').map(flavor => (
                    <span
                      key={flavor}
                      className="rounded-md border border-primary/20 bg-primary/[0.06] px-2 py-0.5 font-sans text-[11px] text-primary/80"
                    >
                      {flavor}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

        /* ── Hookah: Flavor Library ── accordion by brand */
        ) : isHookah && tier3 === 'flavors' ? (
          <div className="space-y-3">
            {Object.entries(HOOKAH_FLAVORS).map(([key, brand], brandIdx) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: brandIdx * 0.08 }}
                className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-5 py-4 md:px-6 md:py-5 transition-colors duration-300 hover:border-primary/25"
              >
                <h4 className="font-sans text-xs uppercase tracking-[0.22em] text-primary/80 font-semibold mb-3">
                  {brand.label}
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {brand.list.split(' / ').map(f => (
                    <span
                      key={f}
                      className="rounded-md border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 font-sans text-xs text-white/55"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5">
            {items.map((item, idx) => (
              <ItemCard key={`${item.name}-${idx}`} item={item} index={idx} />
            ))}
          </div>
        )}

        {group.note && (
          <p className="mt-7 text-xs text-white/25 text-center leading-relaxed">{group.note}</p>
        )}
      </div>
  )
}

// ---------------------------------------------------------------------------
// Main export — progressive disclosure: only the next relevant tier appears
// ---------------------------------------------------------------------------
export function FullMenuMatrix() {
  const params = useSearchParams()

  // Seed initial state from URL query params written by the homepage cards.
  // e.g. /menu?t1=sips&t2=cocktails&t3=vol1
  const initT1 = (params.get('t1') as Tier1Val | null) ?? null
  const initT2 = params.get('t2')
  const initT3 = params.get('t3')

  const [tier1, setTier1] = useState<Tier1Val | null>(initT1)
  const [tier2, setTier2] = useState<string | null>(initT2)
  const [query, setQuery] = useState('')

  // Match against the item itself OR its category path — otherwise
  // searching a category name (e.g. "tequila", "spirits") returns nothing,
  // since individual item names/ingredients rarely repeat their own
  // category's name.
  const searchResults = query
    ? SEARCH_INDEX.filter((e) => matchesQuery(e.item, query) || e.path.toLowerCase().includes(query.toLowerCase()))
    : []

  // Determine which tier is the "active focus" — i.e. what the user
  // needs to select next. This drives which tier renders below.
  const needsTier3 =
    tier2 === 'cocktails' || tier2 === 'spirits' || tier2 === 'wine' || tier2 === 'hookah'

  // A deep link with t3 (e.g. from an old link that still carries it)
  // scrolls straight to that sub-group's section once it's rendered,
  // instead of gating content behind an extra click.
  useEffect(() => {
    if (!initT3) return
    const el = document.getElementById(initT3)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [initT3])

  function scrollToGroup(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // Breadcrumb trail
  const crumbs: { label: string; onClick: () => void }[] = []
  if (tier1) crumbs.push({ label: tier1 === 'sips' ? 'Sips' : 'Exhales', onClick: () => { setTier1(null); setTier2(null) } })
  if (tier2) {
    const t2label = [...SIPS_TIER2, ...EXHALES_TIER2].find(x => x.id === tier2)?.label ?? tier2
    crumbs.push({ label: t2label, onClick: () => setTier2(null) })
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-10 md:py-14">

      {/* Search — always available, finds items across the whole menu */}
      <div className="mx-auto mb-8 max-w-md">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the full menu — name or ingredient…"
            className="w-full rounded-full border border-white/[0.08] bg-white/[0.03] py-2.5 pl-11 pr-10 font-sans text-sm text-white placeholder:text-white/30 focus:border-primary/50 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {query ? (
        <SearchResults results={searchResults} query={query} />
      ) : (
      <>

      {/* Breadcrumb */}
      <Breadcrumb items={crumbs} />

      {/* ── Tier 1: Sips | Exhales ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key="t1"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="flex gap-3 md:gap-5 justify-center"
        >
          {(['sips', 'exhales'] as const).map((v) => (
            <Pill key={v} active={tier1 === v} size="lg" onClick={() => {
              if (tier1 === v) return
              setTier1(v)
              setTier2(null)
            }}>
              {v === 'sips'
                ? <><Wine className="w-4 h-4" /> Sips</>
                : <><Wind className="w-4 h-4" /> Exhales</>
              }
            </Pill>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* ── Tier 2: sub-category ── only after Tier 1 chosen */}
      <AnimatePresence>
        {tier1 && (
          <motion.div
            key={`t2-${tier1}`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="mt-6 md:mt-8">
              {/* Subtle separator */}
              <div className="mb-5 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
              <div className="flex flex-wrap gap-2 md:gap-3 justify-center">
                {(tier1 === 'sips' ? SIPS_TIER2 : EXHALES_TIER2).map((opt) => (
                  <Pill
                    key={opt.id}
                    active={tier2 === opt.id}
                    size="md"
                    onClick={() => {
                      if (tier2 === opt.id) return
                      setTier2(opt.id)
                    }}
                  >
                    {opt.label}
                  </Pill>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Tier 3: jump-nav — sub-groups all render below already, these
          just scroll to one. Not a selection gate anymore. */}
      <AnimatePresence>
        {tier1 && tier2 && needsTier3 && (
          <motion.div
            key={`t3-${tier2}`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="mt-5 md:mt-6">
              <div className="mb-4 h-px bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />
              <div className="flex flex-wrap gap-2 md:gap-2.5 justify-center">
                {tier2 === 'cocktails' && COCKTAIL_VOLS.map((p) => (
                  <Pill key={p.id} active={false} size="sm" onClick={() => scrollToGroup(p.id)}>
                    {p.label} {p.sub && <span className="text-[10px] opacity-70">— {p.sub}</span>}
                  </Pill>
                ))}
                {tier2 === 'spirits' && (
                  <div className="flex flex-col items-center gap-2 w-full">
                    {/* Row 1: Vodka · Tequila · Gin · Rum */}
                    <div className="flex flex-wrap justify-center gap-2 md:gap-2.5">
                      {SPIRIT_CATS.slice(0, 4).map((c) => (
                        <Pill key={c.id} active={false} size="sm" onClick={() => scrollToGroup(c.id)}>
                          {c.label}
                        </Pill>
                      ))}
                    </div>
                    {/* Row 2: Whiskey & Bourbon · Cognac & Scotch · Liqueurs — always on the same line */}
                    <div className="flex flex-wrap justify-center gap-2 md:gap-2.5">
                      {SPIRIT_CATS.slice(4).map((c) => (
                        <Pill key={c.id} active={false} size="sm" onClick={() => scrollToGroup(c.id)}>
                          {c.label}
                        </Pill>
                      ))}
                    </div>
                  </div>
                )}
                {tier2 === 'wine' && WINE_CATS.map((c) => (
                  <Pill key={c.id} active={false} size="sm" onClick={() => scrollToGroup(c.id)}>
                    {c.label}
                  </Pill>
                ))}
                {tier2 === 'hookah' && HOOKAH_TIER3.map((c) => (
                  <Pill key={c.id} active={false} size="sm" onClick={() => scrollToGroup(c.id)}>
                    {c.label}
                  </Pill>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Content ── once tier1+tier2 are chosen, every sub-group shows */}
      <AnimatePresence>
        {tier1 && tier2 && (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ContentPanel
              tier1={tier1}
              tier2={tier2}
            />
          </motion.div>
        )}
      </AnimatePresence>

      </>
      )}

    </div>
  )
}

function SearchResults({ results, query }: { results: SearchEntry[]; query: string }) {
  if (results.length === 0) {
    return (
      <p className="py-16 text-center font-sans text-sm text-white/40">
        Nothing matches &ldquo;{query}&rdquo; — try a different name or ingredient.
      </p>
    )
  }

  return (
    <div>
      <p className="mb-6 text-center font-sans text-[11px] uppercase tracking-[0.15em] text-white/25">
        {results.length} {results.length === 1 ? 'result' : 'results'}
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5">
        {results.map(({ item, path }, idx) => (
          <ItemCard key={`${path}-${item.name}-${idx}`} item={item} index={idx} categoryPath={path} />
        ))}
      </div>
    </div>
  )
}
