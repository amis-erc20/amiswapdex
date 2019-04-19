export default async function (ctx, inject) {
  const moduleOptions = {"accessibleIcons":true,"iconProperty":"$icon","icons":{"64":"\u002F_nuxt\u002Ficons\u002Ficon_64.ckY6Y9Iej77.png","120":"\u002F_nuxt\u002Ficons\u002Ficon_120.ckY6Y9Iej77.png","144":"\u002F_nuxt\u002Ficons\u002Ficon_144.ckY6Y9Iej77.png","152":"\u002F_nuxt\u002Ficons\u002Ficon_152.ckY6Y9Iej77.png","192":"\u002F_nuxt\u002Ficons\u002Ficon_192.ckY6Y9Iej77.png","384":"\u002F_nuxt\u002Ficons\u002Ficon_384.ckY6Y9Iej77.png","512":"\u002F_nuxt\u002Ficons\u002Ficon_512.ckY6Y9Iej77.png"}}
  inject(moduleOptions.iconProperty.replace('$', ''), retrieveIcons(moduleOptions.icons))
}

const retrieveIcons = icons => size => icons[size] || ''
