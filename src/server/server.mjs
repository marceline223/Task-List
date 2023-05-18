import {ApolloServer} from '@apollo/server';
import {startStandaloneServer} from '@apollo/server/standalone';
import {addMocksToSchema} from '@graphql-tools/mock';
import {makeExecutableSchema} from '@graphql-tools/schema';

import casual from "casual";

const typeDefs = `
  type Query {
    getTaskList: [Task]
    deleteTaskByIndex: Response
    addNewTask: Response
    setTaskByIndex: Response
    setStatusOfItem: Response
  }
  
  type Response {
    success: Boolean
    message: String
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
        deleteTaskByIndex: () => {
            return {
                success: true,
                message: 'The task has successfully deleted.'
            }
        },
        addNewTask: () => {
            return {
                success: true,
                message: 'The new task has successfully added.'
            }
        },
        setTaskByIndex: () => {
            return {
                success: true,
                message: 'The task has successfully updated.'
            }
        },
        setStatusOfItem: () => {
            return {
                success: true,
                message: 'The status of item has successfully updated.'
            }
        }
    }
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
        getTaskList: () => new Array(6).fill().map(generateTask)
    }),
};


const server = new ApolloServer({
    schema: addMocksToSchema({
        schema: makeExecutableSchema({typeDefs, resolvers}),
        mocks: mocks,
        preserveResolvers: true
    })
});

const {url} = await startStandaloneServer(server, {listen: {port: 4000}});

console.log(`Server listening at: ${url}`);
