<template>
  <v-container fluid>
    <v-btn @click="dialog = true" color="success" fab class="float_btn"><v-icon>mdi-plus</v-icon></v-btn>

    <v-dialog
      v-model="dialog"
      persistent
      width="600px"
    >
      <v-card>
        <v-card-title>
          <span class="text-h5">New Deposit</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-container>
            <v-row>
              <v-col
                cols="12"
              >
                <v-text-field
                  label="Bank name"
                  v-model="newCredit.bankName"
                  outlined
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col
                cols="12"
                sm="6"
              >
                <v-text-field
                  label="First payment"
                  type="date"
                  v-model="newCredit.startDate"
                  outlined
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col
                cols="12"
                sm="6"
              >
                <v-text-field
                  label="Last payment"
                  type="date"
                  v-model="newCredit.endDate"
                  outlined
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  class="inputPrice"
                  append-icon="mdi-percent-outline"
                  label="Interest Rate"
                  v-model.number="newCredit.percentage"
                  type="number"
                  outlined
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  label="Sum"
                  v-model.number="newCredit.total"
                  append-icon="mdi-currency-usd"
                  class="inputPrice"
                  outlined
                  hide-details
                  type="number"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="error"
            text
            @click="dialog = false"
          >
            Close
          </v-btn>
          <v-btn
            color="success"
            text
            @click="addCredit()"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-row>
      <v-col cols="12" md="6" lg="4" v-for="(credit, index) in user.deposits" v-bind:key="credit.id">
        <v-card
          class="mx-auto"
        >
          <v-card-title class="primary--text text--white d-flex justify-space-between">
            {{ credit.bankName }}
            <v-btn icon small @click="deleteCredit(index)">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-subtitle class="text-center display-1 pt-4">
            {{ calculateCreditPayment(credit) }}$
          </v-card-subtitle>

          <v-card-subtitle class="text-center caption py-0">
            Monthly Payment
          </v-card-subtitle>

          <v-card-actions>
            <v-btn
              v-if="edit !== index"
              color="primary"
              text
              @click="editCredit(credit, index)"
            >
              Edit
            </v-btn>
            <v-btn
              v-else
              color="success"
              text
              @click="saveCredit(credit, index)"
            >
              Save
            </v-btn>

            <v-spacer></v-spacer>

            <v-btn
              icon
              @click="show === index ? show = -1 : show = index"
            >
              <v-icon>{{ show === index ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
            </v-btn>
          </v-card-actions>

          <v-expand-transition>
            <div v-show="show === index">
              <v-divider></v-divider>

              <v-card-text>
                <v-row justify="center" class="my-0">
                  <v-col cols="5" class="text-left px-0" style="padding-right: 5px;">Start date:</v-col>
                  <v-col cols="5" class="text-right px-0" style="padding-left: 5px;">

                    <v-text-field v-if="edit===index" v-model='date1' solo class="pt-0 mt-n3 ml-2" type="date" hide-details></v-text-field>
                    <div v-if="show===index&&edit!==index">{{ credit.startDate }}</div>
                  </v-col>
                </v-row>
                <v-row justify="center" class="my-0">
                  <v-col cols="5" class="text-left px-0" style="padding-right: 5px;">End date:</v-col>
                  <v-col cols="5" class="text-right px-0" style="padding-left: 5px;">
                    <v-text-field v-if="edit===index" v-model='date2' solo class="pt-0 mt-n3 ml-2" type="date" hide-details></v-text-field>
                    <div v-if="show===index&&edit!==index">{{ credit.endDate }}</div>
                  </v-col>
                </v-row>
                <v-row justify="center" class="my-0">
                  <v-col cols="5" class="text-left px-0" style="padding-right: 5px;">Interest rate:</v-col>
                  <v-col cols="5" class="text-right px-0" style="padding-left: 5px;">
                    <v-text-field v-if="edit===index" v-model.number='credit.percentage' solo class="pt-0 mt-n3 ml-2 inputPrice" type="number" hide-details></v-text-field>
                    <div v-if="show===index&&edit!==index">{{ credit.percentage }}%</div>
                  </v-col>
                </v-row>
                <v-row justify="center" class="my-0">
                  <v-col cols="5" class="text-left px-0" style="padding-right: 5px;">Sum:</v-col>
                  <v-col cols="5" class="text-right px-0" style="padding-left: 5px;">
                    <v-text-field v-if="edit===index" v-model.number='credit.total' solo class="pt-0 mt-n3 ml-2 inputPrice" type="number" hide-details></v-text-field>
                    <div v-if="show===index&&edit!==index">{{ credit.total }}</div>
                  </v-col>
                </v-row>
                <v-row justify="center" class="my-0">
                  <v-col cols="5" class="text-left px-0" style="padding-right: 5px;">Profit:</v-col>
                  <v-col cols="5" class="success--text text-right px-0" style="padding-left: 5px;">{{ (calculateCreditPayment(credit)*(getTerm(credit)))}}$</v-col>
                </v-row>
                <v-row justify="center" class="my-0">
                  <v-col cols="5" class="text-left px-0" style="padding-right: 5px;">Term:</v-col>
                  <v-col cols="5" class="text-right px-0" style="padding-left: 5px;">{{ getTerm(credit) }} month</v-col>
                </v-row>
              </v-card-text>
            </div>
          </v-expand-transition>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { v4 as uuidv4 } from 'uuid'
import { updateUser } from '@/firebaseDb'

export default {
  name: 'DepositsComponent',
  components: { },
  data () {
    return {
      show: -1,
      date1: null,
      date2: null,
      edit: -1,
      dialog: false,
      newCredit: {
        id: '',
        startDate: '',
        endDate: '',
        percentage: '',
        bankName: '',
        total: ''
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
    addCredit () {
      console.log(this.newCredit)
      this.newCredit.id = uuidv4()
      this.newCredit.startDate = this.newCredit.startDate.split('-').reverse().join('.')
      this.newCredit.endDate = this.newCredit.endDate.split('-').reverse().join('.')
      this.user.deposits.unshift(this.newCredit)
      updateUser(this.user)
      this.dialog = false
    },
    confirmAdd () {

    },
    saveCredit (credit, index) {
      credit.startDate = this.date1.split('-').reverse().join('.')
      credit.endDate = this.date2.split('-').reverse().join('.')
      this.show = -1
      this.edit = -1
      updateUser(this.user)
      // update here
    },
    editCredit (credit, index) {
      this.show = index
      this.edit = index
      this.date1 = credit.startDate.split('.').reverse().join('-')
      this.date2 = credit.endDate.split('.').reverse().join('-')
    },
    deleteCredit (index) {
      this.show = -1
      this.edit = -1
      this.user.deposits.splice(index, 1)
      updateUser(this.user)
    },
    getDateDifference (date1, date2) {
      const [day1, month1, year1] = date1.split('.')
      const [day2, month2, year2] = date2.split('.')

      const dateObj1 = new Date(`${year1}-${month1}-${day1}`)
      const dateObj2 = new Date(`${year2}-${month2}-${day2}`)

      const diffMonths = (dateObj2.getFullYear() - dateObj1.getFullYear()) * 12 +
        (dateObj2.getMonth() - dateObj1.getMonth())
      return diffMonths || 1
    },
    calculateCreditPayment (credit) {
      const percentage = credit.percentage
      const initialSum = credit.total
      const monthlyInterestRate = percentage / 12 / 100

      const monthlyPayment = initialSum * monthlyInterestRate
      console.log(monthlyPayment)
      return Number(monthlyPayment.toFixed(2))
    },
    getTerm (credit) {
      return this.getDateDifference(credit.startDate, credit.endDate)
    }
  },
  computed: {
    ...mapGetters(['loading', 'filteredOperations', 'filterParams', 'user', 'operations'])
  }
}
</script>

<style lang="css" scoped>
.float_btn {
  position: fixed;
  right: 50px;
  bottom: 50px;
  z-index: 1000;
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
