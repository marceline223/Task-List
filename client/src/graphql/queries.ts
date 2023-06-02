import gql from 'graphql-tag';

export const GET_TASK_LIST = gql`
  query Query {
    getTaskList {
      id
      taskTitle
      itemList {
        id
        itemTitle
        itemStatus
      }
    }
  }
`;

export const DELETE_TASK_BY_INDEX = gql`
    query Query {
      deleteTaskByIndex {
        success
        message
      }
    }
`

export const ADD_NEW_TASK = gql`
    query Query {
      addNewTask {
        success
        message
      }
    }
`

export const SET_TASK_BY_INDEX = gql`
    query Query {
      setTaskByIndex {
        success
        message
      }
    }
`

export const SET_STATUS_OF_ITEM = gql`
    query Query {
      setStatusOfItem {
        success
        message
      }
    }
`

export const GET_CURRENT_ITEM_ID = gql `
    query Query {
        getCurrentItemId
    }
`

export const GET_CURRENT_TASK_ID = gql `
    query Query {
        getCurrentTaskId
    }
`
