import VueApollo from 'vue-apollo'
import ApolloClient from 'apollo-boost'

const apolloClient = new ApolloClient({
    uri: 'http://localhost:4000'
})

const apolloProvider = new VueApollo({
    defaultClient: apolloClient,
})

export default apolloProvider;
