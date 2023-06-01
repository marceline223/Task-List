import Vue from 'vue'
import Vuex from 'vuex'

import createPersistedState from 'vuex-persistedstate';

import { Task, Item } from './store-types';
import {
    ADD_NEW_TASK,
    DELETE_TASK_BY_INDEX,
    GET_TASK_LIST,
    SET_STATUS_OF_ITEM,
    SET_TASK_BY_INDEX
} from "@/graphql/queries";
import {apolloClient} from '@/client/apollo'

Vue.use(Vuex)


export default new Vuex.Store({
    state: {
        taskList: [] as Task[]
    },
    mutations: {
        SET_TASK_BY_INDEX: (state, payload) => {
            state.taskList[payload.indexForSetting] = payload.task;
        },
        SET_STATUS_OF_ITEM: (state, payload) => {
            state.taskList[payload.taskIndex].itemList[payload.itemIndex].itemStatus = payload.itemStatus;
        },
        UPDATE_TASK_LIST: (state, payload) => {
            state.taskList = payload;
        },
        ADD_NEW_TASK: (state) => {
            state.taskList.push({
                taskTitle: 'Новое задание',
                itemList: [],
            });
        },
        DELETE_TASK_BY_INDEX: (state, payload) => {
            state.taskList.splice(payload.indexForDeleting, 1);
        }
    },
    modules: {},
    actions: {
        async fetchTaskList({ commit }) {
            // Проверяем наличие данных в localStorage
            const storedTaskList = localStorage.getItem('vuex');
            if (!storedTaskList) {
                // Если данных нет, выполняем запрос к Apollo
                try {
                    const {data} = await apolloClient.query({query: GET_TASK_LIST});
                    const taskList = data.getTaskList;
                    // Загружаем полученные данные в состояние Vuex
                    commit('UPDATE_TASK_LIST', taskList);
                    // Сохраняем данные в localStorage
                    localStorage.setItem('vuex', JSON.stringify(taskList));
                } catch (error) {
                    console.error('Ошибка при загрузке списка задач:', error);
                }
            }
        },

        async deleteTaskByIndex({commit}, payload) {
            const { data } = await apolloClient.query({query: DELETE_TASK_BY_INDEX});
            if (data.deleteTaskByIndex.success) {
                commit('DELETE_TASK_BY_INDEX', payload);
                console.log(data.deleteTaskByIndex.message);
            }
        },

        async addNewTask({commit}) {
            const { data } = await apolloClient.query({query: ADD_NEW_TASK});
            if (data.addNewTask.success) {
                commit('ADD_NEW_TASK');
            }
            console.log(data.addNewTask.message);
        },

        async setTaskByIndex({commit}, payload) {
            const { data } = await apolloClient.query({query: SET_TASK_BY_INDEX});
            if (data.setTaskByIndex.success) {
                commit('SET_TASK_BY_INDEX', payload);
            }
            console.log(data.setTaskByIndex.message);
        },

        async setStatusOfItem({commit}, payload) {
            const { data } = await apolloClient.query({query:SET_STATUS_OF_ITEM});
            if (data.setStatusOfItem.success) {
                commit('SET_STATUS_OF_ITEM', payload);
            }
            console.log(data.setStatusOfItem.message);
        }
    },
    plugins: [createPersistedState()],
})
