<template>
  <v-tooltip bottom :open-delay="500">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        v-bind="attrs"
        v-on="on"
        icon
        :color="isFavorite ? 'yellow darken-2' : 'grey'"
        @click.stop="toggle"
      >
        <v-icon>mdi-star</v-icon>
      </v-btn>
    </template>
    <span>{{ isFavorite ? "お気に入り解除" : "お気に入り登録" }}</span>
  </v-tooltip>
</template>

<script>
import axios from "axios";

export default {
  name: "FavoriteButton",
  props: {
    diaryId: { type: Number, required: true },
    initialFavorite: { type: Boolean, default: false }
  },
  data() {
    return { isFavorite: this.initialFavorite };
  },
  methods: {
    async toggle() {
      try {
        const userId = this.$store.state.userId;
        const res = await axios.patch(
          `https://m3h-kkikuchi-0820functionapi.azurewebsites.net/api/diaries/${this.diaryId}/favorite`,
          null,
          { params: { userId } }
        );
        this.isFavorite = res.data.is_favorite;
        this.$emit("update", this.isFavorite);
      } catch (err) {
        console.error(err);
        alert("お気に入りの更新に失敗しました");
      }
    }
  },
  watch: {
    initialFavorite(newVal) {
      this.isFavorite = newVal;
    }
  }
};
</script>
