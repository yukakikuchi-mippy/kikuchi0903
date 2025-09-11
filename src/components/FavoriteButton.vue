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
     <!-- ツールチップの中身 -->
    <span>{{ isFavorite ? "お気に入り解除" : "お気に入り登録" }}</span>
  </v-tooltip>
</template>

<script>
import axios from "axios";

export default {
  name: "FavoriteButton",
  props: {
    // 日記ID（必須）
    diaryId: { type: Number, required: true },
    // 初期状態（お気に入り済みかどうか）
    initialFavorite: { type: Boolean, default: false }
  },
  data() {
    return { 
      // ローカルの状態（親から渡された初期値で初期化）
      isFavorite: this.initialFavorite 
      };
  },
  methods: {
    // ボタンでお気に入り
    async toggle() {
      try {
        const userId = this.$store.state.userId;
        const res = await axios.patch(
          `https://m3h-kkikuchi-0820functionapi.azurewebsites.net/api/diaries/${this.diaryId}/favorite`,
          null,
          { params: { userId } }
        );
        // API から返ってきた状態で更新
        this.isFavorite = res.data.is_favorite;
        this.$emit("update", this.isFavorite);
      } catch (err) {
        console.error(err);
        alert("お気に入りの更新に失敗しました");
      }
    }
  },
  watch: {
     // 親から props が更新されたときにローカル状態も同期
    initialFavorite(newVal) {
      this.isFavorite = newVal;
    }
  }
};
</script>
