/* eslint-disable @typescript-eslint/no-unused-vars */
// TODO: Remove the above before making PR to Segment

import type { DestinationDefinition, ModifiedResponse } from '@segment/actions-core'
import type { Settings } from './generated-types'
import setEmailProfileFields from './setEmailProfileFields'

class ListrakAuthResponse {
  public access_token: string
}

const destination: DestinationDefinition<Settings> = {
  name: 'Listrak',
  slug: 'actions-listrak',
  mode: 'cloud',

  authentication: {
    scheme: 'oauth2',
    fields: {},
    testAuthentication: (request) => {
      console.log(request)
      // Return a request that tests/validates the user's credentials.
      // If you do not have a way to validate the authentication fields safely,
      // you can remove the `testAuthentication` function, though discouraged.
    },
    refreshAccessToken: async (request, { auth }) => {
      // Return a request that refreshes the access_token if the API supports it

      // TODO: Write an actual auth. This is commented out for local testing.

      const res: ModifiedResponse<ListrakAuthResponse> = await request('https://auth.listrak.com/OAuth2/Token', {
        method: 'POST',
        // headers: {
        //   'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        // },
        body: new URLSearchParams({
          client_id: auth.clientId,
          client_secret: auth.clientSecret,
          grant_type: 'client_credentials'
        })
      })
      console.log(res)
      return { accessToken: res.data.access_token }
    }
  },
  extendRequest({ auth }) {
    return {
      headers: {
        authorization: `Bearer ${auth?.accessToken}`
      }
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
