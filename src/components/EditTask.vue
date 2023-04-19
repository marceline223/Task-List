<template>
  <div>
    <v-card>
      <v-container>
        <v-row justify="space-between" align="start">
          <v-card-title>Редактирование задания</v-card-title>
          <v-btn icon
                 class="ma-3 black--text"
                 @click="onClickCloseDialog"
          >
            <v-icon>mdi-close-box-outline</v-icon>
          </v-btn>
        </v-row>
      </v-container>
      <v-container>
        <v-row>
          <div class="ma-5">Задание:</div>
          <v-text-field :value="newTitle"
                        @change="onChangeTitle"
                        type="input"
                        clearable
                        class="mx-8"
          >
          </v-text-field>
        </v-row>
      </v-container>

      <!--Заголовок и кнопки добавить/удалить-->
      <v-container>
        <v-row>
          <div class="ml-5 mt-1">Список задач:</div>
          <v-btn icon class="mx-2"
                 @click="onClickAddItemButton"
          >
            <v-icon size="35">
              mdi-plus-box-outline
            </v-icon>
          </v-btn>

          <v-btn icon class="mx-2"
                 @click="onClickDeleteItemButton(chosenItemIndex)"
          >
            <v-icon size="35">
              mdi-close-box-outline
            </v-icon>
          </v-btn>
        </v-row>
      </v-container>

      <!--Список задач-->
      <v-simple-table>
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

      <!--КНОПКИ-->
      <v-container>
        <v-row justify="end">
          <!--Назад и вперед-->
          <v-btn class="ma-5"
                 @click="onClickRevertChange"
                 :disabled="!changeToReverse"
          >
            <v-icon>
              mdi-restore
            </v-icon>
          </v-btn>
          <v-btn class="ma-5"
                 @click="onClickRepeatChange"
                 :disabled="!changeToRepeat"
          >
            <v-icon>
              mdi-reload
            </v-icon>
          </v-btn>

          <!--Сохранить и отменить-->
          <v-btn @click="onClickSaveButton" class="ma-5" :disabled="emptyItemTitles">Сохранить</v-btn>
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
    title: String,
    itemList: Array
  },
  data() {
    return {
      newTitle: this.title,

      //это необходимо, чтобы избежать двусторонней привязки массивов и сделать просто копию
      newItemList: JSON.parse(JSON.stringify(this.itemList)),

      chosenItemIndex: -1,

      historyOfChanges: {
        arrayOfChanges: [],
        pointerOfCurrentChange: 0
      }
    }
  },
  computed: {
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
    backUpVersion(type, pointer) {
      let change = this.historyOfChanges.arrayOfChanges[pointer];
      if (change.type === 'changeItemStatus') {
        this.newItemList[change.index].itemStatus = (type === 'prev') ? change.oldValue : change.newValue;
      } else if (change.type === 'changeTitle') {
        this.newTitle = (type === 'prev') ? change.oldValue : change.newValue;
      } else if (change.type === 'changeItemTitle') {
        this.newItemList[change.index].itemTitle = (type === 'prev') ? change.oldValue : change.newValue;
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
    onClickRevertChange() {
      this.historyOfChanges.pointerOfCurrentChange--;
      this.backUpVersion('prev', this.historyOfChanges.pointerOfCurrentChange);
    },
    onClickRepeatChange() {
      this.backUpVersion('next', this.historyOfChanges.pointerOfCurrentChange);
      this.historyOfChanges.pointerOfCurrentChange++;
    },
    onClickSaveButton() {
      this.$emit('saveChanges', {
        title: this.newTitle,
        itemList: this.newItemList
      })
    },
    onClickAddItemButton() {
      this.newItemList.push({
        itemTitle: 'Новая задача',
        itemStatus: false
      })
    },
    onClickCloseDialog() {
      this.$emit('closeEditDialog', {
        title: this.title,
        itemList: this.itemList
      });
    },
    onClickDeleteItemButton(index) {
      if (index !== -1) {
        this.newItemList.splice(index, 1);
      }
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

</style>
