/* eslint-disable @typescript-eslint/no-unused-vars */
// TODO: Remove the above before making PR to Segment

import type { DestinationDefinition, ModifiedResponse } from '@segment/actions-core'
import type { Settings } from './generated-types'
import setEmailProfileFields from './setEmailProfileFields'

class ListrakAuthResponse {
  public access_token: string
  public error: string
}

const destination: DestinationDefinition<Settings> = {
  name: 'Listrak',
  slug: 'actions-listrak',
  mode: 'cloud',

  authentication: {
    scheme: 'oauth2',
    fields: {
      client_id: {
        label: 'Client ID',
        description: 'Your Listrak Segment Integration\'s Client ID',
        type: 'string',
        required: true
      },
      client_secret: {
        label: 'Client Secret',
        description: 'Your Listrak Segment Integration\'s Client Secret',
        type: 'string',
        required: true
      }
    },
    testAuthentication: async (request, { auth }) => {
      const res: ModifiedResponse<ListrakAuthResponse> = await request('https://auth.listrak.com/OAuth2/Token', {
        method: 'POST',
        body: new URLSearchParams({
          client_id: auth.client_id,
          client_secret: auth.client_secret,
          grant_type: 'client_credentials'
        })
      })
      if (res.status == 200) {
        return { accessToken: res.data.access_token }
      } else {
        throw new Error(res.status + res.statusText)
      }
      return { accessToken: res.data.access_token }
    },
    refreshAccessToken: async (request, { auth }) => {
      const res: ModifiedResponse<ListrakAuthResponse> = await request('https://auth.listrak.com/OAuth2/Token', {
        method: 'POST',
        body: new URLSearchParams({
          client_id: auth.client_id,
          client_secret: auth.client_secret,
          grant_type: 'client_credentials'
        })
      })
      return { accessToken: res.data.access_token }
    }
  },
  extendRequest: ({ settings }) => {
    return {
      prefixUrl: `https://api.listrak.com/email/v1`,
      headers: { Authorization: `Bearer ${settings.access_token}` },
      responseType: 'json'
    }
  },

  onDelete: async (request, { settings, payload }) => {
    console.log(request)
    console.log(settings)
    console.log(payload)
    // Return a request that performs a GDPR delete for the provided Segment userId or anonymousId
    // provided in the payload. If your destination does not support GDPR deletion you should not
    // implement this function and should remove it completely.
  },

  actions: {
    setEmailProfileFields
  }
}

export default destination
