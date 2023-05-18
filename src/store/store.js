import Vuex from 'vuex'
import Vue from 'vue'
import _ from 'lodash'
import { getUser } from '@/firebaseDb'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
  },
  state: {
    loading: false,
    snackbar: false,
    snackbarText: '',
    snackbarColor: 'error',
    snackbarOriginPage: '',
    user: {},
    filteredOperations: [],
    credits: [],
    deposits: [],
    total: 0,
    operations: [],
    operation: {},
    filterParams: {
      amount: null,
      date: null,
      time: null,
      category: null,
      income: null,
      description: null
    },
    filterFunctions: {
      amount: (operations, amount) => operations.filter(operation => amount.includes(operation.amount.toString())),
      date: (operations, dates) => {
        const datesRange = dates.slice(0, 2).sort()
        const [dateFrom, dateTo] = datesRange
        return operations.filter(operation => {
          const date = operation.date.split('.').reverse().join('-')
          return dateTo ? date >= dateFrom && date <= dateTo : date === dateFrom
        })
      },
      time: (operations, time) => operations.filter(operation => time.includes(operation.time)),
      category: (operations, category) => operations.filter(operation => category.includes(operation.category)),
      income: (operations, income) => operations.filter(operation => income.includes(operation.income ? 'Income' : 'Expense'))
    }
  },
  getters: {
    loading: state => state.loading,
    user: state => state.user,
    deposits: state => state.deposits,
    total: state => state.total,
    operations: state => state.operations,
    filteredOperations: state => state.filteredOperations,
    filterParams: state => state.filterParams
  },
  mutations: {
    setUser: (state, user) => {
      state.user = user
    },
    setOperation: (state, operation) => {
      state.operation = operation
    },
    setOperations: (state, operations) => {
      state.operations = operations
    },
    setFilteredOperations: (state, filteredOperations) => {
      state.filteredOperations = filteredOperations
    },
    setLoading: (state, loading) => {
      state.loading = loading
    },
    setFilterParam: (state, { filterParam, filterValue }) => {
      state.filterParams[filterParam] = filterValue
    },
    showSnackbar: (state, options) => {
      state.snackbar = true
      state.snackbarText = options.text || 'Something went wrong'
      state.snackbarColor = options.color || 'error'
    },
    setSnackbar: (state, value) => {
      state.snackbar = value
    }
  },
  actions: {
    getUserInfo: (context, email) => {
      return getUser(email)
        .then(response => {
          if (response) {
            const sortedOperations = _.orderBy(response.operations, ['date', 'time'], ['desc', 'desc'])
            context.commit('setOperations', sortedOperations)
            context.commit('setFilteredOperations', sortedOperations)
            context.commit('setUser', response)
          }
        })
        .catch(() => {
          // console.error(`Connection issues. ${err}`)
          // throw new Error(err.message)
        })
    },
    filterOperations (context) {
      let filteredOperations = context.state.operations
      for (const filterParam in context.state.filterParams) { // Get filter param name
        const filterValue = context.state.filterParams[filterParam] // Get filter value by filter param name
        if (_.isNull(filterValue)) { // if filter value is null we skip this filter
          continue
        }
        filteredOperations = context.state.filterFunctions[filterParam](filteredOperations, filterValue) // filter with filter function that we pick by filter param name
      }
      context.commit('setFilteredOperations', filteredOperations)
    }
  }
})
