import type { ShopifyProduct, ProductConnection } from '~/types/shopify'

const PRODUCT_FRAGMENT = `
  fragment ProductFields on Product {
    id
    handle
    title
    description
    descriptionHtml
    availableForSale
    featuredImage {
      url
      altText
      width
      height
    }
    images(first: 10) {
      nodes {
        url
        altText
        width
        height
      }
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    variants(first: 50) {
      nodes {
        id
        title
        availableForSale
        selectedOptions {
          name
          value
        }
        price {
          amount
          currencyCode
        }
        compareAtPrice {
          amount
          currencyCode
        }
      }
    }
    productType
    tags
  }
`

export const useProducts = () => {
  const { sendQuery } = useShopify()

  const getAllProducts = async (first = 50, after?: string | null) => {
    const gql = `
      ${PRODUCT_FRAGMENT}
      query Products($first: Int!, $after: String) {
        products(first: $first, after: $after) {
          nodes { ...ProductFields }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    `
    return sendQuery<{ products: ProductConnection }>(gql, { first, after })
  }

  const getProductByHandle = async (handle: string) => {
    const gql = `
      ${PRODUCT_FRAGMENT}
      query ProductByHandle($handle: String!) {
        productByHandle(handle: $handle) {
          ...ProductFields
        }
      }
    `
    return sendQuery<{ productByHandle: ShopifyProduct | null }>(gql, { handle })
  }

  const getProductById = async (id: string) => {
    const gql = `
      ${PRODUCT_FRAGMENT}
      query ProductById($id: ID!) {
        product(id: $id) {
          ...ProductFields
        }
      }
    `
    return sendQuery<{ product: ShopifyProduct | null }>(gql, { id })
  }

  const getProductsByCollection = async (handle: string, first = 50, after?: string | null) => {
    const gql = `
      ${PRODUCT_FRAGMENT}
      query ProductsByCollection($handle: String!, $first: Int!, $after: String) {
        collectionByHandle(handle: $handle) {
          title
          products(first: $first, after: $after) {
            nodes { ...ProductFields }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      }
    `
    return sendQuery<{
      collectionByHandle: {
        title: string
        products: ProductConnection
      } | null
    }>(gql, { handle, first, after })
  }

  return {
    getAllProducts,
    getProductByHandle,
    getProductById,
    getProductsByCollection,
  }
}
