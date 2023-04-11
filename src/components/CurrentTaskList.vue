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
          <v-dialog v-model="showAddDialog" width="75%">
            <add-task @closeAddDialog="onClickCloseDialog('add')"></add-task>
          </v-dialog>
        </v-btn>
        <v-btn icon
               class="mr-4 black--text"
               :disabled="chosenTask === -1"
               @click="showEditDialog = true"
        >
          <v-icon>mdi-pencil</v-icon>
          <v-dialog v-model="showEditDialog" width="75%">
            <edit-task :title="taskList[chosenTask].title"
                       :description="taskList[chosenTask].description"
                       :item-list="taskList[chosenTask].items"
                       @closeEditDialog="onClickCloseDialog('edit')"
                       @saveChanges="onClickSaveChanges(chosenTask, $event)"
            >
            </edit-task>
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
  </div>
</template>

<script>
import AddTask from "@/components/AddTask";
import EditTask from "@/components/EditTask";

export default {
  name: "CurrentTaskList",
  components: {
    AddTask, EditTask
  },
  data() {
    return {
      taskList: [
        {
          title: 'Задание 1',
          items: ['Задача 1.1', 'Задача 1.2', 'Задача 1.3', 'Задача 1.4', 'Задача 1.5', 'Задача 1.6'],
          description: 'Ляляляляля'
        },
        {
          title: 'Задание 2',
          items: ['Задача 2.1', 'Задача 2.2', 'Задача 2.3'],
          description: 'Траляляляляля'
        },
        {
          title: 'Задание 3',
          items: ['Задача 3.1'],
          description: ''
        },
        {
          title: 'Задание 4',
          items: ['Задача 4.1', 'Задача 4.2'],
          description: '123123123'
        }
      ],
      chosenTask: 0,
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
    },
    onClickCloseDialog(type) {
      if (type === 'add') {
        this.showAddDialog = false;
      }
      else if (type === 'edit') {
        this.showEditDialog = false;
      }
    },
    onClickSaveChanges(index, data) {
      this.taskList[index].title = data.title;
      this.taskList[index].description = data.description;
      this.taskList[index].items = data.itemList;
      this.showEditDialog = false;
    }
  }
}
</script>

