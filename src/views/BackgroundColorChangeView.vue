<template>
  
    <v-container fluid class="d-flex flex-column" style="height: 100vh; padding: 16px; overflow-x: hidden;">
      
      <!-- スクロール可能部分: タイトル + 色選択 -->
      <div 
        style="max-height: 65vh; overflow-y: auto; overflow-x: hidden; padding-bottom: 16px;"
      >
        <v-row justify="center">
          <v-col cols="12" class="text-center mb-4">
            <h1>背景色変更</h1>
          </v-col>

          <v-col cols="12" sm="10" md="8" class="text-center">
            <div class="mb-4">色を選択してください</div>

            <div v-for="(shades, base) in colorPalette" :key="base" class="mb-4 d-flex flex-wrap justify-center">
              <v-btn
                v-for="(shade, index) in shades"
                :key="index"
                :style="{ backgroundColor: shade }" 
                class="ma-1"
                rounded
                fab
                small
                @click="selectedColor = shade"
              >
                <v-icon v-if="selectedColor === shade" color="white">mdi-check</v-icon>
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </div>

      <!-- 固定ボタン部分 -->
      <v-row justify="center" style="flex-shrink: 0; margin-top: 16px;">
        <v-col cols="12" sm="6" md="4" class="text-center">
          <v-btn color="primary" block @click="changeBackgroundColor">
            変更する
          </v-btn>
          <v-btn text block class="mt-2" @click="goBack">戻る</v-btn>
        </v-col>
      </v-row>

    </v-container>
  
</template>

<script>
import axios from "axios";

export default {
  name: "BackgroundColorChangeView",
  data() {
    return {
       colorPalette: {
      red: ["#FFEBEE", "#FFCDD2", "#EF9A9A"],
      pink: ["#FCE4EC", "#F8BBD0", "#F48FB1"],
      purple: ["#F3e5f5", "#e1bee7", "#ce93d8"],
      "deep-purple": ["#ede7f6", "#d1c4e9", "#b39ddb"],
      indigo: ["#E8EAF6", "#C5CAE9", "#9FA8DA"],
      blue: ["#E3F2FD", "#BBDEFB", "#90CAF9"],
      "light-blue": ["#E1F5FE", "#B3E5FC", "#81D4FA"],
      cyan: ["#E0F7FA", "#B2EBF2", "#80DEEA"],
      teal: ["#E0F2F1", "#B2DFDB", "#80CBC4"],
      green: ["#E8F5E9", "#C8E6C9", "#A5D6A7"],
      "light-green": ["#F1F8E9", "#DCEDC8", "#C5E1A5"],
      lime: ["#F9FBE7", "#F0F4C3", "#E6EE9C"],
      amber: ["#FFF8E1", "#FFECB3", "#FFE082"],
      orange: ["#FFF3E0", "#FFE0B2", "#FFCC80"],
      "deep-orange": ["#FBE9E7", "#FFCCBC", "#FFAB91"],
      brown: ["#EFEBE9", "#D7CCC8", "#BCAAA4"],
      "blue-grey": ["#ECEFF1", "#CFD8DC", "#B0BEC5"],
      gray: ["#FAFAFA", "#F5F5F5", "#EEEEEE"],
      white:["#FFFFFF"]
    },

     
      selectedColor: "#ffffff", // デフォルトは白
      message: "",
      errorMessage: "",
      successDialog: false,
      errorDialog: false,
    };
  },
  mounted() {
    const currentColor = this.$store.getters.currentUser.backgroundColor;
    if (currentColor) {
      this.selectedColor = currentColor;
    }
  },
  methods: {
    async changeBackgroundColor() {
      if (!this.selectedColor) {
        this.errorMessage = "色を選択してください。";
        this.errorDialog = true;
        return;
      }

      try {
        const userId = this.$store.getters.currentUser.id;
        if (!userId) throw new Error("ユーザー情報が取得できません");

        const response = await axios.post(
          "https://m3h-kkikuchi-0820functionapi.azurewebsites.net/api/UPDATEBACKGROUNDCOLOR",
          {
            ID: userId,
            BackgroundColor: this.selectedColor,
          }
        );

        if (response.data?.result === "Succeeded") {
          this.message = "背景の色を変更しました。";

          // Vuex にも HEX を保存
          this.$store.commit("setSession", {
            sessionId: this.$store.state.sessionId,
            userId,
            userName: this.$store.state.userName,
            expiresAt: this.$store.state.expiresAt,
            headerColor: this.$store.state.headerColor,
            backgroundColor: this.selectedColor,
          });

          this.successDialog = true;
          this.errorMessage = "";
        } else {
          this.errorMessage = response.data?.message || "色変更に失敗しました。";
          this.errorDialog = true;
        }
      } catch (err) {
        this.errorMessage = "色変更エラー：" + (err.response?.data || err.message);
        this.errorDialog = true;
      }
    },

    goBack() {
      if (window.history.length > 1) {
        this.$router.back();
      } else {
        this.$router.push("/diary");
      }
    },
  },
};
</script>