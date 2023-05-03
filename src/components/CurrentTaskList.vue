<template>
  <div>
    <v-container>
      <v-row class="mb-1">
        <!--добавить новое задание-->
        <v-btn class="mr-4"
               icon
               @click="onClickAddTask">
          <v-icon size="35">mdi-plus-circle-outline</v-icon>
        </v-btn>

        <!--редактировать задание-->
        <v-btn icon
               class="mr-4"
               :disabled="!isValidChosenTaskIndex"
               @click="showEditDialog = true">
          <v-icon size="35">mdi-pencil</v-icon>
          <v-dialog v-model="showEditDialog"
                    width="75%">
            <edit-task :indexForEditing="chosenTaskIndex"
                       @closeEditDialog="showEditDialog = false"
                       :key="showEditDialog">
            </edit-task>
          </v-dialog>
        </v-btn>

        <!--удалить задание-->
        <v-btn icon
               :disabled="!isValidChosenTaskIndex"
               @click="showDeleteDialog = true">
          <v-icon size="35">mdi-close-circle-outline</v-icon>
          <v-dialog v-model="showDeleteDialog" width="auto">
            <confirmation-window type="delete"
                                 @cancel="showDeleteDialog = false"
                                 @accept="onClickAcceptDeleting">
            </confirmation-window>
          </v-dialog>
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
      <!--список задач-->
      <tr v-for="(task, index) in taskList"
          :key="index"
          @click="onClickTask(index)"
          :class="rowStyle(index)">
        <td class="font-weight-bold text-subtitle-1 title-column">{{ task.title }}</td>
        <td class="items-column">
          <!--если список задач длинный, сокращаем до первых трёх элементов-->
          <div v-if="task.itemList.length > 7">
            <v-container v-for="(item, item_index) in task.itemList.slice(0,3)" :key="item_index">
              <v-row>
                <v-simple-checkbox :value="item.itemStatus"
                                   @input="onInputItemStatus(index, item_index, $event)">
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
                       v-on="on"
                       class="ml-5">
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
                         :key="item_index">
              <v-row>
                <v-simple-checkbox :value="item.itemStatus"
                                   @input="onInputItemStatus(index, item_index, $event)"></v-simple-checkbox>
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
import ConfirmationWindow from "@/components/ConfirmationWindow";

export default {
  name: "CurrentTaskList",
  components: {
    ConfirmationWindow,
    EditTask
  },
  data() {
    return {
      chosenTaskIndex: -1,
      showEditDialog: false,
      showDeleteDialog: false
    }
  },
  computed: {
    isValidChosenTaskIndex() {
      return !(this.chosenTaskIndex === -1 || this.chosenTaskIndex >= this.taskList.length);
    },
    taskList() {
      return this.$store.getters.TASK_LIST;
    }
  },
  methods: {
    onClickTask(index) {
      this.chosenTaskIndex = index;
    },
    onClickAddTask() {
      this.$store.commit('ADD_NEW_TASK');
    },
    onClickAcceptDeleting() {
      this.$store.commit('DELETE_TASK_BY_INDEX', {
        indexForDeleting: this.indexForDeleting
      });
      this.showDeleteDialog = false;
    },
    rowStyle(index) {
      if (index === this.chosenTaskIndex) {
        return 'grey lighten-2'
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
