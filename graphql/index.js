const { FppServer } = require('financialcpp')

const express = require('express')

// Create express instance
const app = express()

const server = FppServer()

server.applyMiddleware({ app, path: '/' })

module.exports = server()