<template>
  <v-main>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="6">
          <div class="display-3">RiceCode Budget</div>
          <v-divider />
          <p class="headline pt-4">You have reached the RiceCode Budget.</p>
          <p class="headline pt-4">Please login to continue.</p>
          <v-btn
            v-if="!$auth.isAuthenticated"
            ref="loginBtn"
            class="primary"
            to="/login"
          >
            Login
          </v-btn>
        </v-col>
      </v-row>
    </v-container>

    <v-snackbar
      ref="loginError"
      color="error"
      timeout="-1"
      :value="$route.query.loginError"
    >
      Login failed. Please, make sure you are using right Google Account.
    </v-snackbar>
  </v-main>
</template>

<script>
export default {
  name: 'AboutPage'
}
</script>

<style scoped></style>
