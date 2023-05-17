import gql from 'graphql-tag';

export const GET_TASK_LIST = gql`
  query getTaskList {
    getTaskList {
      taskTitle
      itemList {
        itemTitle
        itemStatus
      }
    }
  }
`;
