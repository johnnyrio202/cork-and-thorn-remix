export type EventItem = {
  id: string
  title: string
  date: string // ISO date yyyy-mm-dd
  day: string
  time: string
  category: 'R&B' | 'Hip-Hop' | 'Live Band' | 'Live Music' | 'DJ Set' | 'Open Mic' | 'Game Night' | 'Comedy'
  description: string
  price: number
  image: string
  artist: string
}

export const events: EventItem[] = [
  // ── July 2026 ──────────────────────────────────────────────────────────────
  // Mondays — Martini Mondays 8–10 PM (hosted by Las Vegas Distillery) + Industry Underground 10 PM–12 AM
  { id: 'jul-martini-6',  title: 'Martini Mondays',        date: '2026-07-06', day: 'Monday', time: '8:00 PM',  category: 'DJ Set',     description: 'Industry Night at Cork and Thorn. Hosted by Las Vegas Distillery — Lemon Drop Martini featuring LV Distillery Vodka, lemon juice & simple. Flavors: Strawberry, Mango, Lychee, Passion Fruit.', price: 0, image: '/images/flyer-martini-mondays.jpg', artist: 'Las Vegas Distillery' },
  { id: 'jul-mon-6',      title: 'Industry Underground',   date: '2026-07-06', day: 'Monday', time: '10:00 PM', category: 'Live Music',  description: "Las Vegas' elite industry night — a live curated music experience featuring the city's finest performers. A movie, every Monday.", price: 0, image: '/images/flyer-industry-underground.png', artist: 'Industry Underground' },
  { id: 'jul-martini-13', title: 'Martini Mondays',        date: '2026-07-13', day: 'Monday', time: '8:00 PM',  category: 'DJ Set',     description: 'Industry Night at Cork and Thorn. Hosted by Las Vegas Distillery — Lemon Drop Martini featuring LV Distillery Vodka, lemon juice & simple. Flavors: Strawberry, Mango, Lychee, Passion Fruit.', price: 0, image: '/images/flyer-martini-mondays.jpg', artist: 'Las Vegas Distillery' },
  { id: 'jul-mon-13',     title: 'Industry Underground',   date: '2026-07-13', day: 'Monday', time: '10:00 PM', category: 'Live Music',  description: "Las Vegas' elite industry night — a live curated music experience featuring the city's finest performers. A movie, every Monday.", price: 0, image: '/images/flyer-industry-underground.png', artist: 'Industry Underground' },
  { id: 'jul-martini-20', title: 'Martini Mondays',        date: '2026-07-20', day: 'Monday', time: '8:00 PM',  category: 'DJ Set',     description: 'Industry Night at Cork and Thorn. Hosted by Las Vegas Distillery — Lemon Drop Martini featuring LV Distillery Vodka, lemon juice & simple. Flavors: Strawberry, Mango, Lychee, Passion Fruit.', price: 0, image: '/images/flyer-martini-mondays.jpg', artist: 'Las Vegas Distillery' },
  { id: 'jul-mon-20',     title: 'Industry Underground',   date: '2026-07-20', day: 'Monday', time: '10:00 PM', category: 'Live Music',  description: "Las Vegas' elite industry night — a live curated music experience featuring the city's finest performers. A movie, every Monday.", price: 0, image: '/images/flyer-industry-underground.png', artist: 'Industry Underground' },
  { id: 'jul-martini-27', title: 'Martini Mondays',        date: '2026-07-27', day: 'Monday', time: '8:00 PM',  category: 'DJ Set',     description: 'Industry Night at Cork and Thorn. Hosted by Las Vegas Distillery — Lemon Drop Martini featuring LV Distillery Vodka, lemon juice & simple. Flavors: Strawberry, Mango, Lychee, Passion Fruit.', price: 0, image: '/images/flyer-martini-mondays.jpg', artist: 'Las Vegas Distillery' },
  { id: 'jul-mon-27',     title: 'Industry Underground',   date: '2026-07-27', day: 'Monday', time: '10:00 PM', category: 'Live Music',  description: "Las Vegas' elite industry night — a live curated music experience featuring the city's finest performers. A movie, every Monday.", price: 0, image: '/images/flyer-industry-underground.png', artist: 'Industry Underground' },
  // Tuesdays — Tequila Tuesdays, live music curated by Industry Underground
  { id: 'jul-tue-7',  title: 'Tequila Tuesdays', date: '2026-07-07', day: 'Tuesday', time: '8:00 PM', category: 'Live Music', description: 'A live music experience curated by Industry Underground. Premium tequila specials, agave flights, and a live band to match the heat.', price: 0, image: '/images/flyer-tequila-tuesday.png', artist: 'Industry Underground' },
  { id: 'jul-tue-14', title: 'Tequila Tuesdays', date: '2026-07-14', day: 'Tuesday', time: '8:00 PM', category: 'Live Music', description: 'A live music experience curated by Industry Underground. Premium tequila specials, agave flights, and a live band to match the heat.', price: 0, image: '/images/flyer-tequila-tuesday.png', artist: 'Industry Underground' },
  { id: 'jul-tue-21', title: 'Tequila Tuesdays', date: '2026-07-21', day: 'Tuesday', time: '8:00 PM', category: 'Live Music', description: 'A live music experience curated by Industry Underground. Premium tequila specials, agave flights, and a live band to match the heat.', price: 0, image: '/images/flyer-tequila-tuesday.png', artist: 'Industry Underground' },
  { id: 'jul-tue-28', title: 'Tequila Tuesdays', date: '2026-07-28', day: 'Tuesday', time: '8:00 PM', category: 'Live Music', description: 'A live music experience curated by Industry Underground. Premium tequila specials, agave flights, and a live band to match the heat.', price: 0, image: '/images/flyer-tequila-tuesday.png', artist: 'Industry Underground' },
  // Wednesdays — Karaoke Wednesday Night with Alli Starr & The Allikats
  { id: 'jul-wed-1',  title: 'Karaoke Wednesday Night', date: '2026-07-01', day: 'Wednesday', time: '9:00 PM', category: 'Open Mic', description: 'Live Band Karaoke with Alli Starr & The Allikats. Music by DJ Tone Armz. Sign up closes at 10PM. Cork and Thorn, every Wednesday.', price: 0, image: '/images/flyer-karaoke-wednesday.jpg', artist: 'Alli Starr & The Allikats' },
  { id: 'jul-wed-8',  title: 'Karaoke Wednesday Night', date: '2026-07-08', day: 'Wednesday', time: '9:00 PM', category: 'Open Mic', description: 'Live Band Karaoke with Alli Starr & The Allikats. Music by DJ Tone Armz. Sign up closes at 10PM. Cork and Thorn, every Wednesday.', price: 0, image: '/images/flyer-karaoke-wednesday.jpg', artist: 'Alli Starr & The Allikats' },
  { id: 'jul-wed-15', title: 'Karaoke Wednesday Night', date: '2026-07-15', day: 'Wednesday', time: '9:00 PM', category: 'Open Mic', description: 'Live Band Karaoke with Alli Starr & The Allikats. Music by DJ Tone Armz. Sign up closes at 10PM. Cork and Thorn, every Wednesday.', price: 0, image: '/images/flyer-karaoke-wednesday.jpg', artist: 'Alli Starr & The Allikats' },
  { id: 'jul-wed-22', title: 'Karaoke Wednesday Night', date: '2026-07-22', day: 'Wednesday', time: '9:00 PM', category: 'Open Mic', description: 'Live Band Karaoke with Alli Starr & The Allikats. Music by DJ Tone Armz. Sign up closes at 10PM. Cork and Thorn, every Wednesday.', price: 0, image: '/images/flyer-karaoke-wednesday.jpg', artist: 'Alli Starr & The Allikats' },
  { id: 'jul-wed-29', title: 'Karaoke Wednesday Night', date: '2026-07-29', day: 'Wednesday', time: '9:00 PM', category: 'Open Mic', description: 'Live Band Karaoke with Alli Starr & The Allikats. Music by DJ Tone Armz. Sign up closes at 10PM. Cork and Thorn, every Wednesday.', price: 0, image: '/images/flyer-karaoke-wednesday.jpg', artist: 'Alli Starr & The Allikats' },
  // Thursdays — alternating: Thursday Night Vibes (Jul 2, 16, 30) vs R&B Thursday (Jul 9, 23)
  { id: 'jul-thu-2',  title: 'Thursday Night Vibes', date: '2026-07-02', day: 'Thursday', time: '8:00 PM', category: 'Live Music', description: 'Good Spirits. Dope Vibes. Co-hosted by Nino Breeze w/ Coso Live & The Squad. Live music performance 9PM–11PM. Hookah, good spirits. Every other Thursday at Cork and Thorn, 8PM–12AM.', price: 0, image: '/images/flyer-thursday-night-vibes.jpg', artist: 'Nino Breeze & Coso Live' },
  { id: 'jul-thu-9',  title: 'R&B Thursday',         date: '2026-07-09', day: 'Thursday', time: '8:00 PM', category: 'R&B',        description: 'The ultimate midweek vibe — live music by Coso & Friends. Doors open 8PM–12AM at Cork and Thorn.', price: 0, image: '/images/flyer-rnb-thursday.jpg', artist: 'Coso & Friends' },
  { id: 'jul-thu-16', title: 'Thursday Night Vibes', date: '2026-07-16', day: 'Thursday', time: '8:00 PM', category: 'Live Music', description: 'Good Spirits. Dope Vibes. Co-hosted by Nino Breeze w/ Coso Live & The Squad. Live music performance 9PM–11PM. Hookah, good spirits. Every other Thursday at Cork and Thorn, 8PM–12AM.', price: 0, image: '/images/flyer-thursday-night-vibes.jpg', artist: 'Nino Breeze & Coso Live' },
  { id: 'jul-thu-23', title: 'R&B Thursday',         date: '2026-07-23', day: 'Thursday', time: '8:00 PM', category: 'R&B',        description: 'The ultimate midweek vibe — live music by Coso & Friends. Doors open 8PM–12AM at Cork and Thorn.', price: 0, image: '/images/flyer-rnb-thursday.jpg', artist: 'Coso & Friends' },
  { id: 'jul-thu-30', title: 'Thursday Night Vibes', date: '2026-07-30', day: 'Thursday', time: '8:00 PM', category: 'Live Music', description: 'Good Spirits. Dope Vibes. Co-hosted by Nino Breeze w/ Coso Live & The Squad. Live music performance 9PM–11PM. Hookah, good spirits. Every other Thursday at Cork and Thorn, 8PM–12AM.', price: 0, image: '/images/flyer-thursday-night-vibes.jpg', artist: 'Nino Breeze & Coso Live' },
  // Fridays — Uncork'd Comedy Jam every other Friday (Jul 31, Aug 14, Aug 28...) + Fresh Fridays every Friday (11 PM – close)
  { id: 'jul-fri-3',    title: 'Fresh Fridays',          date: '2026-07-03', day: 'Friday',    time: '11:00 PM', category: 'DJ Set',   description: 'Hosted by Kuntry601 with DJs Tony Pro & ToneArmz — neo-soul, hip-hop, Afrobeats and everything in between. Bottle sections & hookah packages.',  price: 20, image: '/images/flyer-fresh-friday.png', artist: 'DJ Tone Arms & Kuntry601' },
  { id: 'jul-fri-10',   title: 'Fresh Fridays',          date: '2026-07-10', day: 'Friday',    time: '11:00 PM', category: 'DJ Set',   description: 'Hosted by Kuntry601 with DJs Tony Pro & ToneArmz — neo-soul, hip-hop, Afrobeats and everything in between. Bottle sections & hookah packages.',  price: 20, image: '/images/flyer-fresh-friday.png', artist: 'DJ Tone Arms & Kuntry601' },
  { id: 'jul-fri-17',   title: 'Fresh Fridays',          date: '2026-07-17', day: 'Friday',    time: '11:00 PM', category: 'DJ Set',   description: 'Hosted by Kuntry601 with DJs Tony Pro & ToneArmz — neo-soul, hip-hop, Afrobeats and everything in between. Bottle sections & hookah packages.',  price: 20, image: '/images/flyer-fresh-friday.png', artist: 'DJ Tone Arms & Kuntry601' },
  { id: 'jul-fri-24',   title: 'Fresh Fridays',          date: '2026-07-24', day: 'Friday',    time: '11:00 PM', category: 'DJ Set',   description: 'Hosted by Kuntry601 with DJs Tony Pro & ToneArmz — neo-soul, hip-hop, Afrobeats and everything in between. Bottle sections & hookah packages.',  price: 20, image: '/images/flyer-fresh-friday.png', artist: 'DJ Tone Arms & Kuntry601' },
  { id: 'jul-comedy-31', title: "Uncork'd Comedy Jam",   date: '2026-07-31', day: 'Friday',    time: '8:00 PM',  category: 'Comedy',   description: 'SIXX8 THA GR68T presents the dopest comedy show in Las Vegas. Headliner: Mario Tory. No cover, 21+, 2-item minimum. Music by DJ Tone Armz.', price: 0,  image: '/images/flyer-comedy-jam.png',  artist: 'SIXX8 THA GR68T' },
  { id: 'jul-fri-31',   title: 'Fresh Fridays',          date: '2026-07-31', day: 'Friday',    time: '11:00 PM', category: 'DJ Set',   description: 'Hosted by Kuntry601 with DJs Tony Pro & ToneArmz — neo-soul, hip-hop, Afrobeats and everything in between. Bottle sections & hookah packages.',  price: 20, image: '/images/flyer-fresh-friday.png', artist: 'DJ Tone Arms & Kuntry601' },
  // Saturdays — Sultry Saturday 9PM–11PM (Alli Starr & The Allikats) + Super Dope Saturdays 11:30PM–2:30AM (DJ Fizz & DJ Needle$)
  { id: 'jul-sultry-4',  title: 'Sultry Saturday', date: '2026-07-04', day: 'Saturday', time: '9:00 PM',  category: 'Live Band', description: 'Smooth Music. Good Vibes. Timeless Nights. Alli Starr & The Allikats bring soulful live music to Cork and Thorn. Cocktails, hookah, cigars. Every Saturday 9PM–11PM.', price: 0,  image: '/images/flyer-sultry-saturday.jpg', artist: 'Alli Starr & The Allikats' },
  { id: 'jul-sat-4',    title: 'Super Dope Saturdays', date: '2026-07-04', day: 'Saturday', time: '11:30 PM', category: 'Hip-Hop',   description: 'VIP Group presents Super Dope Saturdays — Hip-Hop, R&B, Reggae & Afrobeats. Music by DJ Fizz & DJ Needle$. Every Saturday at Cork Thorn, 11:30PM–2:30AM.', price: 35, image: '/images/flyer-super-dope-saturdays.jpg', artist: 'DJ Fizz & DJ Needle$' },
  { id: 'jul-sultry-11', title: 'Sultry Saturday', date: '2026-07-11', day: 'Saturday', time: '9:00 PM',  category: 'Live Band', description: 'Smooth Music. Good Vibes. Timeless Nights. Alli Starr & The Allikats bring soulful live music to Cork and Thorn. Cocktails, hookah, cigars. Every Saturday 9PM–11PM.', price: 0,  image: '/images/flyer-sultry-saturday.jpg', artist: 'Alli Starr & The Allikats' },
  { id: 'jul-sat-11',   title: 'Super Dope Saturdays', date: '2026-07-11', day: 'Saturday', time: '11:30 PM', category: 'Hip-Hop',   description: 'VIP Group presents Super Dope Saturdays — Hip-Hop, R&B, Reggae & Afrobeats. Music by DJ Fizz & DJ Needle$. Every Saturday at Cork Thorn, 11:30PM–2:30AM.', price: 35, image: '/images/flyer-super-dope-saturdays.jpg', artist: 'DJ Fizz & DJ Needle$' },
  { id: 'jul-sultry-18', title: 'Sultry Saturday', date: '2026-07-18', day: 'Saturday', time: '9:00 PM',  category: 'Live Band', description: 'Smooth Music. Good Vibes. Timeless Nights. Alli Starr & The Allikats bring soulful live music to Cork and Thorn. Cocktails, hookah, cigars. Every Saturday 9PM–11PM.', price: 0,  image: '/images/flyer-sultry-saturday.jpg', artist: 'Alli Starr & The Allikats' },
  { id: 'jul-sat-18',   title: 'Super Dope Saturdays', date: '2026-07-18', day: 'Saturday', time: '11:30 PM', category: 'Hip-Hop',   description: 'VIP Group presents Super Dope Saturdays — Hip-Hop, R&B, Reggae & Afrobeats. Music by DJ Fizz & DJ Needle$. Every Saturday at Cork Thorn, 11:30PM–2:30AM.', price: 35, image: '/images/flyer-super-dope-saturdays.jpg', artist: 'DJ Fizz & DJ Needle$' },
  { id: 'jul-sultry-25', title: 'Sultry Saturday', date: '2026-07-25', day: 'Saturday', time: '9:00 PM',  category: 'Live Band', description: 'Smooth Music. Good Vibes. Timeless Nights. Alli Starr & The Allikats bring soulful live music to Cork and Thorn. Cocktails, hookah, cigars. Every Saturday 9PM–11PM.', price: 0,  image: '/images/flyer-sultry-saturday.jpg', artist: 'Alli Starr & The Allikats' },
  { id: 'jul-sat-25',   title: 'Super Dope Saturdays', date: '2026-07-25', day: 'Saturday', time: '11:30 PM', category: 'Hip-Hop',   description: 'VIP Group presents Super Dope Saturdays — Hip-Hop, R&B, Reggae & Afrobeats. Music by DJ Fizz & DJ Needle$. Every Saturday at Cork Thorn, 11:30PM–2:30AM.', price: 35, image: '/images/flyer-super-dope-saturdays.jpg', artist: 'DJ Fizz & DJ Needle$' },
  // Sundays — Kream Sundaes by Syndicate Media — live performance + curated DJ sets
  { id: 'jul-sun-5',  title: 'Kream Sundaes', date: '2026-07-05', day: 'Sunday', time: '8:00 PM', category: 'Live Music', description: 'Syndicate Media presents Kream Sundaes — live performances and curated DJ sets to close the weekend right. Premium hookah, good vibes, smooth energy at Cork and Thorn.', price: 0, image: '/images/flyer-rnb-sundays.jpg', artist: 'Syndicate Media' },
  { id: 'jul-sun-12', title: 'Kream Sundaes', date: '2026-07-12', day: 'Sunday', time: '8:00 PM', category: 'Live Music', description: 'Syndicate Media presents Kream Sundaes — live performances and curated DJ sets to close the weekend right. Premium hookah, good vibes, smooth energy at Cork and Thorn.', price: 0, image: '/images/flyer-rnb-sundays.jpg', artist: 'Syndicate Media' },
  { id: 'jul-sun-19', title: 'Kream Sundaes', date: '2026-07-19', day: 'Sunday', time: '8:00 PM', category: 'Live Music', description: 'Syndicate Media presents Kream Sundaes — live performances and curated DJ sets to close the weekend right. Premium hookah, good vibes, smooth energy at Cork and Thorn.', price: 0, image: '/images/flyer-rnb-sundays.jpg', artist: 'Syndicate Media' },
  { id: 'jul-sun-26', title: 'Kream Sundaes', date: '2026-07-26', day: 'Sunday', time: '8:00 PM', category: 'Live Music', description: 'Syndicate Media presents Kream Sundaes — live performances and curated DJ sets to close the weekend right. Premium hookah, good vibes, smooth energy at Cork and Thorn.', price: 0, image: '/images/flyer-rnb-sundays.jpg', artist: 'Syndicate Media' },

  // ── August 2026 ────────────────────────────────────────────────────────────
  // Sundays — Kream Sundaes by Syndicate Media (Aug 2, 9, 23) + For the Love of R&B every other Sun (Aug 16, 30)
  { id: 'aug-sun-2',  title: 'Kreme Sunday',              date: '2026-08-02', day: 'Sunday', time: '5:00 PM', category: 'DJ Set',     description: 'Presented by Syndicate Media Group. Kreme Sunday featuring DJ Infinite — Going Away Party. Live at Cork and Thorn. Doors open at 5.', price: 0, image: '/images/flyer-kreme-sunday-aug.jpg', artist: 'DJ Infinite' },
  { id: 'aug-sun-9',  title: 'Kreme Sunday',              date: '2026-08-09', day: 'Sunday', time: '5:00 PM', category: 'DJ Set',     description: 'Presented by Syndicate Media Group. Kreme Sunday featuring DJ Jackpot. Live at Cork and Thorn. Doors open at 5.', price: 0, image: '/images/flyer-kreme-sunday-aug.jpg', artist: 'DJ Jackpot' },
  { id: 'aug-sun-16', title: 'For the Love of R&B',       date: '2026-08-16', day: 'Sunday', time: '5:00 PM', category: 'R&B',        description: 'Presented by Syndicate Media Group. For the Love of R&B — hosted by Kuntry 601. Live at Cork and Thorn. Doors open at 5.', price: 0, image: '/images/flyer-rnb-sundays.jpg',       artist: 'Kuntry 601' },
  { id: 'aug-sun-23', title: 'Kreme Sunday',              date: '2026-08-23', day: 'Sunday', time: '5:00 PM', category: 'DJ Set',     description: 'Presented by Syndicate Media Group. Kreme Sunday featuring King Alski & T-Qron Listening Mixer. Live at Cork and Thorn. Doors open at 5.', price: 0, image: '/images/flyer-kreme-sunday-aug.jpg', artist: 'King Alski & T-Qron' },
  { id: 'aug-sun-30', title: 'For the Love of R&B',       date: '2026-08-30', day: 'Sunday', time: '5:00 PM', category: 'R&B',        description: 'Presented by Syndicate Media Group. For the Love of R&B — hosted by Kuntry 601. Live at Cork and Thorn. Doors open at 5.', price: 0, image: '/images/flyer-rnb-sundays.jpg',       artist: 'Kuntry 601' },
  // Mondays — Martini Mondays 8–10 PM + Industry Underground 10 PM–12 AM
  { id: 'aug-martini-3',  title: 'Martini Mondays',      date: '2026-08-03', day: 'Monday', time: '8:00 PM',  category: 'DJ Set',    description: 'Industry Night at Cork and Thorn. Hosted by Las Vegas Distillery — Lemon Drop Martini featuring LV Distillery Vodka, lemon juice & simple. Flavors: Strawberry, Mango, Lychee, Passion Fruit.', price: 0, image: '/images/flyer-martini-mondays.jpg', artist: 'Las Vegas Distillery' },
  { id: 'aug-mon-3',      title: "'92 Red Light Sessions", date: '2026-08-03', day: 'Monday', time: '10:00 PM', category: 'Live Music', description: "Ronnie Thomas presents '92 Red Light Sessions — featuring Dre Woods, Cimirriar Deniece, Soula & Falcon with the band. Industry Underground x Cork n Thorn, August 3rd 2026.", price: 0, image: '/images/flyer-92-red-light.jpg', artist: 'Ronnie Thomas' },
  { id: 'aug-martini-10', title: 'Martini Mondays',      date: '2026-08-10', day: 'Monday', time: '8:00 PM',  category: 'DJ Set',    description: 'Industry Night at Cork and Thorn. Hosted by Las Vegas Distillery — Lemon Drop Martini featuring LV Distillery Vodka, lemon juice & simple. Flavors: Strawberry, Mango, Lychee, Passion Fruit.', price: 0, image: '/images/flyer-martini-mondays.jpg', artist: 'Las Vegas Distillery' },
  { id: 'aug-mon-10',     title: 'Industry Underground', date: '2026-08-10', day: 'Monday', time: '10:00 PM', category: 'Live Music', description: "Las Vegas' elite industry night — a live curated music experience featuring the city's finest performers. A movie, every Monday.", price: 0, image: '/images/flyer-industry-underground.png', artist: 'Industry Underground' },
  { id: 'aug-martini-17', title: 'Martini Mondays',      date: '2026-08-17', day: 'Monday', time: '8:00 PM',  category: 'DJ Set',    description: 'Industry Night at Cork and Thorn. Hosted by Las Vegas Distillery — Lemon Drop Martini featuring LV Distillery Vodka, lemon juice & simple. Flavors: Strawberry, Mango, Lychee, Passion Fruit.', price: 0, image: '/images/flyer-martini-mondays.jpg', artist: 'Las Vegas Distillery' },
  { id: 'aug-mon-17',     title: 'Industry Underground', date: '2026-08-17', day: 'Monday', time: '10:00 PM', category: 'Live Music', description: "Las Vegas' elite industry night — a live curated music experience featuring the city's finest performers. A movie, every Monday.", price: 0, image: '/images/flyer-industry-underground.png', artist: 'Industry Underground' },
  { id: 'aug-martini-24', title: 'Martini Mondays',      date: '2026-08-24', day: 'Monday', time: '8:00 PM',  category: 'DJ Set',    description: 'Industry Night at Cork and Thorn. Hosted by Las Vegas Distillery — Lemon Drop Martini featuring LV Distillery Vodka, lemon juice & simple. Flavors: Strawberry, Mango, Lychee, Passion Fruit.', price: 0, image: '/images/flyer-martini-mondays.jpg', artist: 'Las Vegas Distillery' },
  { id: 'aug-mon-24',     title: 'Industry Underground', date: '2026-08-24', day: 'Monday', time: '10:00 PM', category: 'Live Music', description: "Las Vegas' elite industry night — a live curated music experience featuring the city's finest performers. A movie, every Monday.", price: 0, image: '/images/flyer-industry-underground.png', artist: 'Industry Underground' },
  // Tuesdays — live music curated by Industry Underground
  { id: 'aug-tue-4',  title: 'Tequila Tuesdays', date: '2026-08-04', day: 'Tuesday', time: '8:00 PM', category: 'Live Music', description: 'A live music experience curated by Industry Underground. Premium tequila specials, agave flights, and a live band to match the heat.', price: 0, image: '/images/flyer-tequila-tuesday.png', artist: 'Industry Underground' },
  { id: 'aug-tue-11', title: 'Tequila Tuesdays', date: '2026-08-11', day: 'Tuesday', time: '8:00 PM', category: 'Live Music', description: 'A live music experience curated by Industry Underground. Premium tequila specials, agave flights, and a live band to match the heat.', price: 0, image: '/images/flyer-tequila-tuesday.png', artist: 'Industry Underground' },
  { id: 'aug-tue-18', title: 'Tequila Tuesdays', date: '2026-08-18', day: 'Tuesday', time: '8:00 PM', category: 'Live Music', description: 'A live music experience curated by Industry Underground. Premium tequila specials, agave flights, and a live band to match the heat.', price: 0, image: '/images/flyer-tequila-tuesday.png', artist: 'Industry Underground' },
  { id: 'aug-tue-25', title: 'Tequila Tuesdays', date: '2026-08-25', day: 'Tuesday', time: '8:00 PM', category: 'Live Music', description: 'A live music experience curated by Industry Underground. Premium tequila specials, agave flights, and a live band to match the heat.', price: 0, image: '/images/flyer-tequila-tuesday.png', artist: 'Industry Underground' },
  // Wednesdays — Karaoke Wednesday Night
  { id: 'aug-wed-5',  title: 'Karaoke Wednesday Night', date: '2026-08-05', day: 'Wednesday', time: '9:00 PM', category: 'Open Mic', description: 'Live Band Karaoke with Alli Starr & The Allikats. Music by DJ Tone Armz. Sign up closes at 10PM. Cork and Thorn, every Wednesday.', price: 0, image: '/images/flyer-karaoke-wednesday.jpg', artist: 'Alli Starr & The Allikats' },
  { id: 'aug-wed-12', title: 'Karaoke Wednesday Night', date: '2026-08-12', day: 'Wednesday', time: '9:00 PM', category: 'Open Mic', description: 'Live Band Karaoke with Alli Starr & The Allikats. Music by DJ Tone Armz. Sign up closes at 10PM. Cork and Thorn, every Wednesday.', price: 0, image: '/images/flyer-karaoke-wednesday.jpg', artist: 'Alli Starr & The Allikats' },
  { id: 'aug-wed-19', title: 'Karaoke Wednesday Night', date: '2026-08-19', day: 'Wednesday', time: '9:00 PM', category: 'Open Mic', description: 'Live Band Karaoke with Alli Starr & The Allikats. Music by DJ Tone Armz. Sign up closes at 10PM. Cork and Thorn, every Wednesday.', price: 0, image: '/images/flyer-karaoke-wednesday.jpg', artist: 'Alli Starr & The Allikats' },
  { id: 'aug-wed-26', title: 'Karaoke Wednesday Night', date: '2026-08-26', day: 'Wednesday', time: '9:00 PM', category: 'Open Mic', description: 'Live Band Karaoke with Alli Starr & The Allikats. Music by DJ Tone Armz. Sign up closes at 10PM. Cork and Thorn, every Wednesday.', price: 0, image: '/images/flyer-karaoke-wednesday.jpg', artist: 'Alli Starr & The Allikats' },
  // Thursdays — alternating: Thursday Night Vibes (Aug 6, 20) vs R&B Thursday (Aug 13, 27)
  { id: 'aug-thu-6',  title: 'Thursday Night Vibes', date: '2026-08-06', day: 'Thursday', time: '8:00 PM', category: 'Live Music', description: 'Good Spirits. Dope Vibes. Co-hosted by Nino Breeze w/ Coso Live & The Squad. Live music performance 9PM–11PM. Hookah, good spirits. Every other Thursday at Cork and Thorn, 8PM–12AM.', price: 0, image: '/images/flyer-thursday-night-vibes.jpg', artist: 'Nino Breeze & Coso Live' },
  { id: 'aug-thu-13', title: 'R&B Thursday',         date: '2026-08-13', day: 'Thursday', time: '8:00 PM', category: 'R&B',        description: 'The ultimate midweek vibe — live music by Coso & Friends. Doors open 8PM–12AM at Cork and Thorn.', price: 0, image: '/images/flyer-rnb-thursday.jpg', artist: 'Coso & Friends' },
  { id: 'aug-thu-20', title: 'Thursday Night Vibes', date: '2026-08-20', day: 'Thursday', time: '8:00 PM', category: 'Live Music', description: 'Good Spirits. Dope Vibes. Co-hosted by Nino Breeze w/ Coso Live & The Squad. Live music performance 9PM–11PM. Hookah, good spirits. Every other Thursday at Cork and Thorn, 8PM–12AM.', price: 0, image: '/images/flyer-thursday-night-vibes.jpg', artist: 'Nino Breeze & Coso Live' },
  { id: 'aug-thu-27', title: 'R&B Thursday',         date: '2026-08-27', day: 'Thursday', time: '8:00 PM', category: 'R&B',        description: 'The ultimate midweek vibe — live music by Coso & Friends. Doors open 8PM–12AM at Cork and Thorn.', price: 0, image: '/images/flyer-rnb-thursday.jpg', artist: 'Coso & Friends' },
  // Fridays — Uncork'd every other Fri (Aug 14, Aug 28) + Fresh Fridays every Fri (11 PM – close)
  { id: 'aug-fri-7',    title: 'Fresh Fridays',          date: '2026-08-07', day: 'Friday',    time: '11:00 PM', category: 'DJ Set',  description: 'Hosted by Kuntry601 with DJs Tony Pro & ToneArmz — neo-soul, hip-hop, Afrobeats and everything in between. Bottle sections & hookah packages.',  price: 20, image: '/images/flyer-fresh-friday.png', artist: 'DJ Tone Arms & Kuntry601' },
  { id: 'aug-comedy-14', title: "Uncork'd Comedy Jam",   date: '2026-08-14', day: 'Friday',    time: '8:00 PM',  category: 'Comedy',  description: 'SIXX8 THA GR68T presents the dopest comedy show in Las Vegas. No cover, 21+, 2-item minimum. Music by DJ Tone Armz.',                    price: 0,  image: '/images/flyer-comedy-jam.png',  artist: 'SIXX8 THA GR68T' },
  { id: 'aug-fri-14',   title: 'Fresh Fridays',          date: '2026-08-14', day: 'Friday',    time: '11:00 PM', category: 'DJ Set',  description: 'Hosted by Kuntry601 with DJs Tony Pro & ToneArmz — neo-soul, hip-hop, Afrobeats and everything in between. Bottle sections & hookah packages.',  price: 20, image: '/images/flyer-fresh-friday.png', artist: 'DJ Tone Arms & Kuntry601' },
  { id: 'aug-fri-21',   title: 'Fresh Fridays',          date: '2026-08-21', day: 'Friday',    time: '11:00 PM', category: 'DJ Set',  description: 'Hosted by Kuntry601 with DJs Tony Pro & ToneArmz — neo-soul, hip-hop, Afrobeats and everything in between. Bottle sections & hookah packages.',  price: 20, image: '/images/flyer-fresh-friday.png', artist: 'DJ Tone Arms & Kuntry601' },
  { id: 'aug-comedy-28', title: "Uncork'd Comedy Jam",   date: '2026-08-28', day: 'Friday',    time: '8:00 PM',  category: 'Comedy',  description: 'SIXX8 THA GR68T presents the dopest comedy show in Las Vegas. No cover, 21+, 2-item minimum. Music by DJ Tone Armz.',                    price: 0,  image: '/images/flyer-comedy-jam.png',  artist: 'SIXX8 THA GR68T' },
  { id: 'aug-fri-28',   title: 'Fresh Fridays',          date: '2026-08-28', day: 'Friday',    time: '11:00 PM', category: 'DJ Set',  description: 'Hosted by Kuntry601 with DJs Tony Pro & ToneArmz — neo-soul, hip-hop, Afrobeats and everything in between. Bottle sections & hookah packages.',  price: 20, image: '/images/flyer-fresh-friday.png', artist: 'DJ Tone Arms & Kuntry601' },
  // Saturdays — Sultry Saturday 9PM–11PM + Super Dope Saturdays 11:30PM–2:30AM
  { id: 'aug-sultry-1',  title: 'Sultry Saturday', date: '2026-08-01', day: 'Saturday', time: '9:00 PM',  category: 'Live Band', description: 'Smooth Music. Good Vibes. Timeless Nights. Alli Starr & The Allikats bring soulful live music to Cork and Thorn. Cocktails, hookah, cigars. Every Saturday 9PM–11PM.', price: 0,  image: '/images/flyer-sultry-saturday.jpg', artist: 'Alli Starr & The Allikats' },
  { id: 'aug-sat-1',    title: 'Super Dope Saturdays', date: '2026-08-01', day: 'Saturday', time: '11:30 PM', category: 'Hip-Hop',   description: 'VIP Group presents Super Dope Saturdays — Hip-Hop, R&B, Reggae & Afrobeats. Music by DJ Fizz & DJ Needle$. Every Saturday at Cork Thorn, 11:30PM–2:30AM.', price: 35, image: '/images/flyer-super-dope-saturdays.jpg', artist: 'DJ Fizz & DJ Needle$' },
  { id: 'aug-sultry-8',  title: 'Sultry Saturday', date: '2026-08-08', day: 'Saturday', time: '9:00 PM',  category: 'Live Band', description: 'Smooth Music. Good Vibes. Timeless Nights. Alli Starr & The Allikats bring soulful live music to Cork and Thorn. Cocktails, hookah, cigars. Every Saturday 9PM–11PM.', price: 0,  image: '/images/flyer-sultry-saturday.jpg', artist: 'Alli Starr & The Allikats' },
  { id: 'aug-sat-8',    title: 'Super Dope Saturdays', date: '2026-08-08', day: 'Saturday', time: '11:30 PM', category: 'Hip-Hop',   description: 'VIP Group presents Super Dope Saturdays — Hip-Hop, R&B, Reggae & Afrobeats. Music by DJ Fizz & DJ Needle$. Every Saturday at Cork Thorn, 11:30PM–2:30AM.', price: 35, image: '/images/flyer-super-dope-saturdays.jpg', artist: 'DJ Fizz & DJ Needle$' },
  { id: 'aug-sultry-15', title: 'Sultry Saturday', date: '2026-08-15', day: 'Saturday', time: '9:00 PM',  category: 'Live Band', description: 'Smooth Music. Good Vibes. Timeless Nights. Alli Starr & The Allikats bring soulful live music to Cork and Thorn. Cocktails, hookah, cigars. Every Saturday 9PM–11PM.', price: 0,  image: '/images/flyer-sultry-saturday.jpg', artist: 'Alli Starr & The Allikats' },
  { id: 'aug-sat-15',   title: 'Super Dope Saturdays', date: '2026-08-15', day: 'Saturday', time: '11:30 PM', category: 'Hip-Hop',   description: 'VIP Group presents Super Dope Saturdays — Hip-Hop, R&B, Reggae & Afrobeats. Music by DJ Fizz & DJ Needle$. Every Saturday at Cork Thorn, 11:30PM–2:30AM.', price: 35, image: '/images/flyer-super-dope-saturdays.jpg', artist: 'DJ Fizz & DJ Needle$' },
  { id: 'aug-sultry-22', title: 'Sultry Saturday', date: '2026-08-22', day: 'Saturday', time: '9:00 PM',  category: 'Live Band', description: 'Smooth Music. Good Vibes. Timeless Nights. Alli Starr & The Allikats bring soulful live music to Cork and Thorn. Cocktails, hookah, cigars. Every Saturday 9PM–11PM.', price: 0,  image: '/images/flyer-sultry-saturday.jpg', artist: 'Alli Starr & The Allikats' },
  { id: 'aug-sat-22',   title: 'Super Dope Saturdays', date: '2026-08-22', day: 'Saturday', time: '11:30 PM', category: 'Hip-Hop',   description: 'VIP Group presents Super Dope Saturdays — Hip-Hop, R&B, Reggae & Afrobeats. Music by DJ Fizz & DJ Needle$. Every Saturday at Cork Thorn, 11:30PM��2:30AM.', price: 35, image: '/images/flyer-super-dope-saturdays.jpg', artist: 'DJ Fizz & DJ Needle$' },
  { id: 'aug-sultry-29', title: 'Sultry Saturday', date: '2026-08-29', day: 'Saturday', time: '9:00 PM',  category: 'Live Band', description: 'Smooth Music. Good Vibes. Timeless Nights. Alli Starr & The Allikats bring soulful live music to Cork and Thorn. Cocktails, hookah, cigars. Every Saturday 9PM–11PM.', price: 0,  image: '/images/flyer-sultry-saturday.jpg', artist: 'Alli Starr & The Allikats' },
  { id: 'aug-sat-29',   title: 'Super Dope Saturdays', date: '2026-08-29', day: 'Saturday', time: '11:30 PM', category: 'Hip-Hop',   description: 'VIP Group presents Super Dope Saturdays — Hip-Hop, R&B, Reggae & Afrobeats. Music by DJ Fizz & DJ Needle$. Every Saturday at Cork Thorn, 11:30PM–2:30AM.', price: 35, image: '/images/flyer-super-dope-saturdays.jpg', artist: 'DJ Fizz & DJ Needle$' },
]

export type MenuItem = {
  name: string
  description: string
  price: string
}

export const cocktailMenu: { category: string; items: MenuItem[] }[] = [
  {
    category: 'Signature Cocktails',
    items: [
      { name: 'The Thorn', description: 'Mezcal, blackberry, lime, chili tincture', price: '$18' },
      { name: 'Neon Nights', description: 'Vodka, lychee, dragonfruit, prosecco float', price: '$17' },
      { name: 'Velvet Room', description: 'Bourbon, fig, black walnut bitters, smoked', price: '$19' },
      { name: 'Midnight Bloom', description: 'Gin, butterfly pea, elderflower, citrus', price: '$16' },
    ],
  },
  {
    category: 'Top Shelf & Spirits',
    items: [
      { name: 'Reserve Whiskey Flight', description: 'Three pours of rare, aged selections', price: '$45' },
      { name: 'Premium Tequila', description: 'Añejo poured neat or on the rocks', price: '$22' },
      { name: 'Champagne by the Glass', description: 'Rotating grower-producer selection', price: '$24' },
    ],
  },
  {
    category: 'Wine & Beer',
    items: [
      { name: 'House Red / White', description: 'Sommelier-selected by the glass', price: '$13' },
      { name: 'Sparkling Rosé', description: 'Crisp, dry, and endlessly drinkable', price: '$15' },
      { name: 'Craft & Import Bottles', description: 'Rotating local and imported lineup', price: '$9' },
    ],
  },
]

export const hookahMenu: { category: string; items: MenuItem[] }[] = [
  {
    category: 'Premium Hookah',
    items: [
      { name: 'Classic Bowl', description: 'Choose from 20+ premium flavors', price: '$45' },
      { name: 'Signature Fruit Bowl', description: 'Hand-carved pineapple or grapefruit', price: '$65' },
      { name: 'Ice Hose Upgrade', description: 'Chilled, smooth, every draw', price: '$15' },
    ],
  },
]

export const foodMenu: { category: string; items: MenuItem[] }[] = [
  {
    category: 'Shareable Bites',
    items: [
      { name: 'Loaded Truffle Fries', description: 'Parmesan, truffle oil, chives, aioli', price: '$14' },
      { name: 'Wagyu Sliders', description: 'Trio of mini burgers, caramelized onion', price: '$18' },
      { name: 'Honey Hot Wings', description: 'Crispy wings, hot honey, blue cheese', price: '$16' },
      { name: 'Lobster Mac Bites', description: 'Crispy fried mac, lobster, cajun aioli', price: '$17' },
    ],
  },
  {
    category: 'Late Night',
    items: [
      { name: 'Birria Tacos', description: 'Three tacos, consommé, onion, cilantro', price: '$15' },
      { name: 'Charcuterie Board', description: 'Cured meats, cheeses, honey, jam', price: '$24' },
      { name: 'Street Corn Dip', description: 'Warm elote dip, house tortilla chips', price: '$12' },
    ],
  },
]

export type Product = {
  id: string
  name: string
  price: number
  image: string
  category: string
  description: string
}

export const products: Product[] = [
  {
    id: 'tee-logo',
    name: 'Neon Logo Tee',
    price: 38,
    image: '/images/merch-tee.png',
    category: 'Apparel',
    description: 'Premium heavyweight cotton tee with neon-pink embroidered logo.',
  },
  {
    id: 'hoodie',
    name: 'After Dark Hoodie',
    price: 72,
    image: '/images/merch-hoodie.png',
    category: 'Apparel',
    description: 'Heavyweight fleece hoodie with minimal embroidered crest.',
  },
  {
    id: 'snapback',
    name: 'Thorn Snapback',
    price: 34,
    image: '/images/merch-hat.png',
    category: 'Accessories',
    description: 'Structured snapback with raised neon embroidery.',
  },
  {
    id: 'rocks-glass',
    name: 'Branded Rocks Glass',
    price: 22,
    image: '/images/merch-glass.png',
    category: 'Barware',
    description: 'Heavy-base rocks glass etched with the Cork & Thorn mark.',
  },
]

// Reservation deposit only applies during Nightlife hours (see
// NIGHTLIFE_SLOT below) — table tiers no longer carry their own per-tier
// deposit amount.
export const tableTiers = [
  {
    id: 'standard',
    name: 'Standard VIP',
    capacity: '2–4 guests',
    minSpend: 300,
    perks: ['Reserved booth', 'Dedicated server', 'Priority entry'],
  },
  {
    id: 'premium',
    name: 'Premium VIP',
    capacity: '4–8 guests',
    minSpend: 700,
    perks: ['Gold or Center booth', 'Bottle service', 'Dedicated host', 'Skip the line'],
  },
  {
    id: 'ultra',
    name: 'Ultra VIP',
    capacity: '8–20 guests',
    minSpend: 1500,
    perks: ['Stage / Blue / Back / Teremana booth', 'Two-bottle minimum', 'Personal mixologist', 'Reserved hookah', 'VIP entrance'],
  },
]

// Friday/Saturday 11pm-3am "Nightlife" hours — currently booked entirely by
// phone with promoter Parris, off any system of record. Bringing it online:
// a booking that falls in this window requires a flat, non-refundable
// (for no-shows; credited toward table spend otherwise) $75 deposit and is
// tagged with Parris's promoter code so his attribution is preserved. Any
// other time — including Friday/Saturday before 11pm — needs neither.
export const NIGHTLIFE_SLOT = {
  days: [5, 6] as const, // Date#getDay(): 5 = Friday, 6 = Saturday
  startHour: 23, // 11:00 PM
  endHour: 3, // 3:00 AM
  depositAmount: 75,
  promoterCode: 'PARRIS',
}

const ARRIVAL_TIME_HOURS: Record<string, number> = {
  '9:00 PM': 21,
  '10:00 PM': 22,
  '11:00 PM': 23,
  '12:00 AM': 0,
  '1:00 AM': 1,
  '2:00 AM': 2,
}

export function isNightlifeSlot(date: string, time: string): boolean {
  if (!date || !time) return false
  const day = new Date(`${date}T00:00:00`).getDay()
  if (!(NIGHTLIFE_SLOT.days as readonly number[]).includes(day)) return false

  const hour = ARRIVAL_TIME_HOURS[time]
  if (hour === undefined) return false

  // 23:00 through 23:59 and 0:00 through 2:59 (wraps past midnight)
  return hour >= NIGHTLIFE_SLOT.startHour || hour < NIGHTLIFE_SLOT.endHour
}

export const bottleService = [
  { name: 'Tequila — Añejo', price: 425 },
  { name: 'Champagne — Brut', price: 295 },
  { name: 'Cognac — VSOP', price: 380 },
  { name: 'Vodka — Premium', price: 350 },
  { name: 'Whiskey — Single Barrel', price: 450 },
  { name: 'Rosé Magnum', price: 320 },
]

// Real floor plan booths — canonical list shared by the guest-facing floor
// plan (spatial-booking.tsx), the availability API, and the staff dashboard,
// so they can never disagree about what booths exist.
export type BoothTier = 'standard' | 'premium' | 'ultra'

export interface Booth {
  id: string
  name: string
  capacity: string
  tier: BoothTier
  note?: string
}

export const BOOTHS: Booth[] = [
  // Stage area (top)
  { id: 'stage-vip',    name: 'Stage VIP',       capacity: '4–12 ppl', tier: 'ultra',   note: 'Best stage view' },
  { id: 'dj-vip',      name: 'DJ VIP',           capacity: '2–4 ppl',  tier: 'ultra',   note: 'Right next to the DJ' },

  // Center cluster
  { id: 'center-1a',   name: 'Center 1',         capacity: '4–8 ppl',  tier: 'premium' },
  { id: 'center-1b',   name: 'B Center 1',       capacity: '2–4 ppl',  tier: 'standard' },
  { id: 'center-2',    name: 'Center 2',         capacity: '4–8 ppl',  tier: 'premium' },
  { id: 'b-center-1',  name: 'B Center 1',       capacity: '2–4 ppl',  tier: 'standard' },

  // Gold row
  { id: 'gold-1',      name: 'Gold 1',           capacity: '4–8 ppl',  tier: 'premium' },
  { id: 'gold-2',      name: 'Gold 2',           capacity: '4–8 ppl',  tier: 'premium' },
  { id: 'gold-3',      name: 'Gold 3',           capacity: '4–8 ppl',  tier: 'premium' },

  // Circle booths
  { id: 'circle-1',    name: 'Circle 1',         capacity: '2–4 ppl',  tier: 'standard' },
  { id: 'circle-2',    name: 'Circle 2',         capacity: '2–4 ppl',  tier: 'standard' },
  { id: 'circle-4',    name: 'Circle 4',         capacity: '2–4 ppl',  tier: 'standard' },

  // Flower area
  { id: 'flower-couch',name: 'Flower Couch',     capacity: '4–8 ppl',  tier: 'premium', note: 'Signature couch booth' },
  { id: 'flower-vip',  name: 'Flower VIP',       capacity: '4–12 ppl', tier: 'premium' },

  // Named VIPs
  { id: 'randi-vip',   name: 'Randi VIP',        capacity: '2–4 ppl',  tier: 'standard' },
  { id: 'brian-vip',   name: 'Brian VIP',        capacity: '2–4 ppl',  tier: 'standard' },

  // Side / Back
  { id: 'side-vip',    name: 'Side VIP',         capacity: '4–8 ppl',  tier: 'premium' },
  { id: 'back-vip',    name: 'Back VIP',         capacity: '8–20 ppl', tier: 'ultra',   note: 'Largest private area' },

  // Premium named
  { id: 'teremana',    name: 'Teremana VIP',     capacity: '8–12 ppl', tier: 'ultra',   note: 'Teremana sponsored booth' },
  { id: 'blue-1',      name: 'Blue 1',           capacity: '8–12 ppl', tier: 'ultra' },
  { id: 'blue-2',      name: 'Blue 2',           capacity: '8–20 ppl', tier: 'ultra',   note: 'Premium large group' },
  { id: 'bellaire',    name: 'Bellaire VIP',     capacity: '2–6 ppl',  tier: 'premium' },
]

export const BOOTH_ZONES: { label: string; ids: string[]; cols: number }[] = [
  { label: 'Stage',          ids: ['stage-vip', 'dj-vip'],                            cols: 2 },
  { label: 'Center',         ids: ['center-1a', 'center-1b', 'center-2', 'b-center-1'], cols: 4 },
  { label: 'Gold Row',       ids: ['gold-1', 'gold-2', 'gold-3'],                     cols: 3 },
  { label: 'Circle',         ids: ['circle-1', 'circle-2', 'circle-4'],               cols: 3 },
  { label: 'Flower',         ids: ['flower-couch', 'flower-vip', 'randi-vip', 'brian-vip'], cols: 4 },
  { label: 'Side & Back',    ids: ['side-vip', 'back-vip', 'teremana'],               cols: 3 },
  { label: 'Blue & Bellaire',ids: ['blue-1', 'blue-2', 'bellaire'],                   cols: 3 },
]
