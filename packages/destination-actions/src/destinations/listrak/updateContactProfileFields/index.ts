import type { ActionDefinition } from '@segment/actions-core'
import type { Settings } from '../generated-types'
import type { Payload } from './generated-types'

const action: ActionDefinition<Settings, Payload> = {
  title: 'Update Contact Profile Fields',
  description: '',
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
  perform: (request, data) => {
    // Make your partner api request here!
    // return request('https://example.com', {
    //   method: 'post',
    //   json: data.payload
    // })
  }
}

export default action
