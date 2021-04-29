<template lang="pug">
.mx-5
    .container-fluid
            .columns
                div(style="max-width: 200px;").column
                    //- aside.menu
                    //-     p.menu-label.
                            
                    //-         Open Positions
                            
                    //-     ul.menu-list
                    //-         position-list-item(v-for="item in open" :ticker="item.ticker" :percentage="item.percentage")
                                
                    //-     p.menu-label.
                            
                    //-         Closed Positions
                            
                    //-     ul.menu-list
                    //-         position-list-item(v-for="item in closed" :ticker="item.ticker" :percentage="item.percentage")
                    //-     p.menu-label.
                            
                    //-         Watchlist
                            
                    //-     ul.menu-list
                    //-         position-list-item(v-for="item in watchlist" :ticker="item.ticker" :percentage="item.percentage")
                            
                .column
                    
            
                    
    
</template>

<script>
export default {
  data() {
    return {
      open: [
        { ticker: 'AAPL', percentage: 2.88 },
        { ticker: 'AMZN', percentage: 5.23 },
      ],
      closed: [{ ticker: 'AYYMD', percentage: 46.3 }],
      watchlist: [{ ticker: 'MSFT', percentage: -3.8 }],
    }
  },
}
</script>
