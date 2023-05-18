<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title class="text-center">
            <v-spacer />
            Page not found
            <v-spacer />
          </v-card-title>
          <v-card-actions>
            <v-btn
              class="secondary"
              to="/"
            >
              Back to Main Page
            </v-btn>
            <v-spacer />
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'NotFoundPage'
}
</script>

<style scoped>

</style>
