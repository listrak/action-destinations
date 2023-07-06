import type { DestinationDefinition } from '@segment/actions-core'
import type { Settings } from './generated-types'
import addUserToAudience from './addUserToAudience'
import removeUserFromAudience from './removeUserFromAudience'
import { listrakAuthenticate } from './listrak'
import type { ClientCredentials } from './listrak'

const destination: DestinationDefinition<Settings> = {
  name: 'Listrak Audiences',
  slug: 'actions-listrak',
  description: 'Add/remove users to/from Listrak Audiences using Listrak API',
  mode: 'cloud',
  authentication: {
    scheme: 'custom',
    fields: {
      client_id: {
        label: 'API Client ID',
        description: 'Your Listrak API client ID',
        type: 'string',
        required: true
      },
      client_secret: {
        label: 'API Client Secret',
        description: 'Your Listrak API client secret',
        type: 'string',
        required: true
      },
      advertiser_id: {
        label: 'Advertiser ID',
        description: 'Your Listrak Advertiser ID',
        type: 'string',
        required: true
      }
    },
    testAuthentication: async (request, { settings }) => {
      const credentials: ClientCredentials = await listrakAuthenticate(request, {
        client_id: settings.client_id,
        client_secret: settings.client_secret
      })
      return credentials.access_token
    }
  },
  actions: {
    addUserToAudience,
    removeUserFromAudience
  }
}

export default destination
