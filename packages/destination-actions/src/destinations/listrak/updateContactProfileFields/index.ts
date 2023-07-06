import { ActionDefinition } from '@segment/actions-core'
import { getAudienceId, patchAudience, hash } from '../listrak'
import type { Operation, ClientCredentials } from '../listrak'
import type { Settings } from '../generated-types'
import type { Payload } from './generated-types'
import type { RequestClient } from '@segment/actions-core'

const getOperationFromPayload = async (
  request: RequestClient,
  advertiser_id: string,
  payload: Payload[],
  credentials: ClientCredentials
): Promise<Operation> => {
  const add_user_list: string[] = []
  let audience_key = ''

  /*
  The logic below assumes that all events within the batch will have the same audience_key
  Customers should connect single audience to each instance of Listrak audience
  */

  for (const event of payload) {
    let email = undefined

    if (!audience_key && event.audience_key)
      audience_key = event.audience_key

    email = event.hash_emails ? hash(event.email) : event.email
    if (email) add_user_list.push(email)
  }

  const audience_id = await getAudienceId(request, advertiser_id, audience_key, credentials)
  const operation: Operation = {
    operation_type: "add",
    audience_id: audience_id,
    user_list: add_user_list,
  }
  return operation;
}

const processPayload = async (
  request: RequestClient,
  settings: Settings,
  payload: Payload[]
): Promise<Response> => {
  const credentials: ClientCredentials = {
    client_id: settings.client_id,
    client_secret: settings.client_secret
  }
  const operation: Operation = await getOperationFromPayload(request, settings.advertiser_id, payload, credentials);
  return await patchAudience(request, operation, credentials)
}

const action: ActionDefinition<Settings, Payload> = {
  title: 'Add users to Audience',
  description: 'Add users from Listrak audience by connecting to Listrak API',
  defaultSubscription: 'type = "track" and event = "Audience Entered"',
  fields: {
    email: {
      label: 'Email',
      description: "Email address of the contact.",
      type: 'string',
      format: 'email',
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
    return await processPayload(request, settings, [payload])
  },
  performBatch: async (request, { settings, payload }) => {
    return await processPayload(request, settings, payload)

  }
}
export default action
