export const useShopify = () => {
  const config = useRuntimeConfig()

  const storeDomain = config.public.shopifyDomain as string
  const accessToken = config.public.shopifyToken as string
  const apiVersion = '2025-01'

  if (!storeDomain || !accessToken) {
    throw new Error(
      'Shopify credentials missing. Copy .env.example to .env and fill in SHOPIFY_DOMAIN and SHOPIFY_TOKEN.'
    )
  }

  const endpoint = `https://${storeDomain}/api/${apiVersion}/graphql.json`

  const sendQuery = async <T = unknown>(
    query: string,
    variables?: Record<string, unknown>
  ): Promise<T> => {
    const response = await $fetch<{ data: T; errors?: Array<{ message: string }> }>(
      endpoint,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': accessToken,
        },
        body: JSON.stringify({ query, variables }),
      }
    )

    if (response.errors?.length) {
      const messages = response.errors.map((e) => e.message).join(', ')
      throw new Error(`Shopify GraphQL error: ${messages}`)
    }

    return response.data
  }

  return { sendQuery }
}
