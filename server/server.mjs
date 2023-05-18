import {ApolloServer} from '@apollo/server';
import {startStandaloneServer} from '@apollo/server/standalone';
import {addMocksToSchema} from '@graphql-tools/mock';
import {schema, mocks} from "./mock-schema.mjs";


const server = new ApolloServer({
    schema: addMocksToSchema({
        schema: schema,
        mocks: mocks,
        preserveResolvers: true
    })
});

const {url} = await startStandaloneServer(server, {listen: {port: 4000}});

console.log(`Server listening at: ${url}`);
