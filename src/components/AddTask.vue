<template>
  <div>
    <v-container>
      <label>Название:</label>
      <input type="text">
    </v-container>
    <v-container>
      <label>Описание:</label>
      <input type="text">
    </v-container>
    <v-btn @click="onClickAddButton">Добавить</v-btn>
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
  }
}
</script>

<style scoped>

</style>
