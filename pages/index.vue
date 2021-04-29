<template lang="pug">
.container-fluid.m-5
  .columns.is-multiline
    .column.is-12(v-if='isDemo')
      b-message
        b-icon.icon-left(icon='bullhorn')
        | Note: This is a demo page. All stock data is fake/generated

    .column.is-2
      .box
        .columns.is-multiline.is-gapless
          .column.is-12
            .has-text-centered
              b-icon.icon-left(icon='book', size='sm')
              span.is-size-4 Portfolio
          .column.is-12
            .is-size-5
              b-icon.icon-left.has-text-grey-light(
                icon='dollar-sign',
                size='sm'
              )
              | {{ inplay }}

    .column.is-8
      .box
        .columns.is-multiline.is-gapless
          .column
          .column
            .has-text-centered
              b-icon.icon-left(icon='briefcase', size='sm')
              span.is-size-4 Holdings
          .column.has-text-right
            | {{ livetime }}
          .column.is-12
            .columns.has-text-centered.is-gapless
              .column

        .columns.is-multiline.is-gapless
          .column.is-6

    .column.is-2
      .box
        .has-text-centered.is-size-4 
</template>

<script>
import { DateTime } from 'luxon'

let livetimeInterval

const generateLivetime = () => {
  return DateTime.fromJSDate(new Date()).toFormat('d MMMM yyyy HH:mm:ss')
}

export default {
  name: 'HomePage',
  beforeMount() {
    livetimeInterval = window.setInterval(() => {
      this.livetime = generateLivetime()
    }, 1000)
  },
  beforeDestroy() {
    window.clearInterval(livetimeInterval)
  },
  data() {
    return {
      inplay: '30,000',
      livetime: generateLivetime(),
    }
  },
}
</script>
