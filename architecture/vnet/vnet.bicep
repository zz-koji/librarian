param location string = resourceGroup().location
// Unique vnet name
param namePrefix string = 'vnet-${uniqueString('')}'


//Vnet resource - used to declare address prefix
resource vnet 'Microsoft.Network/virtualNetworks@2025-07-01' = {
  name: namePrefix
  location: location
  properties: {
    addressSpace: {
      addressPrefixes: [
        '10.0.0.0/16'
      ]
    }
  }
}
//defining 1st subnet - both are individual resources
resource subnet 'Microsoft.Network/virtualNetworks/subnets@2025-07-01' = {
  name: 'sub1-${namePrefix}'
  parent: vnet
  properties: {
    addressPrefix: '10.0.0.0/24'
  }
}

output vnetout string = vnet.id
output subnet1id string = subnet.id
