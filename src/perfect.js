import { Overlay } from 'trading-vue-js'

export default {
    name: 'PerfectTrades',
    mixins: [Overlay],
    methods: {
        draw(ctx) { },
        use_for() { return ['PerfectTrades'] }
    }
}