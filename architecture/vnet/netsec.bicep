param namePrefix string = uniqueString('')
param location string = resourceGroup().location

module vnet 'vnet.bicep' = {
}

resource nsg 'Microsoft.Network/networkSecurityGroups@2025-07-01' = {
  name: 'NSG-${namePrefix}'
  location: location
properties: {

  securityRules: [
    {
      name: 'Allow SSH'
      properties: {
        access: 'Allow'
        protocol: 'Tcp'
        destinationPortRange: '22'
        sourceAddressPrefix: vnet.outputs.subnet1id
        direction: 'Inbound'
        priority: 100
      }
    }
  ]
}
}
