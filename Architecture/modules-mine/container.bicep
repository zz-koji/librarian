@description('Application suffix that will be applied to all resources')
param appSuffix string = uniqueString(resourceGroup().id)

@description('Deployment location')
param location string = resourceGroup().location

@description('The name of the log analytics workspace')
param logAnalyticsworkspaceName string = 'log-${appSuffix}'

@description('Application insights name')
param appInsightsname string = 'appinsights-${appSuffix}'

@description('The name of the container app environment')
param containerAppEnvironment string = 'env-${appSuffix}'

var containerAppName = 'kojicontainer24'


resource logAnalytics 'Microsoft.OperationalInsights/workspaces@2025-07-01' = {
  name: logAnalyticsworkspaceName
  location: location
  properties: {
    sku: {
      name: 'PerGB2018'
    }
  }
}

resource appInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: appInsightsname 
  location: location
  kind: 'web'
   properties: {
    Application_Type: 'web'
   }
}
// This is the environment in which the container app lives on
resource env 'Microsoft.App/managedEnvironments@2026-01-01' = {
  name: containerAppEnvironment 
  location: location 
  properties: {
    appLogsConfiguration: {
      destination: 'log-analytics'
      logAnalyticsConfiguration: {
        customerId: logAnalytics.properties.customerId
        sharedKey: logAnalytics.listKeys().primarySharedKey
      }
    }
  }
}
// Below is the container app itself
resource containerApp 'Microsoft.App/containerApps@2026-01-01' = {
  name: containerAppName
  location: location
  properties: {
    managedEnvironmentId: env.id
    configuration: {
      // below is the "ingress" of traffic - basically what is allowed to come into the container app. In this case external connections are allowed on
      // port 80, and insecure traffic is blocked. It uses the latest revision, and the "Weight" is 100% of inbound traffic. 
    ingress: {
      external: true
      targetPort: 80
      allowInsecure: false
      traffic: [
        {
          latestRevision: true
          weight: 100
        }
      ]
    }
  }
  template: {
    containers: [
      {
        name: containerAppName
        image: 'mcr.microsoft.com/k8se/quickstart:latest' 
        resources: {
          cpu: 1
          memory: '2Gi'
        }
      }
    ]
    scale: {
      minReplicas: 0
      maxReplicas: 3
    }
  }
 }
}
