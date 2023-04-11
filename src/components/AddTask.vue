<template>
  <div>
    <v-card>
      <v-container fluid>
        <v-row justify="space-between" align="start">
          <h3 class="ma-3">Добавление</h3>
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
        <input type="text">
      </v-container>
      <v-container>
        <label>Описание:</label>
        <input type="text">
      </v-container>
      <v-btn @click="onClickAddButton" class="ma-3">Добавить</v-btn>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "AddTask",
  data() {
    return {
      title: '',
      description: '',
      itemList: []
    }
  },
  methods: {
    onClickAddButton() {
      this.$emit('addTask', {
        title: this.title,
        description: this.description,
        itemList: this.itemList
      })
    },
    onClickCloseDialog() {
      this.title = '';
      this.description = '';
      this.itemList = [];
      this.$emit('closeAddDialog');
    }
  }
}
</script>

<style scoped>

</style>
