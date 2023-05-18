<template>
  <v-container fluid>
    <v-row align="center" justify="space-between" class="px-4">
      <v-col class="pb-sm-3 pb-0 px-sm-2 px-2">
        <div class="text-h5">Deposits</div>
      </v-col>
      <v-col cols="12" sm="9" class="pt-sm-3 pt-0"></v-col>
    </v-row>
    <DepositsComponent/>
  </v-container>
</template>
<script>
import DepositsComponent from '@/components/DepositsComponent.vue'

export default {
  name: 'DepositsPage',
  components: { DepositsComponent }
}
</script>
