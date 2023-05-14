<template>
  <v-app>
<!--    <v-main class="v-main-container">-->
<!--      <h2 class="my-4">Список заданий</h2>-->
<!--      <current-task-list></current-task-list>-->
<!--    </v-main>-->
    <current-task-list></current-task-list>
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
  }
});

</script>

<style>
.v-main-container {
  width: 75%;
  margin: auto;
}
</style>
