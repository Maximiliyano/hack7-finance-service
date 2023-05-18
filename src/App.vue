<template>
  <v-app>
    <v-app-bar app clipped-left color="primary" dark>
      <v-app-bar-nav-icon
        v-if="$auth.isAuthenticated"
        @click="drawer = !drawer"
      />
      <v-img
        alt="ricecode budget"
        class="shrink mr-2 mb-4"
        contain
        src=".././public/logo.svg"
        transition="scale-transition"
        width="40"
      />
      <h1 class="ml-100 mt-0">RiceCode Budget</h1>
      <v-spacer />
    </v-app-bar>

    <v-navigation-drawer
      v-if="$auth.isAuthenticated"
      v-model="drawer"
      app
      clipped
      color="grey lighten-4"
      min-width="200"
    >
      <v-list dense nav>
        <v-list-item>
              <v-list>
                <v-list-item>
                  <v-avatar class="mr-auto">
                    <img :src="$auth.user.picture" alt="User Picture" />
                  </v-avatar>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content class="pt-0">
                    <v-list-item-title>
                      {{ $auth.user.name }}
                    </v-list-item-title>
                    <v-list-item-subtitle>{{
                        $auth.user.email
                      }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item v-if="!editBalance">
                  <div class="text-right text-h6">Balance: {{ user.total }}$</div>
                  <v-btn icon @click="editBalance=!editBalance"><v-icon color="primary">mdi-pencil</v-icon></v-btn>
                </v-list-item>
                <v-list-item  v-if="editBalance">
                  <div class="text-right text-h6">Balance:</div>
                  <v-text-field regular append-icon="mdi-currency-usd" class="mb-3 mx-2 inputPrice" hide-details :value="user.total" type="number" v-model.number="currentBalance"></v-text-field>
                  <v-btn icon @click="updateBalance"><v-icon color="green">mdi-check</v-icon></v-btn>
                </v-list-item>
              </v-list>
        </v-list-item>
        <v-list-item to="/operations">
          <v-list-item-action>
            <v-icon>mdi-list-box-outline</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Operations</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/credits">
          <v-list-item-action>
            <v-icon>mdi-cart-percent</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Credits</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/deposits">
          <v-list-item-action>
            <v-icon>mdi-cash-fast</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Deposits</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <template v-slot:append>
        <v-list dense>
          <v-list-item
            link
            @click="$auth.logout"
          >
            <v-list-item-action>
              <v-icon>mdi-logout</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title class="grey--text">
                Log Out
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </template>
    </v-navigation-drawer>
    <v-main>
      <router-view />
    </v-main>
    <v-snackbar
      v-if="snackbarOriginPage === this.$router.currentRoute.path"
      :color="snackbarColor"
      v-model="snackbar"
    >
      {{ snackbarText }}
    </v-snackbar>
  </v-app>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
import { updateUser } from '@/firebaseDb'
export default {
  name: 'App',

  components: {},
  data: () => ({
    editBalance: false,
    drawer: true,
    currentBalance: 0
  }),
  methods: {
    ...mapMutations([
      'setUser'
    ]),
    async updateBalance () {
      console.log(this.currentBalance)
      this.editBalance = !this.editBalance
      await updateUser({ ...this.user, total: +this.currentBalance })
      this.setUser({ ...this.user, total: +this.currentBalance })
    }
  },
  computed: {
    ...mapState(['snackbarColor', 'snackbarText', 'snackbarOriginPage']),
    ...mapGetters(['user']),
    snackbar: {
      get () {
        return this.$store.state.snackbar
      },
      set (value) {
        this.setSnackbar(value)
      }
    }
  },
  watch: {
    user: function (userValue) {
      this.currentBalance = userValue.total
    }
  }
}
</script>
<style lang="css" scoped>
.inputPrice >>> input[type="number"] {
  -moz-appearance: textfield;
}
.inputPrice >>> input::-webkit-outer-spin-button,
.inputPrice >>> input::-webkit-inner-spin-button {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
}
</style>
