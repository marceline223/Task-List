<template>
  <div>
    <v-card class="pa-3">
      <v-container>
        <v-row justify="space-between" align="start">
          <v-card-title>Редактирование задания</v-card-title>
          <v-btn icon
                 class="ma-3 black--text"
                 @click="onClickCloseDialog"
          >
            <v-icon size="35">mdi-close-box-outline</v-icon>
          </v-btn>
        </v-row>
      </v-container>

      <!--ЗАГОЛОВОК ЗАДАЧИ-->
      <v-container>
        <v-row>
          <div class="mx-4 my-5">Задание:</div>
          <v-text-field :value="newTitle"
                        @change="onChangeTitle"
                        type="input"
                        clearable
          >
          </v-text-field>
        </v-row>
      </v-container>

      <v-container>
        <v-row>
          <div class="ml-4 mt-1">Список задач:</div>

          <!--добавить новую задачу-->
          <v-btn icon class="mx-2"
                 @click="onClickAddItemButton"
          >
            <v-icon size="35"> mdi-plus-box-outline</v-icon>
          </v-btn>

          <!--удалить выбранную задачу-->
          <v-btn icon class="mx-2"
                 @click="onClickDeleteItemButton(chosenItemIndex)"
                 :disabled="chosenItemIndex === -1"
          >
            <v-icon size="35"> mdi-close-box-outline</v-icon>
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
        <tr v-for="(item, item_index) in newItemList"
            :key="item_index"
            @click="onClickItem(item_index)"
            :class="rowStyle(item_index)"
        >
          <td>
            <v-simple-checkbox color="black"
                               @input="onInputItemStatus(item_index, $event)"
                               :value="item.itemStatus"
                               :key="item.itemStatus"
            >
            </v-simple-checkbox>
          </td>
          <td>
            <v-text-field :value="item.itemTitle"
                          @change="onChangeItemTitle(item_index, $event)"
                          type="input"
                          clearable
            >
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

          <!--сохранить изменения-->
          <v-btn @click="onClickSaveButton" class="ma-5" :disabled="emptyItemTitles">Сохранить</v-btn>

          <!--отменить все изменения-->
          <v-btn @click="onClickCloseDialog" class="ma-5">Отмена</v-btn>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "EditTask",
  props: {
    indexForEditing: Number
  },
  data() {
    return {
      newTitle: '',
      newItemList: [],
      chosenItemIndex: -1,
      historyOfChanges: {
        arrayOfChanges: [],
        pointerOfCurrentChange: 0
      }
    }
  },
  beforeMount() {
    this.newTitle = this.task.title;

    //это необходимо, чтобы избежать реактивности массивов и сделать просто копию
    this.newItemList = JSON.parse(JSON.stringify(this.task.itemList));
  },
  computed: {
    task() {
      return this.$store.getters.TASK_BY_ID(this.indexForEditing);
    },
    emptyItemTitles() {
      for (let item of this.newItemList) {
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
    onChangeTitle(e) {
      this.deleteLostChanges();
      this.historyOfChanges.arrayOfChanges.push({
        type: 'changeTitle',
        oldValue: this.newTitle,
        newValue: e
      });
      this.historyOfChanges.pointerOfCurrentChange++;

      this.newTitle = e;
    },
    onChangeItemTitle(item_index, e) {
      this.deleteLostChanges();
      this.historyOfChanges.arrayOfChanges.push({
        type: 'changeItemTitle',
        index: item_index,
        oldValue: this.newItemList[item_index].itemTitle,
        newValue: e
      });
      this.historyOfChanges.pointerOfCurrentChange++;

      this.newItemList[item_index].itemTitle = e;
    },
    onInputItemStatus(item_index, e) {
      this.deleteLostChanges();
      this.historyOfChanges.arrayOfChanges.push({
        type: 'changeItemStatus',
        index: item_index,
        oldValue: this.newItemList[item_index].itemStatus,
        newValue: e
      });
      this.historyOfChanges.pointerOfCurrentChange++;

      this.newItemList[item_index].itemStatus = e;
    },
    onClickDeleteItemButton(item_index) {
      if (item_index !== -1) {
        this.deleteLostChanges();
        this.historyOfChanges.arrayOfChanges.push({
          type: 'deleteItem',
          index: item_index,
          oldValue: this.newItemList[item_index]
        });
        this.historyOfChanges.pointerOfCurrentChange++;

        this.newItemList.splice(item_index, 1);
      }
    },
    backUpVersion(type, pointer) {
      let change = this.historyOfChanges.arrayOfChanges[pointer];
      if (change.type === 'changeItemStatus') {
        this.newItemList[change.index].itemStatus = (type === 'prev') ? change.oldValue : change.newValue;
      } else if (change.type === 'changeTitle') {
        this.newTitle = (type === 'prev') ? change.oldValue : change.newValue;
      } else if (change.type === 'changeItemTitle') {
        this.newItemList[change.index].itemTitle = (type === 'prev') ? change.oldValue : change.newValue;
      } else if (change.type === 'addItem') {
        if (type === 'prev') {
          this.newItemList.pop();
        } else {
          this.newItemList.push({
            itemTitle: 'Новая задача',
            itemStatus: false
          })
        }
      } else if (change.type === 'deleteItem') {
        if (type === 'prev') {
          this.newItemList.splice(change.index, 0, change.oldValue);
        } else {
          this.newItemList.splice(change.index, 1);
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
    onClickSaveButton() {
      this.$emit('saveChanges', {
        task: {
          title: this.newTitle,
          itemList: this.newItemList
        }
      })
    },
    onClickAddItemButton() {
      this.deleteLostChanges();
      this.historyOfChanges.arrayOfChanges.push({
        type: 'addItem'
      });
      this.historyOfChanges.pointerOfCurrentChange++;

      this.newItemList.push({
        itemTitle: 'Новая задача',
        itemStatus: false
      })
    },
    onClickCloseDialog() {
      //при закрытии все несохраненные изменения сбрасываются
      this.$emit('closeEditDialog', {
        task: {
          title: this.task.title,
          itemList: this.task.itemList
        }
      });
    },
    onClickItem(index) {
      this.chosenItemIndex = index;
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
