<template>
  <div>
    <v-container>
      <v-row class="mb-1">
        <!--добавить новое задание-->
        <v-btn
            icon
            class="mr-4"
            @click="onClickAddTask"
        >
          <v-icon size="35">mdi-plus-circle-outline</v-icon>
        </v-btn>

        <!--редактировать задание-->
        <v-btn
            icon
            class="mr-4"
            :disabled="!isChosenTaskIndexValid"
            @click="isEditDialogShown = true"
        >
          <v-icon
              size="35"
          >
            mdi-pencil
          </v-icon>
          <v-dialog
              v-model="isEditDialogShown"
              width="75%"
              persistent
          >
            <edit-task
                :indexForEditing="chosenTaskIndex"
                @closeEditDialog="onClickSaveChanges"
            />
          </v-dialog>
        </v-btn>

        <!--удалить задание-->
        <v-btn
            icon
            :disabled="!isChosenTaskIndexValid"
            @click="isDeleteDialogShown = true"
        >
          <v-icon
              size="35"
          >
            mdi-close-circle-outline
          </v-icon>
          <v-dialog
              v-model="isDeleteDialogShown"
              width="50%"
          >
            <confirmation-window
                type="delete"
                @cancel="isDeleteDialogShown = false"
                @accept="onClickAcceptDeleting"
            />
          </v-dialog>
        </v-btn>
      </v-row>
    </v-container>
    <v-simple-table>
      <thead>
      <tr>
        <th class="text-h6 black--text">
          Задания
        </th>
        <th class="text-h6 black--text">
          Задачи
        </th>
      </tr>
      </thead>

      <tbody>
      <!--список задач-->
      <tr
          v-for="(task, index) in taskList"
          :key="task"
          @click="onClickTask(index)"
          :class="getRowStyle(index)"
      >
        <td class="font-weight-bold text-subtitle-1 title-column">
          {{ task.taskTitle }}
        </td>
        <td class="items-column py-3">
          <!--если список задач длинный, сокращаем до первых трёх элементов-->
          <v-container v-if="task.itemList.length > 3">
            <v-row
                v-for="(item, itemIndex) in task.itemList.slice(0,3)"
                :key="item"
            >
                <v-simple-checkbox
                    :value="item.itemStatus"
                    @input="onInputItemStatus(index, itemIndex, $event)"
                />
                <div class="text-justify item-title-container">
                  <p class="my-1 ml-2">{{ item.itemTitle }}</p>
                </div>
            </v-row>

            <!--всплывающая подсказка с остальными элементами-->
            <v-container>
              <v-tooltip
                  bottom
                  attach
              >
                <template v-slot:activator="{ on, attrs }">
                  <div
                      v-bind="attrs"
                      v-on="on"
                      class="ml-2"
                  >
                    ...
                  </div>
                </template>
                <v-container>
                  <v-row
                      v-for="item in task.itemList"
                      :key="item"
                  >
                        {{ item.itemTitle }}
                        <div
                            v-if="item.itemStatus"
                            class="ml-3"
                        >
                          ✓
                        </div>
                  </v-row>
                </v-container>
              </v-tooltip>
            </v-container>
          </v-container>

          <v-container v-else>
            <v-row
                v-for="(item, itemIndex) in task.itemList"
                :key = "item"
            >

                <v-simple-checkbox
                    :value="item.itemStatus"
                    @input="onInputItemStatus(index, itemIndex, $event)"
                />
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
import ConfirmationWindow from "@/components/ConfirmationWindow";
import {mapState, mapActions} from 'vuex';

export default {
  name: "CurrentTaskList",
  components: {
    ConfirmationWindow,
    EditTask
  },
  data() {
    return {
      chosenTaskIndex: null,
      isEditDialogShown: false,
      isDeleteDialogShown: false
    }
  },
  computed: {
    isChosenTaskIndexValid() {
      return (this.chosenTaskIndex !== null && this.chosenTaskIndex < this.taskList.length);
    },
    ...mapState([
      'taskList'
    ])
  },
  mounted() {
    this.fetchTaskList();
  },
  methods: {
    ...mapActions([
      'addNewTask',
      'deleteTaskByIndex',
      'setStatusOfItem',
      'fetchTaskList'
    ]),
    onClickSaveChanges() {
      this.isEditDialogShown = false;
      this.fetchTaskList();
    },
    onClickTask(index) {
      this.chosenTaskIndex = index;
    },
    onClickAddTask() {
      this.addNewTask();
    },
    onClickAcceptDeleting() {
      this.deleteTaskByIndex(this.chosenTaskIndex);
      this.isDeleteDialogShown = false;
    },
    onInputItemStatus(task_index, item_index, e) {
      this.setStatusOfItem({
        taskIndex: task_index,
        itemIndex: item_index,
        itemStatus: e
      });
    },
    getRowStyle(index) {
      if (index === this.chosenTaskIndex) {
        return 'grey lighten-2';
      }
    }
  }
}
</script>

<style>
.item-title-container {
  max-width: 90%;
}

.items-column {
  width: 70%;
}

</style>
