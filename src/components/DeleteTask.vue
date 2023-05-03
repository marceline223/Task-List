<template>
  <v-card class="pa-3">
    <v-card-title>Подтвердите удаление</v-card-title>
    <v-card-text>
      Удалить задачу?
    </v-card-text>
    <v-container>
      <v-row justify="space-around">
        <v-btn @click="onClickCloseDialog">Отмена</v-btn>
        <v-btn @click="onClickDeleteTask">Удалить</v-btn>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
export default {
  name: "DeleteTask",
  props: {
    indexForDeleting: Number
  },
  methods: {
    onClickDeleteTask() {
      this.$store.commit('DELETE_TASK_BY_INDEX', {
        indexForDeleting: this.indexForDeleting
      });
      this.$emit('closeDeleteDialog');
    },
    onClickCloseDialog() {
      this.$emit('closeDeleteDialog');
    }
  }
}
</script>

<style scoped>

</style>
