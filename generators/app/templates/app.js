'use strict'

require('dotenv').config()
const app = require('kth-node-server')
const config = require('./config/serverSettings')
const logger = require('./server/logger')

app.use('/api/<%= name%>/', require('./server/systemroutes'))

app.start({
  port: config.port,
  logger
})
