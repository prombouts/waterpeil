targetScope = 'subscription'

@description('Name of the resource group that will contain the Static Web App.')
param resourceGroupName string

@description('Globally unique name for the Static Web App.')
param staticWebAppName string

@description('Azure region for the resource group and Static Web App.')
param location string = 'westeurope'

resource appResourceGroup 'Microsoft.Resources/resourceGroups@2024-03-01' = {
  name: resourceGroupName
  location: location
}

module staticWebAppDeployment './staticWebApp.bicep' = {
  name: 'deploy-static-web-app'
  scope: appResourceGroup
  params: {
    staticWebAppName: staticWebAppName
    location: location
  }
}

output resourceGroupName string = appResourceGroup.name
output staticWebAppName string = staticWebAppName
output defaultHostname string = staticWebAppDeployment.outputs.defaultHostname
