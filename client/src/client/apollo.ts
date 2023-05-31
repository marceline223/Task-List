import VueApollo from 'vue-apollo';
import {ApolloClient, InMemoryCache} from "@apollo/client/core";

export const apolloClient = new ApolloClient({
    uri: 'http://localhost:4000',
    cache: new InMemoryCache()
})

export const apolloProvider = new VueApollo({
    defaultClient: apolloClient,
})

