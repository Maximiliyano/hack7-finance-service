<template>
  <v-container fluid>
    <v-row align="center" justify="space-between" class="px-4">
      <v-col class="pb-sm-3 pb-0 px-sm-2 px-2"><div class="text-h5">Operations</div></v-col>
    </v-row>
    <OperationsTable/>
  </v-container>
</template>

<script>
import OperationsTable from '@/components/OperationsTable'
export default {
  name: 'OperationsPage',
  components: { OperationsTable },
  data: () => ({

  }),
  methods: {

  }

}
</script>
