<template>
  <v-card
      class="pa-3"
  >
    <v-container>
      <v-row
          justify="space-between"
          align="start"
      >
        <v-card-title>
          Редактирование задания
        </v-card-title>
        <v-btn
            icon
            class="ma-3 black--text"
            @click="onClickResetChanges"
        >
          <v-icon
              size="35"
          >
            mdi-close-box-outline
          </v-icon>
        </v-btn>
      </v-row>
    </v-container>

    <!--заголовок задачи-->
    <v-container>
      <v-row>
        <div class="mx-4 my-5">
          Задание:
        </div>
        <v-text-field
            :value="newTask.taskTitle"
            @change="onChange('changeTitle', null, $event)"
            type="text"
            clearable
        />
      </v-row>
    </v-container>

    <v-container>
      <v-row>
        <div
            class="ml-4 mt-1"
        >
          Список задач:
        </div>

        <!--добавить новую задачу-->
        <v-btn
            icon
            class="mx-2"
            @click="onChange('addItem')"
        >
          <v-icon size="35"> mdi-plus-circle-outline</v-icon>
        </v-btn>

        <!--удалить выбранную задачу-->
        <v-btn
            icon
            class="mx-2"
            @click="onChange('deleteItem', chosenItemIndex)"
            :disabled="chosenItemIndex === null || chosenItemIndex >= newTask.itemList.length"
        >
          <v-icon size="35"> mdi-close-circle-outline</v-icon>
        </v-btn>
      </v-row>
    </v-container>

    <!--список задач-->
    <v-simple-table
        class="task-items-table"
        dense
    >
      <thead>
      <tr>
        <th class="text-h6 black--text">Статус</th>
        <th class="text-h6 black--text">Название</th>
      </tr>
      </thead>
      <tbody>
      <tr
          v-for="(item, itemIndex) in newTask.itemList"
          :key="item.id"
          @click="onClickItem(itemIndex)"
          :class="rowStyle(itemIndex)"
      >
        <td>
          <v-simple-checkbox
              @input="onChange('changeItemStatus', itemIndex, $event)"
              :value="item.itemStatus"
              :key="item.id"
          />
        </td>
        <td>
          <v-text-field
              :value="item.itemTitle"
              @change="onChange('changeItemTitle', itemIndex, $event)"
              type="text"
              dense
              class="pt-2"
              clearable
          />
        </td>
      </tr>
      </tbody>
    </v-simple-table>

    <!--кнопки манипуляций с изменениями-->
    <v-container>
      <v-row justify="end">
        <!--отменить последнее изменение-->
        <v-btn
            class="ma-5"
            @click="revertChange"
            :disabled="!changeToReverse"
        >
          <v-icon>mdi-restore</v-icon>
        </v-btn>

        <!--вернуть последнее изменение-->
        <v-btn
            class="ma-5"
            @click="repeatChange"
            :disabled="!changeToRepeat"
        >
          <v-icon>mdi-reload</v-icon>
        </v-btn>

        <!--отменить все изменения-->
        <v-btn
            @click="onClickResetChanges"
            class="ma-5"
        >
          Отмена
          <v-dialog
              v-model="showResetDialog"
              width="50%"
          >
            <confirmation-window
                type="reset"
                @cancel="showResetDialog = false"
                @accept="closeDialog"
                :key="showResetDialog"
            />
          </v-dialog>
        </v-btn>

        <!--сохранить изменения-->
        <v-btn
            @click="onClickSave"
            class="ma-5"
            :disabled="emptyItemTitles"
        >
          Сохранить
        </v-btn>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>

import ConfirmationWindow from "@/components/ConfirmationWindow";
import {mapState, mapActions} from "vuex";

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
        taskTitle: '',
        itemList: [],
      },
      historyOfChanges: {
        arrayOfChanges: [],
        pointerOfCurrentChange: 0
      },
      chosenItemIndex: null,
      showResetDialog: false
    }
  },
  beforeMount() {
    this.newTask.taskTitle = this.task.taskTitle;

    //это необходимо, чтобы избежать реактивности массивов и сделать просто копию
    this.newTask.itemList = JSON.parse(JSON.stringify(this.task.itemList));
  },
  computed: {
    emptyItemTitles() {
      //проверяем до первого пустого элемента
      return this.newTask.itemList.find(item => (!item.itemTitle || !item.itemTitle.trim()));
    },
    changeToRepeat() {
      return (this.historyOfChanges.pointerOfCurrentChange !== this.historyOfChanges.arrayOfChanges.length);
    },
    changeToReverse() {
      return (this.historyOfChanges.pointerOfCurrentChange !== 0);
    },
    ...mapState({
      task(state) {
        return state.taskList[this.indexForEditing];
      }
    }),
    ...mapState([
      'currentItemId'
    ])
  },
  methods: {
    ...mapActions([
        'setTaskByIndex',
        'increaseItemId'
    ]),
    closeDialog() {
      this.$emit('closeEditDialog');
    },
    onClickItem(index) {
      this.chosenItemIndex = index;
    },
    onClickSave() {
      this.setTaskByIndex({
        indexForSetting: this.indexForEditing,
        task: this.newTask
      })
      this.$emit('closeEditDialog');
    },
    onChange(typeOfChange, itemIndex, e) {
      //метод-оболочка для всех типов изменений
      this.deleteLostChanges(); //удалить все изменения после текущего состояния

      switch (typeOfChange) {
        case 'changeTitle':
          this.historyOfChanges.arrayOfChanges.push({
            type: 'changeTitle',
            oldValue: this.newTask.taskTitle,
            newValue: e
          });
          this.newTask.taskTitle = e;
          break;

        case 'addItem':
          this.historyOfChanges.arrayOfChanges.push({
            type: 'addItem'
          });
          this.newTask.itemList.push({
            id: this.currentItemId,
            itemTitle: 'Новая задача',
            itemStatus: false
          });
          this.increaseItemId();
          break;

        case 'changeItemTitle':
          this.historyOfChanges.arrayOfChanges.push({
            type: 'changeItemTitle',
            index: itemIndex,
            oldValue: this.newTask.itemList[itemIndex].itemTitle,
            newValue: e
          });
          this.newTask.itemList[itemIndex].itemTitle = e;
          break;

        case 'changeItemStatus':
          this.historyOfChanges.arrayOfChanges.push({
            type: 'changeItemStatus',
            index: itemIndex,
            oldValue: this.newTask.itemList[itemIndex].itemStatus,
            newValue: e
          });
          this.newTask.itemList[itemIndex].itemStatus = e;
          break;

        case 'deleteItem':
          this.historyOfChanges.arrayOfChanges.push({
            type: 'deleteItem',
            index: itemIndex,
            oldValue: this.newTask.itemList[itemIndex]
          });
          this.newTask.itemList.splice(itemIndex, 1);
          break;
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
        this.newTask.taskTitle = (type === 'prev') ? change.oldValue : change.newValue;
      } else if (change.type === 'changeItemTitle') {
        this.newTask.itemList[change.index].itemTitle = (type === 'prev') ? change.oldValue : change.newValue;
      } else if (change.type === 'addItem') {
        if (type === 'prev') {
          this.newTask.itemList.pop();
        } else {
          this.newTask.itemList.push({
            id: this.currentItemId,
            itemTitle: 'Новая задача',
            itemStatus: false
          });
          this.increaseItemId();
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
