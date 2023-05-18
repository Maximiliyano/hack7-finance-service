<template>
  <v-container fluid>
    <v-card v-if="!loading">
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        outlined
        clearable
        hide-details
        class="pa-2 pb-0"
      />
      <v-row dense class="pa-2 pb-0">
        <v-col cols="12" sm="6" md="4" lg="3">
          <v-select
            v-model="filterBy"
            label="Filter by"
            :items="filters"
            outlined
            hide-details
          />
        </v-col>
        <v-col v-if="!!filterBy" cols="12" sm="6" md="4" lg="3">
          <v-menu
            v-if="filterBy === 'Date'"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                :value="filterValue | formatDate"
                :label="filterBy"
                append-icon="mdi-calendar"
                readonly
                hide-details
                outlined
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="filterValue"
              no-title
              scrollable
              range
              color="primary"
            >
            </v-date-picker>
          </v-menu>
          <v-combobox
            v-else
            v-model="filterValue"
            :items="filterValueOptions"
            :label="filterBy"
            :rules="filterRule"
            multiple
            outlined
            hide-details
          />
        </v-col>
          <v-row align="center" justify="space-between" dense>
            <v-col><v-btn @click="deleteSelected" icon v-if="applyToOperations.length > 0" color="error" x-large class="mx-1">
              <v-icon>mdi-delete</v-icon>
            </v-btn></v-col>
            <v-col><v-row align="center" justify="end" dense>

              <v-dialog
                v-model="dialog1"
                persistent
                max-width="600px"
              >
                <template v-slot:activator="{ on, attrs }">
                    <v-btn icon color="success" x-large class="mx-2" v-bind="attrs" v-on="on">
                      <v-icon>mdi-plus-box</v-icon>
                    </v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="text-h5 ml-3">{{ newOperation.id ? 'Edit Operation' : 'New Operation'}}</span>
                  </v-card-title>
                  <v-card-text class="pb-0">
                    <v-container>
                      <v-row>
                        <v-col
                          cols="12"
                          sm="6"
                        >
                          <v-text-field
                            outlined
                            :min="0"
                            v-model.number="newOperation.amount"
                            hide-details
                            type="number"
                            append-icon="mdi-currency-usd"
                            class="inputPrice"
                            hide-spin-buttons
                            label="Amount"
                          ></v-text-field>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="6"
                        >
                          <v-combobox
                            outlined
                            v-model="newOperation.category"
                            hide-details
                            :items="['Salary', 'Food & Dining', 'Transportation', 'Utilities', 'Rent or Mortgage', 'Shopping', 'Entertainment', 'Health & Fitness', 'Travel', 'Education', 'Insurance', 'Investments', 'Taxes', 'Debt Repayment']"
                            label="Category"
                          ></v-combobox>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="6"
                        >
                          <v-menu
                            ref="dialog2"
                            v-model="dialog2"
                            :close-on-content-click="true"
                            hide-details
                            transition="scale-transition"
                            offset-y
                            min-width="auto"
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <v-text-field
                                :value="newOperation.date | formatOneDate"
                                hide-details
                                label="Date"
                                append-icon="mdi-calendar"
                                readonly
                                outlined
                                v-bind="attrs"
                                v-on="on"
                              ></v-text-field>
                            </template>
                            <v-date-picker
                              v-model="newOperation.date"
                              no-title
                              scrollable
                              color="primary"
                            >
                            </v-date-picker>
                          </v-menu>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <v-text-field
                            v-model="newOperation.time"
                            hide-details
                            label="Time"
                            type="time"
                            outlined
                            required
                          ></v-text-field>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="3"
                        >
                          <v-switch
                            class="income_toggle ml-1 mb-0 mt-0 mt-sm-3"
                            inset
                            hide-details
                            color="primary"
                            v-model="newOperation.income"
                            :label="newOperation.income ? 'Income' : 'Expense'"
                            required
                          ></v-switch>
                        </v-col>
                        <v-col cols="12" sm="9">
                          <v-textarea
                            outlined
                            hide-details
                            v-model="newOperation.description"
                            rows="2"
                            label="Description"
                            required
                          ></v-textarea>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="error"
                      text
                      @click="dialog1 = false; resetNewOperation()"
                    >
                      Close
                    </v-btn>
                    <v-btn
                      color="success"
                      text
                      @click="dialog1 = false; updateOperation(newOperation)"
                    >
                      Save
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>

</v-row></v-col>
          </v-row>
      </v-row>
      <v-row dense class="pa-1 bp-0 mt-0" align="center">
        <FilterChip
          v-for="(filterParamName, i) in getFilterChipOptions()"
          :key="filterParamName + i"
          :value="filterParams[filterParamName]"
          :filter-param-name="filterParamName"
          @deletedFilter="deleteFilterChip"
        />
        <v-btn
          v-if="checkFilters()"
          color="primary"
          text
          rounded
          plain
          @click="deleteAllFilters()"
        >
          Clear filters
        </v-btn>
      </v-row>
    </v-card>
    <v-row>
      <v-col cols="12" fluid>
        <v-data-table
          v-model="applyToOperations"
          show-select
          :headers="headers"
          :items="filteredOperations"
          item-key="id"
          :options="{multiSort: true}"
          class="elevation-1 row-pointer"
          :loading="loading"
          loading-text="Loading... Please wait"
          :search="search"
          @pagination="paginationInfo"
          @click:row="chooseRow"
        >
          <template #[`item.amount`]="{ item }">
            <span class="px-4">{{ item.amount }}</span>
          </template>
          <template #[`item.date`]="{ item }">
            <span class="px-4">{{ item.date }}</span>
          </template>
          <template #[`item.time`]="{ item }">
            <span class="px-4">{{ item.time }}</span>
          </template>
          <template #[`item.category`]="{ item }">
            <span class="px-4">{{ item.category }}</span>
          </template>
          <template #[`item.income`]="{ item }">
            <span class="px-4"><v-icon :color="item.income ? 'green' : 'red'">{{ item.income ? 'mdi-cash-plus' : 'mdi-cash-minus'}}</v-icon></span>
          </template>
          <template #[`item.description`]="{ item }">
            <span class="px-4">{{ item.description }}</span>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import _ from 'lodash'
import FilterChip from '@/components/FilterChip'
import { operationStructure } from '@/store/mappedParams'
import { updateUser } from '@/firebaseDb'
import { v4 as uuidv4 } from 'uuid'
export default {
  name: 'OperationsTable',
  components: { FilterChip },
  data () {
    return {
      dialog1: false,
      dialog2: false,
      newOperation: {
        id: '',
        amount: '',
        time: '',
        category: '',
        description: '',
        income: false,
        date: null
      },
      filterBy: null,
      mappedFilterBy: null,
      filterValue: null,
      filterValueOptions: [],
      applyToOperations: [],
      filters: [
        'Amount',
        'Date',
        'Time',
        'Category',
        'Type'
      ],
      search: '',
      itemsCount: null,
      filterRule: [
        (v) => {
          if (v?.length === 0) {
            this.filterValue = null
          }
          return true
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['loading', 'filteredOperations', 'filterParams', 'user', 'operations']),
    headers () {
      return [
        { text: 'Date', value: 'date', sortable: true },
        { text: 'Time', value: 'time', sortable: true },
        { text: 'Category', value: 'category', sortable: true },
        { text: 'Description', value: 'description', sortable: true },
        { text: 'Type', value: 'income', sortable: true },
        { text: 'Amount', value: 'amount', sortable: true }
      ]
    }
  },
  watch: {
    // Selected filter param (first input)
    filterBy: async function (filterBy) {
      this.filterBy = filterBy
      this.mappedFilterBy = operationStructure[this.filterBy].field
      const cacheFilterValue = this.filterParams[this.mappedFilterBy]
      this.filterParams[this.mappedFilterBy] = null
      await this.$store.dispatch('filterOperations')
      this.filterValueOptions = this.getAutocompleteOptions()
      this.filterValue = cacheFilterValue || null
      await this.$store.dispatch('filterOperations')
    },
    // Selected filter value (second input)
    filterValue: async function (filterValue) {
      this.filterValue = filterValue
      // setting filter value to filter param in store
      this.filterParams[this.mappedFilterBy] = this.filterValue
      await this.$store.dispatch('filterOperations')
      if (!this.filterValue) {
        this.filterValueOptions = this.getAutocompleteOptions()
      }
    }
  },
  async created () {
    await this.getUserData(this.$auth.user.email)
  },
  methods: {
    ...mapMutations([
      'setFilteredOperations',
      'setOperations',
      'setLoading',
      'showSnackbar',
      'setSnackbar',
      'setUser'
    ]),
    resetNewOperation () {
      this.newOperation = {
        id: '',
        amount: '',
        time: '',
        category: '',
        description: '',
        income: false,
        date: null
      }
    },
    chooseRow (row) {
      this.dialog1 = true
      this.newOperation = { ...row, date: row.date.split('.').reverse().join('-') }
    },
    async updateOperation (data) {
      data.date = data.date || (new Date()).toISOString().split('T')[0]
      data.time = data.time || (new Date()).toISOString().split('T')[1].slice(0, 5)
      data.category = data.category || 'Other'
      data.amount = Math.abs(data.amount) || 0
      const userData = { ...this.user }
      if (!data.id) {
        data.id = uuidv4()
        userData.operations = userData.operations.concat([{ ...data, date: data.date.split('-').reverse().join('.') }])
        userData.total = data.income ? userData.total + data.amount : userData.total - data.amount
      } else {
        const index = userData.operations.findIndex(operation => operation.id === data.id)
        const targetOperation = userData.operations[index]
        const diff = data.amount - targetOperation.amount
        if (targetOperation.income === data.income) {
          if (data.income) {
            userData.total = diff > 0 ? userData.total + diff : userData.total + diff
          } else {
            userData.total = diff > 0 ? userData.total - diff : userData.total - diff
          }
        } else {
          if (data.income) {
            userData.total += data.amount + targetOperation.amount
          } else {
            userData.total -= (data.amount + targetOperation.amount)
          }
        }
        userData.operations[index] = { ...data, date: data.date.split('-').reverse().join('.') }
      }

      await updateUser(userData)
      this.newOperation = {
        id: '',
        amount: '',
        time: '',
        category: '',
        description: '',
        income: false,
        date: null
      }
      await this.$store.dispatch('getUserInfo', this.user.email)
      // refresh
    },
    async deleteSelected () {
      const operationsIds = this.applyToOperations.map(operation => operation.id)
      const diff = this.applyToOperations.reduce((partialSum, operation) => operation.income ? partialSum - operation.amount : partialSum + operation.amount, 0)
      const updatedOperations = this.user.operations.filter(operation => {
        return !operationsIds.includes(operation.id)
      })
      await updateUser({ ...this.user, total: this.user.total + diff, operations: updatedOperations })
      await this.$store.dispatch('getUserInfo', this.user.email)
      this.applyToOperations = []
    },
    getTargetDate (date) {
      if (date) {
        this.filterValue = date
      } else {
        this.filterValue = null
      }
    },
    async getUserData (email) {
      if (!this.loading) {
        try {
          await this.$store.dispatch('getUserInfo', email)
        } catch (e) {
          console.log(e)
          this.showSnackbar({
            message: 'Error occurred while fetching resources, refresh the page or try again later',
            color: 'error'
          })
        } finally {
          this.setLoading(false)
        }
      }
    },
    paginationInfo (pagination) {
      this.itemsCount = pagination.itemsLength
    },
    getFilterChipOptions () {
      return Object.keys(this.filterParams)
    },
    getAutocompleteOptions () {
      const options = Array.from(
        this.filteredOperations.reduce((acc, operation) => {
          const value = `${operation[this.mappedFilterBy]}`
          if (!_.isEmpty(value)) {
            acc.add(value)
          }
          return acc
        }, new Set())
      ).sort()
      if (this.filterBy === 'Type') {
        return options.map(option => option === 'true' ? 'Income' : 'Expense')
      }
      return options
    },
    // Called when removing filter chip through emit inside filter chip
    async deleteFilterChip (type) {
      this.filterParams[operationStructure[type]?.field] = null
      if (this.filterBy === type) {
        this.filterValue = null
      }
      if (this.filterBy) {
        const cacheFilterValue = this.filterParams[this.mappedFilterBy]
        this.filterParams[this.mappedFilterBy] = null
        await this.$store.dispatch('filterOperations')
        this.filterValueOptions = this.getAutocompleteOptions()
        this.filterParams[this.mappedFilterBy] = cacheFilterValue
        this.filterValue = cacheFilterValue || null
      }
      await this.$store.dispatch('filterOperations')
    },
    checkFilters () {
      for (const v of Object.keys(this.filterParams)) {
        if (this.filterParams[v]) {
          return true
        }
      }
      return false
    },
    async deleteAllFilters () {
      Object.keys(this.filterParams).forEach((v) => {
        this.filterParams[v] = null
      })
      this.filterValue = null
      await this.$store.dispatch('filterOperations')
      this.filterValueOptions = this.getAutocompleteOptions()
    }
  }
}
</script>

<style lang="css" scoped>
.row-pointer >>> tbody tr :hover {
  cursor: pointer;
}

.row-pointer >>> i.mdi-checkbox-marked {
  color: #0277bd;
}

.width-65 {
  max-width: 160px !important;
}

.v-input >>> .v-select__selections {
  flex-wrap: nowrap;
}

.row-pointer >>> table tbody tr td {
  padding: 0;
}

.row-pointer >>> table tbody tr td:first-child {
  padding: 0 16px;
}

.row-pointer >>> a {
  display: grid;
  width: 100%;
  height: 100%;
  align-items: center;
  text-decoration: none;
  color: #000;
  padding: 0 16px;
}

.income_toggle{
  max-width: 55px;
}

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
