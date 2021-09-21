<template>
  <div class="columns is-multiline is-gapless">
    <div class="column is-12">
      <div class="columns">
        <div class="column is-6" v-if='!$apollo.queries.symbols.loading'>
          <b-autocomplete
            @select='onSearch'
            @input='onTyping'
            :value='ticker'
            :data='symbols'
            icon='fa fa-search'
            placeholder='Search ticker'
          >
          <template slot-scope="props">
            {{props.option.name}}
          </template>
          </b-autocomplete>
        </div>
      </div>
    </div>
    <div class="column is-12 my-1">
      <div class="columns is-gapless">
        <div
          @click="sampleClicked(sample)"
          :key="sample"
          v-for="sample in samples"
          class="column is-narrow mr-2 pointer"
        >
        <span class="is-size-4">
          {{ sample }}
        </span>
        </div>
      </div>
    </div>
    <div ref="chart" class="column is-12">
      <trading-vue
        v-if="showChart"
        ref="tvjs"
        @range-changed="rangeChanged"
        :data="chart"
        :width="width"
        :height="height"
        :overlays="overlays"
        :color-back="colors.colorBack"
        :color-grid="colors.colorGrid"
        :color-text="colors.colorText"
      >
      </trading-vue>
      <div class="dashed-box full-height" v-else>
        <img src="/profit.svg" />
      </div>
    </div>
  </div>
</template>

<script>
import TradingVue from 'trading-vue-js'
import gql from 'graphql-tag'
import Fuse from 'fuse.js'

export default {
  name: 'FppChart',
  watch: {
    tickHistory() {
      this.$refs.tvjs && this.$refs.tvjs.resetChart()
    },
    barHistory() {
      this.$refs.tvjs && this.$refs.tvjs.resetChart()
      },
    activeSample() {
      this.$refs.tvjs && this.$refs.tvjs.resetChart()
    },
    '$store.state.mainArea.height': function () {
      // kind of a hack to rely on some global state like this
      // TODO: fix global mainArea.height hack
      this.setChartSize()
    },
  },
  mounted() {
    // this will make the chart fill up the entire space
    this.setChartSize()
  },
  components: { TradingVue },
  data() {
    return {
      tickerSearch: '',
      
      samples: ['1tk', '1m', '1h', '1D'],
      activeSample: '1D',

      width: 0,
      height: 0,
      colors: {
        colorBack: '#fff',
        colorGrid: '#eee',
        colorText: '#333',
      },
      overlays: [],

      symbols: [],
      tickHistory: [],
      barHistory: [],

    }
  },
  computed: {
    showChart() {
      return this.tickHistory.length || this.barHistory.length
    },
    chart() {
      if (this.activeSample == '1tk') {
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
            })
          }
        }
      } else if (this.activeSample == '1D') {
        return {
          chart: {
            type: 'Candles',
            data: this.barHistory.map((bar) => {
              return [
                parseInt(bar.time),
                bar.open,
                bar.high,
                bar.low,
                bar.close,
                bar.volume,
              ]
            })
          }
          
        }
      } else {
        throw new Error(`${this.activeSample} not implemented`)
      }
    },
    ticker: {
      get() {
        return this.tickerSearch
      },
      set(value) {
        this.tickerSearch = value
      },
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
        return !this.symbols.some(symbol => symbol.name == this.tickerSearch) 
            || this.activeSample !== '1tk'
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
    barHistory: {
      query: gql`
        query(
          $symbol: String!
          $provider: String
          $unit: Unit
          $sample: Int

        ) {
          barHistory(
            symbol: $symbol
            provider: $provider
            unit: $unit
            sample: $sample
          ) {
            time
            open
            high
            low
            close
            volume
          }
        }
      `,
      skip() {
        return !this.symbols.some(symbol => symbol.name == this.tickerSearch) 
            || this.activeSample !== '1D'
      },
      variables() {
        return {
          symbol: this.tickerSearch,
          provider: 'fake-provider',
          unit: 'DAY',
          sample: 1
        }
      },
    },
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
  },
  methods: {
    showSymbol({symbol, activeSample = '1D'}) {
      this.tickerSearch = symbol
      this.activeSample = '1D'
    },
    onSearch(item) {
      this.tickerSearch = item.name
    },
    onTyping(text) {
      if (text) {
        this.tickerSearch = text
      }
    },
    rangeChanged() {},
    setChartSize() {
      let chart = this.$refs.chart.getBoundingClientRect()
      this.width = chart.width

      this.height = this.$store.state.mainArea.height - chart.top - 30
    },
    sampleClicked(sample) {
      this.activeSample = sample
    },
  },
}
</script>

<style>
.dashed-box {
  height: 400px;
}
</style>