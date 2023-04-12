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
            <add-task @closeAddDialog="onClickCloseDialog('add')" @addTask = "onClickAddTask"></add-task>
          </v-dialog>
        </v-btn>
        <v-btn icon
               class="mr-4 black--text"
               :disabled="chosenTaskIndex === -1"
               @click="showEditDialog = true"
        >
          <v-icon>mdi-pencil</v-icon>
          <v-dialog v-model="showEditDialog" width="75%">
            <edit-task :title="taskProp.title"
                       :item-list="taskProp.items"
                       @closeEditDialog="onClickCloseDialog('edit')"
                       @saveChanges="onClickSaveChanges(chosenTaskIndex, $event)"
            >
            </edit-task>
          </v-dialog>
        </v-btn>
        <v-btn icon
               class="black--text"
               :disabled="chosenTaskIndex === -1"
               @click="deleteTaskWithIndex(chosenTaskIndex)"
        >
          <v-icon>mdi-close-circle-outline</v-icon>
        </v-btn>
      </v-row>
    </v-container>
    <v-simple-table >
      <thead>
      <tr>
        <th class="text-h6 black--text">Задания</th>
        <th class="text-h6 black--text">Задачи</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(task, index) in taskList" :key="index" @click="onClickTask(index)" :class="rowStyle(index)">
        <td>{{ task.title }}</td>
        <td>
              <v-container
                           v-for="(item, item_index) in task.items"
                           :key="item_index"
              >
                <v-row>
                  <v-simple-checkbox v-model="item.itemStatus"
                                     color="black"
                  ></v-simple-checkbox>
                  {{ item.itemTitle }}
                </v-row>
              </v-container>
        </td>
      </tr>
      </tbody>
    </v-simple-table>

<!--    <v-data-table>-->

<!--    </v-data-table>-->
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
      headers:['Задания', 'Задачи'],
      taskList: [
        {
          title: 'Задание 1',
          items: [
            {
              itemTitle:'Задача 1.1',
              itemStatus: true
            },
            {
              itemTitle: 'Задача 1.2',
              itemStatus: false
            },
            {
              itemTitle: 'Задача 1.3',
              itemStatus: true
            },
            {
              itemTitle: 'Задача 1.4',
              itemStatus: false
            },
            {
              itemTitle: 'Задача 1.5',
              itemStatus: false
            },
            {
              itemTitle: 'Задача 1.6',
              itemStatus: true
            }]
        },
        {
          title: 'Задание 2',
          items: [
            {
              itemTitle:'Задача 2.1',
              itemStatus: false
            },
            {
              itemTitle: 'Задача 2.2',
              itemStatus: false
            },
            {
              itemTitle: 'Задача 2.2',
              itemStatus: false
            }]
        },
        {
          title: 'Задание 3',
          items: [
            {
              itemTitle:'Задача 3.1',
              itemStatus: true
            }]
        },
        {
          title: 'Задание 4',
          items: [
            {
              itemTitle:'Задача 4.1',
              itemStatus: false
            },
            {
              itemTitle: 'Задача 4.2',
              itemStatus: true
            }]
        }
      ],
      chosenTaskIndex: -1,
      showAddDialog: false,
      showEditDialog: false
    }
  },
  computed: {
    taskProp() {
      if (this.taskList.length === 0 || this.chosenTaskIndex === -1 || this.chosenTaskIndex >= this.taskList.length) {
        return {
          title: 'Not found',
          items: []
        }
      } else {
        return this.taskList[this.chosenTaskIndex]
      }
    }
  },
  methods: {
    deleteTaskWithIndex(index) {
      this.taskList.splice(index, 1);
    },
    onClickTask(index) {
      this.chosenTaskIndex = index;
    },
    onClickCloseDialog(type) {
      if (type === 'add') {
        this.showAddDialog = false;
      } else if (type === 'edit') {
        this.showEditDialog = false;
      }
    },
    onClickSaveChanges(index, data) {
      this.taskList[index].title = data.title;
      this.taskList[index].items = data.itemList;
      this.showEditDialog = false;
    },
    onClickAddTask(data) {
      this.taskList.push({
        title: data.title,
        items: data.itemList,
      });
      this.showAddDialog = false;
    },
    rowStyle(index) {
      if (index === this.chosenTaskIndex) {
        return 'grey lighten-1'
      } else {
        return ''
      }
    }
  }
}
</script>

