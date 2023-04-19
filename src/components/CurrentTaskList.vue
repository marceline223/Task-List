<template>
  <div>
    <h2 class="mt-4">Список заданий</h2>
    <v-container>
      <v-row>
        <v-btn
            class="mr-4"
            icon
            @click="onClickAddTask"
        >
          <v-icon size="35">
            mdi-plus-circle-outline
          </v-icon>
        </v-btn>
        <v-btn icon
               class="mr-4"
               :disabled="!isValidChosenTaskIndex"
               @click="showEditDialog = true"
        >
          <v-icon size="35">
            mdi-pencil
          </v-icon>
          <v-dialog v-model="showEditDialog"
                    width="75%"
          >
            <edit-task :title="taskProp.title"
                       :itemList="taskProp.itemList"
                       @closeEditDialog="onClickCloseDialog(chosenTaskIndex, $event)"
                       @saveChanges="onClickSaveChanges(chosenTaskIndex, $event)"
                       :key="showEditDialog"
            >
            </edit-task>
          </v-dialog>
        </v-btn>
        <v-btn icon
               :disabled="!isValidChosenTaskIndex"
               @click="deleteTaskWithIndex(chosenTaskIndex)"
        >
          <v-icon size="35">
            mdi-close-circle-outline
          </v-icon>
        </v-btn>
      </v-row>
    </v-container>
    <v-simple-table>
      <thead>
      <tr>
        <th class="text-h6 black--text">Задания</th>
        <th class="text-h6 black--text">Задачи</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(task, index) in taskList"
          :key="index"
          @click="onClickTask(index)"
          :class="rowStyle(index)"
      >
        <td class="font-weight-bold text-subtitle-1 title-column">{{ task.title }}</td>
        <td class="items-column">
          <v-container v-for="(item, item_index) in task.itemList"
                       :key="item_index"
          >
            <v-row>
              <v-simple-checkbox :value="item.itemStatus"
                                 @input="onInputItemStatus(index, item_index, $event)"
                                 color="black"

              ></v-simple-checkbox>
              <div class="text-justify item-title-container">
                <p class="my-1 ml-2">{{ item.itemTitle }}</p>
              </div>
            </v-row>
          </v-container>
        </td>
      </tr>
      </tbody>
    </v-simple-table>
  </div>
</template>

<script>
import EditTask from "@/components/EditTask";

export default {
  name: "CurrentTaskList",
  components: {
    EditTask
  },
  data() {
    return {
      taskList: [
        {
          title: 'Задание 1',
          itemList: [
            {
              itemTitle: 'Задача 1.1',
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
          itemList: [
            {
              itemTitle: 'Задача 2.1',
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
          itemList: [
            {
              itemTitle: 'Задача 3.1',
              itemStatus: true
            }]
        },
        {
          title: 'Задание 4',
          itemList: [
            {
              itemTitle: 'Задача 4.1',
              itemStatus: false
            },
            {
              itemTitle: 'Opacity helper classes allow you to easily adjust the emphasis of text. text-high-emphasis has the same opacity as default text. text-medium-emphasis is used for hints and helper text. De-emphasize text with text-disabled.Opacity helper classes allow you to easily adjust the emphasis of text. text-high-emphasis has the same opacity as default text. text-medium-emphasis is used for hints and helper text. De-emphasize text with text-disabled.Opacity helper classes allow you to easily adjust the emphasis of text. text-high-emphasis has the same opacity as default text. text-medium-emphasis is used for hints and helper text. De-emphasize text with text-disabled.Opacity helper classes allow you to easily adjust the emphasis of text. text-high-emphasis has the same opacity as default text. text-medium-emphasis is used for hints and helper text. De-emphasize text with text-disabled.',
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
    isValidChosenTaskIndex() {
      return !(this.chosenTaskIndex === -1 || this.chosenTaskIndex >= this.taskList.length);
    },
    taskProp() {
      if (this.taskList.length === 0 || !this.isValidChosenTaskIndex) {
        return {
          title: 'Not found',
          itemList: []
        }
      } else {
        return {
          title: this.taskList[this.chosenTaskIndex].title,
          itemList: this.taskList[this.chosenTaskIndex].itemList
        }
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
    onClickCloseDialog(index, data) {
      this.taskList[index].title = data.title;
      this.taskList[index].itemList = data.itemList;
      this.showEditDialog = false
    },
    onClickSaveChanges(index, data) {
      this.taskList[index].title = data.title;
      this.taskList[index].itemList = data.itemList;
      this.showEditDialog = false;
    },
    onClickAddTask() {
      this.taskList.push({
        title: 'Новое задание',
        itemList: [],
      });
    },
    rowStyle(index) {
      if (index === this.chosenTaskIndex) {
        return 'grey lighten-2'
      } else {
        return ''
      }
    },
    onInputItemStatus(task_index, item_index, e) {
      this.taskList[task_index].itemList[item_index].itemStatus = e;
    },
  }
}
</script>

<style>
 .item-title-container {
   max-width: 95%;
 }
 .items-column {
   width: 70%;
 }

</style>
