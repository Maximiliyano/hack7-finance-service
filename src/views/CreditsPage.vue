<template>
  <v-container fluid>
    <v-row align="center" justify="space-between" class="px-4">
      <v-col class="pb-sm-3 pb-0 px-sm-2 px-2">
        <div class="text-h5">Credits</div>
      </v-col>
      <v-col cols="12" sm="9" class="pt-sm-3 pt-0"></v-col>
    </v-row>
    <CreditsComponent/>
  </v-container>
</template>
<script>
import CreditsComponent from '@/components/CreditsComponent.vue'
export default {
  name: 'CreditsPage',
  components: { CreditsComponent }
}
</script>
