<template>
  <div>
    <v-container>
      <v-row class="mb-1">
        <v-btn
            class="mr-4"
            icon
            @click="onClickAddTask"
        >
          <v-icon size="35">mdi-plus-circle-outline</v-icon>
        </v-btn>
        <v-btn icon
               class="mr-4"
               :disabled="!isValidChosenTaskIndex"
               @click="showEditDialog = true"
        >
          <v-icon size="35">mdi-pencil</v-icon>
          <v-dialog v-model="showEditDialog"
                    width="75%"
          >
            <edit-task :indexForEditing="chosenTaskIndex"
                       @closeEditDialog="showEditDialog = false"
                       @saveChanges="onClickSaveChanges(chosenTaskIndex, $event)"
                       :key="showEditDialog">
            </edit-task>
          </v-dialog>
        </v-btn>
        <v-btn icon
               :disabled="!isValidChosenTaskIndex"
               @click="deleteTaskWithIndex(chosenTaskIndex)"
        >
          <v-icon size="35">mdi-close-circle-outline</v-icon>
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
          :class="rowStyle(index)">
        <td class="font-weight-bold text-subtitle-1 title-column">{{ task.title }}</td>
        <!--Список задач-->
        <td class="items-column">
          <!--Если список задач длинный, сокращаем до первых трёх элементов-->
          <div v-if="task.itemList.length > 5">
            <v-container v-for="(item, item_index) in task.itemList.slice(0,3)" :key="item_index">
              <v-row>
                <v-simple-checkbox :value="item.itemStatus"
                                   @input="onInputItemStatus(index, item_index, $event)"
                                   color="black">
                </v-simple-checkbox>
                <div class="text-justify item-title-container">
                  <p class="my-1 ml-2">{{ item.itemTitle }}</p>
                </div>
              </v-row>
            </v-container>

            <!--всплывающая подсказка с остальными элементами-->
            <v-container>
              <v-tooltip bottom attach>
                <template v-slot:activator="{ on, attrs }">
                  <div v-bind="attrs"
                       v-on="on">
                    ...
                  </div>
                </template>
                <span>
                  <div v-for="(item, index) in task.itemList" :key="index">
                    <v-container>
                      <v-row>
                        {{ item.itemTitle }}
                        <div v-if="item.itemStatus" class="ml-3"> ✓ </div>
                      </v-row>
                    </v-container>
                  </div>
                </span>
              </v-tooltip>
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
      chosenTaskIndex: -1,
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
          task: {
            title: 'Not found',
            itemList: []
          }
        }
      } else {
        return {
          task: {
            title: this.taskList[this.chosenTaskIndex].title,
            itemList: this.taskList[this.chosenTaskIndex].itemList
          }
        }
      }
    },
    taskList() {
      return this.$store.getters.TASK_LIST;
    }
  },
  methods: {
    deleteTaskWithIndex(index) {
      this.$store.commit('DELETE_TASK_BY_INDEX', {
        indexForDeleting: index
      });
    },
    onClickTask(index) {
      this.chosenTaskIndex = index;
    },
    onClickSaveChanges(index, data) {
      this.$store.commit('SET_TASK_BY_INDEX', {
        indexForSetting: index,
        task: data.task
      });
      this.showEditDialog = false;
    },
    onClickAddTask() {
      this.$store.commit('ADD_NEW_TASK');
    },
    rowStyle(index) {
      if (index === this.chosenTaskIndex) {
        return 'grey lighten-2'
      } else {
        return ''
      }
    },
    onInputItemStatus(task_index, item_index, e) {
      this.$store.commit('SET_STATUS_OF_ITEM', {
        taskIndex: task_index,
        itemIndex: item_index,
        status: e
      });
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
