import { ActionDefinition, IntegrationError } from '@segment/actions-core'
import { type ClientCredentials, getRequestHeaders } from '../listrak'
import type { Settings } from '../generated-types'
import type { Payload } from './generated-types'
import type { RequestClient } from '@segment/actions-core'

const BASE_API_URL = 'https://api.listrak.com/email/v1'

const processPayload = async (
  request: RequestClient,
  settings: Settings,
  payload: Payload[],
  listId: number
): Promise<Response> => {
  const credentials: ClientCredentials = {
    client_id: settings.client_id,
    client_secret: settings.client_secret
  }

  if (!listId)
    throw new IntegrationError(`The List ID should be a number (${listId})`, 'Invalid input', 400)

  const endpoint = `${BASE_API_URL}/audiences/${listId}/contactlist`
  const headers = await getRequestHeaders(request, credentials)
  const json = {
    data: payload
  }
  return request(endpoint, {
    method: 'PATCH',
    json: json,
    headers: headers
  })
}

const action: ActionDefinition<Settings, Payload> = {
  title: 'Add users to Audience',
  description: 'Add users from Listrak audience by connecting to Listrak API',
  defaultSubscription: 'type = "track" and event = "Audience Entered"',
  fields: {
    listId: {
      label: 'List ID',
      required: true,
      description: "Identifier used to locate the list.",
      type: 'number'
    },
    email: {
      label: 'Email',
      description: "Email address of the contact.",
      type: 'string',
      format: 'email',
      required: true,
      default: {
        '@path': '$.context.traits.email'
      }
    },
    segmentationFieldValues: {
      label: 'Segmentation Field Values',
      description: 'Profile field values associated with the contact.',
      type: 'object',
      multiple: true,
      required: true,
      properties: {
        segmentationFieldId: {
          label: 'Segmentation Field Id',
          type: 'number',
          required: true
        },
        value: {
          label: 'Value',
          type: 'string',
          required: true
        }
      }
    }
  },
  perform: async (request, { settings, payload }) => {
    return await processPayload(request, settings, [payload], 0)
  },
  performBatch: async (request, { settings, payload }) => {
    return await processPayload(request, settings, payload, 0)
  }
}
export default action
