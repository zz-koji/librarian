param location string = resourceGroup().location

param namePrefix string = 'Kojsource'

module container 'modules-mine/container.bicep' = {
  name: 'Container-${namePrefix}'
  params: {
    location: location 
  }
}

module containerregistry 'modules-mine/container-registry.bicep' = {
  name: 'Registry${namePrefix}'
  params: {
    location: location
  }
}
