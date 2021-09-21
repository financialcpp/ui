<template lang="pug">
#app
  nav.navbar.is-transparent(ref='nav')
    .container
      .navbar-brand
        nuxt-link.navbar-item(to='/')
          img(src='/fpp-ui.png', style='max-height: 40px')
      .navbar-menu
        .navbar-start
          .navbar-item
            b-icon(icon='fa fa-chart-line')
          nuxt-link.navbar-item(
            to='/live',
            active-class='has-text-info',
            exact
          ) live
          nuxt-link.navbar-item(
            to='/backtest',
            active-class='has-text-info',
            exact
          ) backtest
          nuxt-link.navbar-item(
            to='/filters',
            active-class='has-text-info',
            exact
          ) filters
          nuxt-link.navbar-item(
            to='/server',
            active-class='has-text-info',
            exact
          ) server
        .navbar-end
          .navbar-item
            .flex
              .is-12
                b-icon.icon-left(icon='dollar-sign')
                | 0
  transition(name='fade', mode='out-in')
    div(ref='main')
      nuxt
</template>

<script>
export default {
  mounted() {
    window.addEventListener('resize', this.onResize)
    this.onResize()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize)
  },
  methods: {
    onResize() {
      this.$store.commit('setMainAreaHeight', window.innerHeight)
    },
  },
}
</script>

<style>
#app {
  overflow-y: hidden;
}
</style>