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
                        v-model="newTitle"
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
            <v-simple-checkbox v-model="item.itemStatus"
                               color="black"
            >
            </v-simple-checkbox>
          </td>
          <td>
            <v-text-field :value="item.itemTitle"
                          v-model="item.itemTitle"
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
          <v-btn class="ma-5">
            <v-icon>
              mdi-restore
            </v-icon>
          </v-btn>

          <v-btn class="ma-5">
            <v-icon>
              mdi-reload
            </v-icon>
          </v-btn>

          <v-btn @click="onClickSaveButton" class="ma-5">Сохранить</v-btn>
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
      newItemList: this.itemList,
      chosenItemIndex: -1
    }
  },
  methods: {
    onClickSaveButton() {
      this.$emit('saveChanges', {
        title: this.newTitle,
        itemList: this.newItemList
      })
    },
    onClickAddItemButton() {
      this.newItemList.push({
        itemTitle: '',
        itemStatus: false
      })
    },
    onClickCloseDialog() {
      this.$emit('closeEditDialog');
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
