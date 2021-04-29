<template>
  <div class="columns is-multiline is-gapless">
    <div class="column is-12 my-1">
      <div class="columns is-gapless">
        <div
          @click="sampleClicked(sample)"
          :key="sample"
          v-for="sample in samples"
          class="column is-narrow mr-2 pointer"
        >
          <div
            class="box p-2"
            :class="activeSample == sample ? 'has-background-primary' : ''"
          >
            {{ sample }}
          </div>
        </div>
      </div>
    </div>
    <div ref="chart" class="column is-12">
      <trading-vue
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
    </div>
  </div>
</template>

<script>
import TradingVue from 'trading-vue-js'
import ResizeSensor from 'css-element-queries/src/ResizeSensor'
export default {
  name: 'Chart',
  props: {
    chart: Object,
    activeSample: String,
  },
  watch: {
    '$store.state.mainArea.height': function () {
      this.setChartSize()
    },
  },
  mounted() {
    this.setChartSize()
    this.$emit('update:activeSample', this.samples[0])
  },
  components: { TradingVue },
  data() {
    return {
      samples: ['1tk', '1m', '1h', '1D'],
      width: 0,
      height: 0,
      colors: {
        colorBack: '#fff',
        colorGrid: '#eee',
        colorText: '#333',
      },
      overlays: [],
    }
  },
  methods: {
    rangedChanged() {},
    setChartSize() {
      let chart = this.$refs.chart.getBoundingClientRect()
      this.width = chart.width

      this.height = this.$store.state.mainArea.height - chart.top - 10
    },
    sampleClicked(sample) {
      this.activeSample = sample
    },
  },
}
</script>