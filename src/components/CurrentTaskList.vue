<template>
  <div>
    <h2 class="mt-4">Список заданий</h2>
    <v-container fluid>
      <v-row>
        <v-btn class="mr-4" icon>
          <v-icon>mdi-plus</v-icon>
        </v-btn>
        <v-btn class="mr-4" icon disabled>
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn icon disabled>
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-row>
    </v-container>
    <v-simple-table density="comfortable">
      <thead>
      <tr>
        <th>Задания</th>
        <th>Задачи</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(task, index) in taskList" :key="index">
        <td>{{ task.title }}</td>
        <td>
          <div v-for="(item, item_index) in task.items" :key="item_index">{{ item }}</div>
        </td>
      </tr>
      </tbody>
    </v-simple-table>
  </div>
</template>

<script>
export default {
  name: "CurrentTaskList",
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
}
</script>

<style scoped>

</style>
