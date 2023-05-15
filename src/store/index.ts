import Vue from 'vue'
import Vuex from 'vuex'

import createPersistedState from 'vuex-persistedstate';
import gql from "graphql-tag";
import apolloProvider from '../client/apollo'
import { Task, Item } from './store-types';


Vue.use(Vuex)


export default new Vuex.Store({
    state: {
        taskList: [] as Task[]
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
        UPDATE_TASK_LIST: (state, payload) => {
            state.taskList = payload;
        },
        ADD_NEW_TASK: (state) => {
            state.taskList.push({
                taskTitle: 'Новое задание',
                itemList: [],
            })
        },
        DELETE_TASK_BY_INDEX: (state, payload) => {
            state.taskList.splice(payload.indexForDeleting, 1);
        }
    },
    modules: {},
    actions: {
        async fetchTaskList({ commit }) {
            // Проверяем наличие данных в localStorage
            const storedTaskList = localStorage.getItem('taskList');
            if (storedTaskList) {
                // Если данные есть в localStorage, загружаем их в состояние Vuex
                commit('setTaskList', JSON.parse(storedTaskList));
            } else {
                // Если данных нет в localStorage, выполняем запрос к Apollo Mocking
                try {
                    const { data } = await apolloProvider.query({
                        query: gql`
                          query Query {
                            taskList {
                              taskTitle
                              itemList {
                                itemTitle
                                itemStatus
                              }
                            }
                          }
                        `,
                    });
                    const taskList = data.taskList;
                    // Загружаем полученные данные в состояние Vuex
                    commit('setTaskList', taskList);
                    // Сохраняем данные в localStorage
                    localStorage.setItem('taskList', JSON.stringify(taskList));
                } catch (error) {
                    console.error('Ошибка при загрузке списка задач:', error);
                }
            }
        },
    },
    plugins: [createPersistedState()],
})
