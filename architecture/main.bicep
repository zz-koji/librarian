param location string = resourceGroup().location

param namePrefix string = 'Kojsource'
@description('Please input your image template without single quotes.')
param image string

module container 'modules-mine/container.bicep' = {
  name: 'Container-${namePrefix}'
  params: {
    image: image
    location: location 
  }
}

module containerregistry 'modules-mine/container-registry.bicep' = {
  name: 'Registry${namePrefix}'
  params: {
    location: location
  }
}
