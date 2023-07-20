<template>
  <v-card class="pa-3">
    <v-card-title class="mb-3">
      Подтвердите действие
    </v-card-title>
    <v-card-text>
      Вы действительно хотите {{ action }}?
      {{ description }}
    </v-card-text>
    <v-container>
      <v-row
          justify="end"
      >
        <v-btn @click="onClickCancel">
          Отмена
        </v-btn>
        <v-btn
            class="ml-3"
            @click="onClickAccept"
        >
          Подтвердить
        </v-btn>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
export default {
  name: "ConfirmationWindow",
  props: {
    type : {
      type: String,
      default: ''
    }
  },
emits: ['cancel', 'accept'],
  computed: {
    action() {
      switch(this.type) {
        case 'delete':
          return 'удалить задачу';
        case 'reset':
          return 'сбросить все изменения';
        default:
          return null;
      }
    },
    description() {
      switch (this.type) {
        case 'reset':
          return 'Все несохраненные изменения будут удалены.';
        default:
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
