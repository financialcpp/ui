<template lang="pug">
.container-fluid.m-3
  .columns.is-multiline.is-gapless
    .column(:class='sidebarClasses')
      .box(style='overflow-y: auto')
        .columns.is-multiline.is-gapless
          .column.is-12
            .is-size-4(v-if='currentBacktest')
              .breadcrumb
                ul
                  li
                    a(@click.prevent='currentBacktest = null')
                      b-icon(icon='vial', size='sm')
                      | Backtests
                  li.is-active
                    a {{ currentBacktest.strategy }}
                      span.has-text-grey.ml-2 #
                        | {{ currentBacktest.id }}

            .has-text-centered.is-size-4(v-else)
              b-icon.icon-left(icon='vial', size='sm')
              | Backtests
          .column.is-12(v-if='currentBacktest')
          .column.is-12(v-else)
            .columns
              .column.is-12.my-3
                .is-size-5.has-text-success
                  b-icon.icon-left(icon='hourglass', size='sm')
                  | Current
                .has-text-grey(v-if='currentBacktests.length == 0') No backtests running
                div(v-else)
                  div(v-for='backtest in currentBacktests')
                    div
                      b-icon.icon-right(size='xl', icon='spinner fa-spin') 
                      span.pl-2 {{ backtest.progress }}%

                      b-progress.m-0(
                        type='is-success',
                        :value='backtest.progress',
                        size='is-small'
                      )

                      .py-1.has-text-danger
                        span.pointer(@click='cancel(backtest)')
                          b-icon(icon='times')
                          | Cancel
            .columns.is-multiline
              .column.is-12.my-3
                .is-size-5.has-text-success 
                  b-icon.icon-left(icon='paper-plane', size='sm')
                  | Submit backtest
                .columns.is-multiline
                  .column.is-12
                    b-field(label='Strategy')
                      b-select(v-model='strategySelected')
                        option(
                          v-for='strategy in strategies',
                          :value='strategy'
                        ) {{ strategy }}
                  .column.is-size-6.is-12
                    .columns.is-multiline
                      .column.is-12
                        b-field(label='Preset Dates')
                          b-button.mr-2(
                            :key='range.label',
                            v-for='range in presetDateRanges',
                            :label='range.label',
                            @click='dateRangeClicked(range)',
                            :class='{ "is-white": range.label == dateRangeSelected }'
                          )
                      .column.is-6
                        b-field(label='From')
                          b-datepicker(
                            v-model='date1',
                            :disabled='dateRangeSelected !== "Custom"',
                            :locale='undefined'
                          )
                      .column.is-6
                        b-field(label='To')
                          b-datepicker(
                            v-model='date2',
                            :disabled='dateRangeSelected !== "Custom"',
                            :locale='undefined'
                          )
                      .column.is-6
                        b-field(label='Symbols')
                          b-select(v-model='symbolsSelected')
                            option(value='all') All (5000+ symbols)
                      .column.is-6
                        b-field(label='Data Provider')
                          b-select(v-model='dataProviderSelected')
                            option(value='activetick', label='Activetick')
                            option(
                              label='Fake/Randomly Generated Data',
                              value='fake'
                            )
                      .column.is-6
                        b-button(@click='submit') 
                          span.has-text-gray.has-text-weight-bold {{ submitButton.label }}
              .column.is-12.my-3
                .is-size-5.has-text-success
                  b-icon.icon-left(icon='history', size='sm')
                  | History
                .has-text-grey(v-if='historyBacktests.length == 0') No history yet
                div(v-else)
                  .pointer.box.p-1.my-2(
                    v-for='backtest in historyBacktests',
                    :key='backtest.id',
                    @click='clickBacktest(backtest)'
                  )
                    div {{ backtest.strategy }}
                      span.has-text-grey.ml-2 #
                        | {{ backtest.id }}
                    div 💎💎💎 {{ backtest.performance * 100 }}%

      .columns.is-multiline.is-gapless
        .column.is-6
    .column(:class='mainClasses')
      .columns.is-multiline.full-height.is-gapless.pl-3
        .column.is-12
          .columns
            .column.is-6(v-if='!$apollo.loading')
              b-autocomplete(
                @select='onSearch',
                @input='onTyping',
                :value='ticker',
                :data='symbols',
                icon='fa fa-search',
                placeholder='Search ticker'
              )
                template(slot-scope='props')
                  | {{ props.option }}
        .column.is-12.full-height
          div(ref='chart')
            fpp-chart(
              v-if='showChart',
              :symbol='tickerSearch',
              :chart='chart',
              :activeSample='activeSample'
            )
</template>

<script>
import gql from 'graphql-tag'

import { DateTime, Duration } from 'luxon'
import ResizeSensor from 'css-element-queries/src/ResizeSensor'


export default {
  mounted() {
    this.$nextTick(() => {
      new ResizeSensor(this.$refs.chart, (event) => {
        this.width = event.width
      })
    })
  },
  data() {
    return {
      activeSample: '1tk',
      tickHistory: [],
      showChart: false,
      width: 0,
      // current backtest page
      currentBacktest: null,

      // all backtests page
      currentBacktests: [],
      historyBacktests: [
        { id: 150, performance: 0.43, strategy: 'gainer-v0.0.2' },
        { id: 151, performance: 0.54, strategy: 'gainer-v0.0.2' },
      ],
      symbolsSelected: 'all',
      presetDateRanges: [
        {
          label: '3 months',
          from: DateTime.local().minus({ months: 3 }).toJSDate(),
          to: new Date(),
        },
        {
          label: '1 month',
          from: DateTime.local().minus({ months: 1 }).toJSDate(),
          to: new Date(),
        },
        { label: 'Custom' },
      ],
      error: {
        submit: '',
      },
      loading: {
        submit: false,
      },
      date1: DateTime.local().minus({ months: 3 }).toJSDate(),
      date2: new Date(),
      dateRangeSelected: '3 months',
      strategySelected: 'Strategy 1',
      strategies: ['Strategy 1', 'Strategy 2'],
      dataProviderSelected: 'fake',
      sidebarExpanded: 1,
      symbols: [],
      fuseSymbols: null,
      tick: null,
      tickerSearch: '',
    }
  },
  methods: {
    async clickBacktest(backtest) {
      this.currentBacktest = backtest
    },
    async cancel({ id }) {
      let {
        data: { cancelBacktest },
      } = await this.$apollo.mutate({
        mutation: gql`
          mutation($id: Int) {
            cancelBacktest(id: $id) {
              success
            }
          }
        `,
        variables() {
          return {
            id,
          }
        },
      })
      if (cancelBacktest.success) {
        let idx = this.currentBacktests.findIndex((b) => {
          return b.id == id
        })
        this.$delete(this.currentBacktests, idx)
      }
    },
    async submit() {
      this.loading.submit = true
      let {
        data: { submitBacktest },
      } = await this.$apollo.mutate({
        mutation: gql`
          mutation(
            $fromDate: String
            $toDate: String
            $symbols: String
            $strategy: Strategy
            $provider: String
          ) {
            submitBacktest(
              fromDate: $fromDate
              toDate: $toDate
              symbols: $symbols
              strategy: $strategy
              provider: $provider
            ) {
              submissionId
            }
          }
        `,
        variables: {
          fromDate: this.date1,
          toDate: this.date2,
          symbols: {
            name: this.symbolsSelected
          },
          strategy: {
            name: this.strategySelected,
            options: JSON.stringify({
              my_option1: 2,
              my_option2: 2
            })
          },
          provider: this.dataProviderSelected,
        },
      })
      this.currentBacktests.push(submitBacktest.backtest)
      this.loading.submit = false
      return
    },
    dateRangeClicked(range) {
      this.dateRangeSelected = range.label
      if (range.label !== 'Custom') {
        this.date1 = range.from
        this.date2 = range.to
      }
    },
    
  },
  apollo: {
    symbols: {
      query: gql`
        query($set: String) {
          symbols(set: $set) {
            name
          }
        }
      `,
      update(data) {
        data.symbols.sort((a, b) => {
          return a.name.localeCompare(b.name)
        })
        const options = {
          keys: ['name'],
        }
        this.fuseSymbols = new Fuse(data.symbols, options)
        return data.symbols
      },
      variables() {
        return {
          set: '',
        }
      },
    },
    tickHistory: {
      query: gql`
        query(
          $symbol: String!
          $fromDate: String
          $toDate: String
          $provider: String
        ) {
          tickHistory(
            symbol: $symbol
            fromDate: $fromDate
            toDate: $toDate
            provider: $provider
          ) {
            time
            price
            size
          }
        }
      `,
      skip() {
        return false
        return this.symbols.some((symbol) => symbol == this.tickerSearch)
      },
      variables() {
        return {
          symbol: this.tickerSearch,
          fromDate: '2020-10-19',
          toDate: '2020-10-21',
          provider: 'fake-provider',
        }
      },
    },
  },
  computed: {
    chart() {
      return {
        chart: {
          type: 'Candles',
          data: this.tickHistory.map((tick) => {
            return [
              parseInt(tick.time),
              tick.price,
              tick.price + 0.01,
              tick.price,
              tick.price - 0.02,
              tick.size,
            ]
          }),
        },
      }
    },
    height() {
      return this.$store.state.mainArea.height
    },
    submitButton() {
      if (this.error.submit) {
        return {
          type: 'is-danger',
          label: 'Submit',
        }
      }
      if (this.loading.submit) {
        return {
          type: 'is-warning',
          label: 'Sending',
        }
      }
      return {
        type: 'is-success',
        label: 'Submit',
      }
    },
    sidebarClasses() {
      return {
        'is-1': this.sidebarExpanded == 0,
        'is-3': this.sidebarExpanded == 1,
        'is-5': this.sidebarExpanded == 2,
      }
    },
    mainClasses() {
      return {
        'is-11': this.sidebarExpanded == 0,
        'is-9': this.sidebarExpanded == 1,
        'is-7': this.sidebarExpanded == 2,
      }
    },

    // symbols() {
    //   let search = this.tickerSearch || ''
    //   return this.fuseSymbols.search(search)
    // },
    
  },
}
</script>


<style>
/* make it rain */
.spin {
  animation-name: spin;
  animation-duration: 5000ms;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}

.move-down {
  animation-name: moveDown;
  animation-duration: 5000ms;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes moveDown {
  from {
    transform: translateY(10px);
  }
  to {
    transform: translate(10000px);
  }
}
</style>