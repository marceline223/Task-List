import VueApollo from 'vue-apollo'
import ApolloClient from 'apollo-boost'

export const apolloClient = new ApolloClient({
    uri: 'http://localhost:4000'
})

export const apolloProvider = new VueApollo({
    defaultClient: apolloClient,
})

