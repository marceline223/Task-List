<template>
  <div>
    <h2 class="mt-4">Список заданий</h2>
    <v-container fluid>
      <v-row>
        <v-btn
            class="mr-4"
            icon
            @click="showAddDialog = true"
        >
          <v-icon class="black--text">mdi-plus-circle-outline</v-icon>
          <v-dialog v-model="showAddDialog">
              <v-card>
                <v-card-title>Добавление</v-card-title>
                <v-btn class="ma-5"
                       @click="showAddDialog = false"
                >
                  Закрыть
                </v-btn>
              </v-card>
          </v-dialog>
        </v-btn>
        <v-btn icon
               class="mr-4 black--text"
               :disabled="chosenTask === -1"
               @click="showEditDialog = true"
        >
          <v-icon>mdi-pencil</v-icon>
          <v-dialog v-model="showEditDialog">
            <v-card>
              <v-card-title>Редактирование задания {{chosenTask + 1}}</v-card-title>
              <v-btn class="ma-5"
                     @click="showEditDialog = false"
              >
                Закрыть
              </v-btn>
            </v-card>
          </v-dialog>
        </v-btn>
        <v-btn icon
               class="black--text"
               :disabled="chosenTask === -1"
               @click="deleteTaskWithIndex(chosenTask)"
        >
          <v-icon>mdi-close-circle-outline</v-icon>
        </v-btn>
      </v-row>
    </v-container>
    <v-simple-table density="comfortable">
      <thead>
      <tr>
        <th class="text-h6 black--text">Задания</th>
        <th class="text-h6 black--text">Задачи</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(task, index) in taskList" :key="index" @click="onClickTask(index)" ref="dropdown">
        <td>{{ task.title }}</td>
        <td>
          <div v-for="(item, item_index) in task.items" :key="item_index" class="my-2">{{ item }}</div>
        </td>
      </tr>
      </tbody>
    </v-simple-table>
    Index of chosen task: {{ chosenTask }}
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
        },
        {
          title: 'Задание 4',
          items: ['Задача 4.1', 'Задача 4.2']
        }
      ],
      chosenTask: -1,
      showAddDialog: false,
      showEditDialog: false
    }
  },
  methods: {
    deleteTaskWithIndex(index) {
      this.taskList.splice(index, 1);
    },
    onClickTask(index) {
      this.chosenTask = index;
    }
  }
}
</script>

