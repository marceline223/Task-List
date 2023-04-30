<template>
  <div>
    <v-container>
      <v-row class="mb-1">
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
                       @closeEditDialog="onClickCloseDialog"
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

        <!--Список задач-->
        <td class="items-column">
          <!--Если список задач длинный, сокращаем до первого-последнего элемента-->
          <div v-if="task.itemList.length > 5">
            <!--1-й элемент-->
            <v-container>
              <v-row>
                <v-simple-checkbox :value="task.itemList[0].itemStatus"
                                   @input="onInputItemStatus(index, 0, $event)"
                                   color="black"

                ></v-simple-checkbox>
                <div class="text-justify item-title-container">
                  <p class="my-1 ml-2">{{ task.itemList[0].itemTitle }}</p>
                </div>
              </v-row>
            </v-container>
            <v-container>
              <v-tooltip>
                <template v-slot:activator="{ on, attrs }">
                  <div v-bind="attrs"
                       v-on="on">
                    ...
                  </div>
                </template>
                <span>
                  <div v-for="(item, index) in task.itemList" :key="index">
                    {{item.itemTitle}}
                  </div>
                </span>
              </v-tooltip>
            </v-container>
            <!--n-й элемент-->
            <v-container>
              <v-row>
                <v-simple-checkbox :value="task.itemList[task.itemList.length-1].itemStatus"
                                   @input="onInputItemStatus(index, 0, $event)"
                                   color="black"

                ></v-simple-checkbox>
                <div class="text-justify item-title-container">
                  <p class="my-1 ml-2">{{ task.itemList[task.itemList.length - 1].itemTitle }}</p>
                </div>
              </v-row>
            </v-container>

          </div>
          <div v-else>
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
          </div>

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
          title: 'Убраться дома',
          itemList: [
            {
              itemTitle: 'Пропылесосить',
              itemStatus: true
            },
            {
              itemTitle: 'Разгрузить стиральную машину',
              itemStatus: false
            },
            {
              itemTitle: 'Помыть окна',
              itemStatus: true
            },
            {
              itemTitle: 'Протереть зеркало',
              itemStatus: false
            },
            {
              itemTitle: 'Разобрать сушилку',
              itemStatus: false
            },
            {
              itemTitle: 'Выкинуть мусор',
              itemStatus: true
            }]
        },
        {
          title: 'Подготовиться к экзамену',
          itemList: [
            {
              itemTitle: 'Пересмотреть последнюю лекцию',
              itemStatus: false
            },
            {
              itemTitle: 'Потренировать решение задач',
              itemStatus: false
            },
            {
              itemTitle: 'Просмотреть конспект',
              itemStatus: false
            }]
        },
        {
          title: 'ДР Полины',
          itemList: [
            {
              itemTitle: 'Купить подарок',
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
    onClickCloseDialog() {
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
    }
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
