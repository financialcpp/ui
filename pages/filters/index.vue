<template lang="pug">
.container-fluid.m-3
  .columns.is-multiline.is-gapless
    .column
      .box
        .columns.is-multiline

          .column.is-4
            .columns.is-multiline
              .column.is-12
                | Filters
                div
                  b-select(v-model='filterSelected' placeholder="Choose a filter...")
                    option(
                      v-for='filter in filters',
                      :value='filter.id'
                    ) {{ filter.name }}
                  div Showing results for past 3 months
                  // TODO: Allow running filters with a dateRange
              .column.is-12
                | Results
                div(v-if="loading.results")
                  | Waiting for results
                  b-button(@click="checkForResults") Check for results
                div(v-else)
                  b-button(@click="runFilter") Run Filter
                div(v-if="filterResult")
                  div
                    | Symbols
                  div(v-for="symbol in filterResult.symbols" :key="symbol.name" @click="clickSymbol({symbol})").pointer.py-2
                    | {{symbol}}
          .column.is-8.full-height
              fpp-chart(
                ref='chart'
                symbol='aapl',
              )
</template>

<script>
import gql from 'graphql-tag'

export default {
  data() {
    return {
      loading: {
        results: false
      },

      filters: [],
      filterSelected: null,
      filterResult: null,

      jobId: null,
    }
  },
  apollo: {
    filters: {
      query: gql`
        query {
          filters {
            id
            name
          }
        }
      `
    }
  },
  methods: {
    clickSymbol({symbol}) {
      this.$refs.chart.showSymbol({symbol})
    },
    async checkForResults() {
      let jobId = this.jobId

      let {
        data: {
          getFilterResult: filterResult
       }
      } = await this.$apollo.query({
        query: gql`
          query($id: Int!) {
            getFilterResult(id: $id) {
              symbols
            }
          }
        `,
        variables: {
            id: jobId
        },
      })
      if (filterResult) {
        this.filterResult = filterResult
        this.loading.results = false
      }
    },
    async runFilter() {
      let filterId = this.filterSelected  
      let {
        data: {
          runFilter: {
            id
          }
       }
      } = await this.$apollo.mutate({
        mutation: gql`
          mutation($id: String!) {
            runFilter(id: $id) {
              id
            }
          }
        `,
        variables: {
            id: filterId
        },
      })
      if (id) {
        this.loading.results = true
        this.jobId = id
      }
    }
  }
}
</script>