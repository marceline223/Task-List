import {ApolloServer} from '@apollo/server';
import {startStandaloneServer} from '@apollo/server/standalone';
import {addMocksToSchema} from '@graphql-tools/mock';
import {makeExecutableSchema} from '@graphql-tools/schema';

import casual from "casual";

const typeDefs = `
  type Query {
    taskList: [Task]
  }

  type Task {
    taskTitle: String
    itemList: [Item]
  }

  type Item {
    itemTitle: String
    itemStatus: Boolean
  }
`;

const resolvers = {
    Query: {
        resolved: () => 'Resolved',
    },
};

function generateItem() {
    return {
        itemTitle: casual.sentence,
        itemStatus: casual.boolean
    }
}

function generateTask() {
    let itemsCount = Math.floor(Math.random() * 8);
    return {
        taskTitle: casual.title,
        itemList: new Array(itemsCount).fill().map(generateItem)
    }
}


const mocks = {
    Query: () => ({
        taskList: () => new Array(6).fill().map(generateTask),
    }),
};



const server = new ApolloServer({
    schema: addMocksToSchema({
        schema: makeExecutableSchema({typeDefs}),
        mocks: mocks,
    }),
});

const {url} = await startStandaloneServer(server, {listen: {port: 4000}});

console.log(`Server listening at: ${url}`);
