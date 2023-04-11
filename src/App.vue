<template>
  <v-app>
    <v-main class="v-main-container">
      <current-task-list></current-task-list>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import Vuetify from "vuetify"
import CurrentTaskList from "@/components/CurrentTaskList.vue"

export default Vue.extend({
  name: 'App',
  vuetify: new Vuetify(),
  components: {
    CurrentTaskList
  },
  data() {
    return {
      taskList: [
        {
          title: 'Задание 1',
          items: ['Задача 1.1', 'Задача 1.2', 'Задача 1.3', 'Задача 1.4', 'Задача 1.5', 'Задача 1.6']
        },
        {
          title: 'Задание 2',
          items: ['Задача 2.1', 'Задача 2.2', 'Задача 2.3']
        },
        {
          title: 'Задание 3',
          items: ['Задача 3.1']
        }
      ]
    }
  }
});
</script>

<style>
.v-main-container {
  width: 85%;
  margin: auto;
}
</style>
