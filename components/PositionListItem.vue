<template lang="pug">
        li
            a 
                span {{ticker}}
                span.pl-2 {{percentage}}
</template>

<script>
export default {
    props: {
        ticker: String,
        percentage: Number
    }
}
</script>

<style>
.pl-2 {
  padding-left: 20px;
}
</style>