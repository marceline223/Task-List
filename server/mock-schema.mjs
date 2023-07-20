import {makeExecutableSchema} from 'graphql-tools';

const typeDefs = `
  type Query {
    getTaskList: [Task]
    deleteTaskByIndex: Response
    addNewTask: Response
    setTaskByIndex: Response
    setStatusOfItem: Response
    getCurrentItemId: Int
    getCurrentTaskId: Int
  }
  
  type Response {
    success: Boolean
    message: String
  }

  type Task {
    id: Int
    taskTitle: String
    itemList: [Item]
  }

  type Item {
    id: Int
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
        },
        getCurrentItemId: () => {
            return idItemCounter;
        },
        getCurrentTaskId: () => {
            return idTaskCounter;
        }
    }
};

import casual from "casual";

let idItemCounter = 0;
let idTaskCounter = 0;

function generateItem() {
    return {
        id: idItemCounter++,
        itemTitle: casual.sentence,
        itemStatus: casual.boolean
    }
}

function generateTask() {
    let itemsCount = Math.floor(Math.random() * 10);
    return {
        id: idTaskCounter++,
        taskTitle: casual.title,
        itemList: new Array(itemsCount).fill().map(generateItem)
    }
}

export const mocks = {
    Query: () => ({
        getTaskList: () => new Array(6).fill().map(generateTask),
    }),
};


export const schema = makeExecutableSchema({ typeDefs, resolvers });

