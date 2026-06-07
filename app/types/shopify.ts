export interface ShopifyImage {
  url: string
  altText: string | null
  width: number
  height: number
}

export interface ShopifyVariant {
  id: string
  title: string
  availableForSale: boolean
  selectedOptions: { name: string; value: string }[]
  price: { amount: string; currencyCode: string }
  compareAtPrice: { amount: string; currencyCode: string } | null
}

export interface ShopifyProduct {
  id: string
  handle: string
  title: string
  description: string
  descriptionHtml: string
  availableForSale: boolean
  featuredImage: ShopifyImage | null
  images: { nodes: ShopifyImage[] }
  priceRange: {
    minVariantPrice: { amount: string; currencyCode: string }
    maxVariantPrice: { amount: string; currencyCode: string }
  }
  variants: { nodes: ShopifyVariant[] }
  productType: string
  tags: string[]
}

export interface ProductConnection {
  nodes: ShopifyProduct[]
  pageInfo: {
    hasNextPage: boolean
    endCursor: string | null
  }
}

export interface CartCost {
  totalAmount: { amount: string; currencyCode: string }
  subtotalAmount: { amount: string; currencyCode: string }
  totalTaxAmount: { amount: string; currencyCode: string }
  totalDutyAmount: { amount: string; currencyCode: string } | null
}

export interface ShopifyCartLine {
  id: string
  quantity: number
  merchandise: {
    id: string
    title: string
    product: { id: string; handle: string; title: string }
    image: ShopifyImage | null
    price: { amount: string; currencyCode: string }
    compareAtPrice: { amount: string; currencyCode: string } | null
    selectedOptions: { name: string; value: string }[]
  }
  cost: {
    totalAmount: { amount: string; currencyCode: string }
    subtotalAmount: { amount: string; currencyCode: string }
  }
}

export interface ShopifyCart {
  id: string
  checkoutUrl: string
  totalQuantity: number
  cost: CartCost
  lines: { nodes: ShopifyCartLine[] }
  note: string | null
  attributes: { key: string; value: string }[]
}
