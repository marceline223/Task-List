<template>
  <v-card class="pa-3">
    <v-card-title class="mb-3">Подтвердите действие</v-card-title>
    <v-card-text>
      Вы действительно хотите {{action}}?
      {{description}}
    </v-card-text>
    <v-container>
      <v-row justify="end">
        <v-btn @click="onClickCancel">Отмена</v-btn>
        <v-btn @click="onClickAccept" class="ml-3">Подтвердить</v-btn>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
export default {
  name: "ConfirmationWindow",
  props: {
    type: String
  },
  computed: {
    action() {
      if (this.type === 'delete') {
        return 'удалить задачу';
      } else if (this.type === 'reset') {
        return 'сбросить все изменения';
      } else {
        return null;
      }
    },
    description() {
      if (this.type === 'reset') {
        return 'Все несохраненные изменения будут удалены.';
      } else {
        return null;
      }
    }
  },
  methods: {
    onClickCancel() {
      this.$emit('cancel');
    },
    onClickAccept() {
      this.$emit('accept');
    }
  }
}
</script>

<style scoped>
</style>
