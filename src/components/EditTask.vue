<template>
  <div>
    <v-card>
      <v-container fluid>
        <v-row justify="space-between" align="start">
          <h3 class="ma-3">Редактирование</h3>
          <v-btn icon
                 class="ma-3 black--text"
                 @click="onClickCloseDialog"
          >
            <v-icon>mdi-close-box-outline</v-icon>
          </v-btn>
        </v-row>
      </v-container>
      <v-container>
        <label>Название:</label>
        <input type="text" :value="title"
               @input="onInput('title', $event)">
      </v-container>
      <v-btn @click="onClickCloseDialog" class="ma-3">Сбросить</v-btn>
      <v-btn @click="onClickSaveButton" class="ma-3">Сохранить изменения</v-btn>
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
      newItemList: this.itemList
    }
  },
  methods: {
    onClickSaveButton(e) {
      this.$emit('saveChanges', {
        title: this.newTitle,
        itemList: this.newItemList
      })
    },
    onClickCloseDialog(e) {
      this.newTitle = '';
      this.newItemList = [];
      this.$emit('closeEditDialog');
    },
    onInput(type, e) {
      if (type === 'title') {
        this.newTitle = e.target.value;
      }
    }
  }
}
</script>

<style scoped>

</style>
