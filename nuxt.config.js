const webpack = require('webpack')

require('dotenv').config()

export default {
    /*
   ** Nuxt target
   ** See https://nuxtjs.org/api/configuration-target
   */
    target: 'static',

    /*
     ** Headers of the page
     ** See https://nuxtjs.org/api/configuration-head
     */
    head: {
        title: process.env.npm_package_name || '',
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            {
                hid: 'description',
                name: 'description',
                content: process.env.npm_package_description || '',
            },
        ],
        link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
        link: [
            {
                rel: 'stylesheet',
                href:
                    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.14.0/css/all.min.css',
                integrity:
                    'sha512-1PKOgIY59xJ8Co8+NE6FZ+LOAZKjy+KY8iq0G4B3CyeY6wYHN3yt9PW0XpSriVlkMXe40PTKnXrLnZ9+fkDaog==',
                crossorigin: 'anonymous',
            },
        ],
    },
    /*
     ** Global CSS
     */
    css: ['~assets/css/main.scss'],
    /*
     ** Plugins to load before mounting the App
     ** https://nuxtjs.org/guide/plugins
     */
    plugins: ['~plugins/global.js', '~plugins/global.client.js'],
    /*
     ** Auto import components
     ** See https://nuxtjs.org/api/configuration-components
     */
    components: true,
    /*
     ** Nuxt.js dev-modules
     */
    buildModules: [],
    /*
     ** Nuxt.js modules
     */
    modules: [
        // Doc: https://buefy.github.io/#/documentation
        ['nuxt-buefy', { defaultIconPack: 'fa', css: false }],
        // Doc: https://axios.nuxtjs.org/usage
        '@nuxtjs/axios',

        '@nuxtjs/apollo',

        ['@nuxtjs/dotenv', {}]
    ],

    apollo: {
        clientConfigs: {
            default: {
                httpEndpoint: 'http://localhost:3000/graphql',
            },
        },
    },

    /*
     ** Build configuration
     ** See https://nuxtjs.org/api/configuration-build/
     */
    build: {
        extend(config) {
            config.module.rules.push({
                test: /\.(graphql|gql)$/,
                exclude: /node_modules/,
                loader: 'graphql-tag/loader',
            })

            config.plugins.push(
                new webpack.DefinePlugin({
                    __DEMO__: JSON.stringify(
                        process.env.DEMO == 'true'
                    ),
                })
            )
        },
    },

    serverMiddleware: {
        '/graphql': '~/graphql',
    },
}
