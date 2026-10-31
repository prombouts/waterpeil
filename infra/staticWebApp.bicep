targetScope = 'resourceGroup'

@description('Globally unique name for the Static Web App.')
param staticWebAppName string

@description('Azure region for the Static Web App.')
param location string

resource staticWebApp 'Microsoft.Web/staticSites@2022-09-01' = {
  name: staticWebAppName
  location: location
  sku: {
    name: 'Free'
    tier: 'Free'
  }
  properties: {}
}

output defaultHostname string = staticWebApp.properties.defaultHostname
