'use strict'

module.exports = {
  // Do not remove the System controller!
  System: require('./systemCtrl'),

  <% if(useSamples){ %>
  Sample: require('./sampleCtrl')
  <% } %>
}
