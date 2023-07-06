import { DestinationDefinition, RetryableError } from '@segment/actions-core'
import type { Settings } from './generated-types'

import updateContactProfileFields from './updateContactProfileFields'

const destination: DestinationDefinition<Settings> = {
  name: 'Listrak',
  slug: 'actions-listrak',
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
        description: 'Your Lisrak API client secret',
        type: 'string',
        required: true
      }
    },
    testAuthentication: async (request, { settings }) => {
      const res = await request(`https://auth.listrak.com/OAuth2/Token`, {
        method: 'POST',
        body: new URLSearchParams({
          client_id: settings.client_id,
          client_secret: settings.client_secret,
          grant_type: 'client_credentials'
        }),
        headers: {
          Accept: 'text/plain', // TODO: remove this header
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })

      try {
        const json = await res.json()
        if (!json.access_token) {
          throw new RetryableError(`Error while getting an access token`)
        }
      } catch {
        throw new RetryableError(`Error while getting an access token`)
      }
    }
  },
  actions: {
    updateContactProfileFields
  }
}

export default destination
