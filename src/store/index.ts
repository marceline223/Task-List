import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    taskList: [
      {
        title: 'Убраться дома',
        itemList: [
          {
            itemTitle: 'Пропылесосить',
            itemStatus: true
          },
          {
            itemTitle: 'Разгрузить стиральную машину',
            itemStatus: false
          },
          {
            itemTitle: 'Помыть окна',
            itemStatus: true
          },
          {
            itemTitle: 'Протереть зеркало',
            itemStatus: false
          },
          {
            itemTitle: 'Разобрать сушилку',
            itemStatus: false
          },
          {
            itemTitle: 'Выкинуть мусор',
            itemStatus: true
          },
          {
            itemTitle: 'Разобрать мусор на балконе',
            itemStatus: false
          },
          {
            itemTitle: 'Отсортировать отходы',
            itemStatus: true
          }
        ]
      },
      {
        title: 'Подготовиться к экзамену',
        itemList: [
          {
            itemTitle: 'Пересмотреть последнюю лекцию',
            itemStatus: false
          },
          {
            itemTitle: 'Потренировать решение задач',
            itemStatus: false
          },
          {
            itemTitle: 'Просмотреть конспект',
            itemStatus: false
          }]
      },
      {
        title: 'ДР Полины',
        itemList: [
          {
            itemTitle: 'Купить подарок',
            itemStatus: true
          }]
      }
    ]
  },
  getters: {
    TASK_LIST: state => {
      return state.taskList;
    },
    TASK_BY_ID: state => (index: number) => {
      return state.taskList[index];
    }
  },
  mutations: {
    SET_TASK_BY_INDEX: (state, payload) => {
      state.taskList[payload.indexForSetting] = payload.task;
    },
    SET_STATUS_OF_ITEM: (state, payload) => {
      state.taskList[payload.taskIndex].itemList[payload.itemIndex].itemStatus = payload.status;
    },
    ADD_NEW_TASK: (state) => {
      state.taskList.push({
        title: 'Новое задание',
        itemList: [],
      })
    },
    DELETE_TASK_BY_INDEX: (state, payload) => {
      state.taskList.splice(payload.indexForDeleting, 1);
    }
  },
  actions: {
  },
  modules: {
  }
})
