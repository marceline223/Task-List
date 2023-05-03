<template>
  <div>
    <v-card class="pa-3">
      <v-container>
        <v-row justify="space-between" align="start">
          <v-card-title>Редактирование задания</v-card-title>
          <v-btn icon
                 class="ma-3 black--text"
                 @click="onClickResetChanges">
            <v-icon size="35">mdi-close-box-outline</v-icon>
          </v-btn>
        </v-row>
      </v-container>

      <!--заголовок задачи-->
      <v-container>
        <v-row>
          <div class="mx-4 my-5">Задание:</div>
          <v-text-field :value="newTask.title"
                        @change="onChange('changeTitle', null, $event)"
                        type="input"
                        clearable>
          </v-text-field>
        </v-row>
      </v-container>

      <v-container>
        <v-row>
          <div class="ml-4 mt-1">Список задач:</div>

          <!--добавить новую задачу-->
          <v-btn icon class="mx-2"
                 @click="onChange('addItem')">
            <v-icon size="35"> mdi-plus-circle-outline</v-icon>
          </v-btn>

          <!--удалить выбранную задачу-->
          <v-btn icon class="mx-2"
                 @click="onChange('deleteItem', chosenItemIndex)"
                 :disabled="chosenItemIndex === -1">
            <v-icon size="35"> mdi-close-circle-outline</v-icon>
          </v-btn>
        </v-row>
      </v-container>

      <!--список задач-->
      <v-simple-table class="task-items-table">
        <thead>
        <tr>
          <th class="text-h6 black--text">Статус</th>
          <th class="text-h6 black--text">Название</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, item_index) in newTask.itemList"
            :key="item_index"
            @click="onClickItem(item_index)"
            :class="rowStyle(item_index)">
          <td>
            <v-simple-checkbox @input="onChange('changeItemStatus', item_index, $event)"
                               :value="item.itemStatus"
                               :key="item.itemStatus">
            </v-simple-checkbox>
          </td>
          <td>
            <v-text-field :value="item.itemTitle"
                          @change="onChange('changeItemTitle', item_index, $event)"
                          type="input"
                          clearable>
            </v-text-field>
          </td>
        </tr>
        </tbody>
      </v-simple-table>

      <!--кнопки манипуляций с изменениями-->
      <v-container>
        <v-row justify="end">
          <!--отменить последнее изменение-->
          <v-btn class="ma-5"
                 @click="revertChange"
                 :disabled="!changeToReverse">
            <v-icon> mdi-restore</v-icon>
          </v-btn>

          <!--вернуть последнее изменение-->
          <v-btn class="ma-5"
                 @click="repeatChange"
                 :disabled="!changeToRepeat">
            <v-icon> mdi-reload</v-icon>
          </v-btn>

          <!--отменить все изменения-->
          <v-btn @click="onClickResetChanges" class="ma-5">Отмена
            <v-dialog v-model="showResetDialog" width="50%">
              <confirmation-window type="reset"
                                   @cancel="showResetDialog = false"
                                   @accept="closeDialog"
                                   :key="showResetDialog">
              </confirmation-window>
            </v-dialog>
          </v-btn>

          <!--сохранить изменения-->
          <v-btn @click="onClickSave" class="ma-5" :disabled="emptyItemTitles">Сохранить</v-btn>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>

<script>

import ConfirmationWindow from "@/components/ConfirmationWindow";

export default {
  name: "EditTask",
  props: {
    indexForEditing: Number
  },
  components: {
    ConfirmationWindow
  },
  data() {
    return {
      newTask: {
        title: '',
        itemList: [],
      },
      chosenItemIndex: -1,
      historyOfChanges: {
        arrayOfChanges: [],
        pointerOfCurrentChange: 0
      },
      showResetDialog: false
    }
  },
  beforeMount() {
    this.newTask.title = this.task.title;

    //это необходимо, чтобы избежать реактивности массивов и сделать просто копию
    this.newTask.itemList = JSON.parse(JSON.stringify(this.task.itemList));
  },
  computed: {
    task() {
      return this.$store.getters.TASK_BY_ID(this.indexForEditing);
    },
    emptyItemTitles() {
      for (let item of this.newTask.itemList) {
        if (!item.itemTitle) {
          return true;
        }
        let trimTitle = item.itemTitle.trim();
        if (!trimTitle) {
          return true;
        }
      }
      return false;
    },
    changeToRepeat() {
      return (this.historyOfChanges.pointerOfCurrentChange !== this.historyOfChanges.arrayOfChanges.length);
    },
    changeToReverse() {
      return (this.historyOfChanges.pointerOfCurrentChange !== 0);
    }
  },
  methods: {
    closeDialog() {
      this.$emit('closeEditDialog');
    },
    onClickItem(index) {
      this.chosenItemIndex = index;
    },
    onClickSave() {
      this.$store.commit('SET_TASK_BY_INDEX', {
        indexForSetting: this.indexForEditing,
        task: this.newTask
      });
      this.$emit('closeEditDialog');
    },

    onChange(type, item_index, e) {
      //метод-оболочка для всех типов изменений
      this.deleteLostChanges(); //удалить все изменения после текущего состояния

      switch (type) {
        case 'changeTitle':
          this.historyOfChanges.arrayOfChanges.push({
            type: 'changeTitle',
            oldValue: this.newTask.title,
            newValue: e
          });
          this.newTask.title = e;
          break;

        case 'addItem':
          this.historyOfChanges.arrayOfChanges.push({
            type: 'addItem'
          });
          this.newTask.itemList.push({
            itemTitle: 'Новая задача',
            itemStatus: false
          })
          break;

        case 'changeItemTitle':
          this.historyOfChanges.arrayOfChanges.push({
            type: 'changeItemTitle',
            index: item_index,
            oldValue: this.newTask.itemList[item_index].itemTitle,
            newValue: e
          });
          this.newTask.itemList[item_index].itemTitle = e;
          break;

        case 'changeItemStatus':
          this.historyOfChanges.arrayOfChanges.push({
            type: 'changeItemStatus',
            index: item_index,
            oldValue: this.newTask.itemList[item_index].itemStatus,
            newValue: e
          });
          this.newTask.itemList[item_index].itemStatus = e;
          break;

        case 'deleteItem':
          if (item_index !== -1) {
            this.deleteLostChanges();
            this.historyOfChanges.arrayOfChanges.push({
              type: 'deleteItem',
              index: item_index,
              oldValue: this.newTask.itemList[item_index]
            });
            this.newTask.itemList.splice(item_index, 1);
            break;
          }
      }
      this.historyOfChanges.pointerOfCurrentChange++;
    },
    onClickResetChanges() {
      if (this.historyOfChanges.pointerOfCurrentChange === 0) {
        //если изменений нет, можно просто закрыть окно без предупреждения
        this.closeDialog();
      } else {
        //иначе - показываем диалоговое окно с просьбой подтвердить
        this.showResetDialog = true;
      }
    },

    backUpVersion(type, pointer) {
      let change = this.historyOfChanges.arrayOfChanges[pointer];
      if (change.type === 'changeItemStatus') {
        this.newTask.itemList[change.index].itemStatus = (type === 'prev') ? change.oldValue : change.newValue;
      } else if (change.type === 'changeTitle') {
        this.newTask.title = (type === 'prev') ? change.oldValue : change.newValue;
      } else if (change.type === 'changeItemTitle') {
        this.newTask.itemList[change.index].itemTitle = (type === 'prev') ? change.oldValue : change.newValue;
      } else if (change.type === 'addItem') {
        if (type === 'prev') {
          this.newTask.itemList.pop();
        } else {
          this.newTask.itemList.push({
            itemTitle: 'Новая задача',
            itemStatus: false
          })
        }
      } else if (change.type === 'deleteItem') {
        if (type === 'prev') {
          this.newTask.itemList.splice(change.index, 0, change.oldValue);
        } else {
          this.newTask.itemList.splice(change.index, 1);
        }
      }
    },
    deleteLostChanges() {
      let pointer = this.historyOfChanges.pointerOfCurrentChange;
      let length = this.historyOfChanges.arrayOfChanges.length;
      if (pointer !== length) {
        //если при внесении изменения указатель был не в конце (то есть были изменения после текущей версии), то
        //последующие версии сбрасываются
        let countToDelete = length - pointer;
        this.historyOfChanges.arrayOfChanges.splice(this.historyOfChanges.pointerOfCurrentChange, countToDelete);
      }
    },
    revertChange() {
      this.historyOfChanges.pointerOfCurrentChange--;
      this.backUpVersion('prev', this.historyOfChanges.pointerOfCurrentChange);
    },
    repeatChange() {
      this.backUpVersion('next', this.historyOfChanges.pointerOfCurrentChange);
      this.historyOfChanges.pointerOfCurrentChange++;
    },
    rowStyle(index) {
      if (index === this.chosenItemIndex) {
        return 'grey lighten-2'
      } else {
        return ''
      }
    }
  }
}
</script>

<style scoped>
.task-items-table {
  max-width: 95%;
}
</style>
