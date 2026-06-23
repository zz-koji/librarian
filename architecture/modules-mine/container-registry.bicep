param location string = resourceGroup().location

param appPrefix string = uniqueString(resourceGroup().id)

param containerRegistryName string = 'registry${appPrefix}'

resource containerRegistry 'Microsoft.ContainerRegistry/registries@2025-11-01' = {
  name: containerRegistryName
  location: location
  sku: {
    name: 'Basic'
  }
  properties: {
    adminUserEnabled: false
    publicNetworkAccess: 'Enabled'
  }
}

// The output of the login server property 
output loginServer string = containerRegistry.properties.loginServer

