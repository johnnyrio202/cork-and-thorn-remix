import 'server-only'

export type SecretMenuItem = {
  name: string
  sub?: string
  pours: { label: string; price: number }[]
}

export const SECRET_MENU_ITEMS: SecretMenuItem[] = [
  {
    name: 'The Cork & Thorn Signature',
    sub: "Chef's creation — ask your bartender",
    pours: [{ label: 'Cocktail', price: 25 }],
  },
  {
    name: 'VIP Night Cap',
    sub: 'Vintage spirits, rare infusions — by request only',
    pours: [{ label: 'Pour', price: 35 }],
  },
]
