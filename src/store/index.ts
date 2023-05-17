import Vue from 'vue'
import Vuex from 'vuex'

import createPersistedState from 'vuex-persistedstate';

import { Task, Item } from './store-types';
import {GET_TASK_LIST} from "@/graphql/queries";
import {apolloClient} from '../client/apollo'

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
                // Если данных нет, выполняем запрос к Apollo Mocking
                try {
                    const { data } = await apolloClient.query({query: GET_TASK_LIST});
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
    },
    plugins: [createPersistedState()],
})
