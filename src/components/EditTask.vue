<template>
  <div>
    <v-card>
      <v-container fluid>
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
          <v-text-field :value="title"
                        @input="onInput('title', $event)"
                        type="input"
                        clearable
                        class="mx-5"
          >
          </v-text-field>
        </v-row>
      </v-container>
      <v-container>
        <v-row>
          <div class="ml-5 mt-1">Список задач:</div>
          <v-btn icon>
            <v-icon class="black--text">
              mdi-plus-box-outline
            </v-icon>
          </v-btn>

          <v-btn icon>
            <v-icon class="black--text">
              mdi-close-box-outline
            </v-icon>
          </v-btn>
        </v-row>
      </v-container>
      <v-container>
        <v-row justify="end">
          <v-btn class="ma-5" icon>
            <v-icon>
              mdi-restore
            </v-icon>
          </v-btn>

          <v-btn class="ma-5" icon>
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
      newItemList: this.itemList
    }
  },
  methods: {
    onClickSaveButton() {
      this.$emit('saveChanges', {
        title: this.newTitle,
        itemList: this.newItemList
      })
    },
    onClickCloseDialog() {
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
