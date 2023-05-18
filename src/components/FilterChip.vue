<template>
  <v-chip
    v-if="type && value"
    class="mx-2 my-1"
    close
    close-icon="mdi-close-outline"
    @click:close="removeFilterParam()"
  >
    {{type}}: {{(type === 'Date') ? $options.filters.formatDate(value) : value.toString()}}
  </v-chip>
</template>

<script>
import { mapMutations } from 'vuex'
import { operationStructure } from '@/store/mappedParams'
export default {
  name: 'FilterChip',
  props: {
    filterParamName: {
      type: String,
      required: true
    },
    value: {
      type: [String, Array],
      default: null
    }
  },
  data: function () {
    return {
      type: null
    }
  },
  created () {
    this.type = this.getParamType(this.filterParamName) // type is used as name for filter param.
  },
  methods: {
    ...mapMutations(['setFilterParam']),
    getParamType (filterParamName) {
      return Object.keys(operationStructure).find(key => operationStructure[key].field === filterParamName)
    },
    removeFilterParam () {
      // Nullifying filter param inside store
      this.setFilterParam({ filterParam: this.filterParamName, filterValue: null })
      this.$emit('deletedFilter', this.type) // Emitting deleted filter param
    }
  }
}
</script>
