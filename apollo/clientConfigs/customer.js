import { ApolloLink } from 'apollo-link'
// import { HttpLink } from 'apollo-link-http'
import { BatchHttpLink } from 'apollo-link-batch-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

export default (ctx) => {
  if (!ctx.store.state.authentication.token) {
    ctx.redirect('/')
  }

  const httpLink = new BatchHttpLink({ uri: 'https://api.flybird.org/graphql/me' })

  // middleware
  const middlewareLink = new ApolloLink((operation, forward) => {
    const token = ctx.store.state.authentication.token ? ctx.store.state.authentication.token : null

    operation.setContext({
      headers: { authorization: `Bearer ${token}` }
    })
    return forward(operation)
  })
  const link = middlewareLink.concat(httpLink)
  return {
    link,
    cache: new InMemoryCache({
      dataIdFromObject: object => {
      }
    })
  }
}
