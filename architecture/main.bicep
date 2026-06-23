
param location string = resourceGroup().location

param namePrefix string = 'Kojsource'

@description('Please input your image template without single quotes.')
param image string
//vnet resource group name
param vnetrg string
//container rg group name
param containerrg string

module container 'modules-mine/container.bicep' = {
  name: 'Container-${namePrefix}'
  scope: resourceGroup(containerrg)
  params: {
    image: image
    location: location 
  }
}

module containerregistry 'modules-mine/container-registry.bicep' = {
  name: 'Registry${namePrefix}'
  scope: resourceGroup(containerrg)
  params: {
    location: location
  }
}

module vnet 'vnet/vnet.bicep' = {
  scope: resourceGroup(vnetrg)
}
