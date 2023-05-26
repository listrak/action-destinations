import type { ActionDefinition } from '@segment/actions-core'
import type { Settings } from '../generated-types'
import type { Payload } from './generated-types'

const action: ActionDefinition<Settings, Payload> = {
  title: 'Set Email Profile Fields',
  description: '',
  fields: {
    email: {
      label: 'Email',
      description: "The user's email address",
      type: 'string',
      allowNull: false,
      required: true
    },
    listId: {
      label: 'List ID',
      description: 'The ID of the List',
      type: 'number',
      allowNull: false,
      required: true
    },
    profileFieldId: {
      label: 'Profile Field ID',
      description: 'The ID of the Profile Field',
      type: 'number',
      allowNull: false,
      required: true
    },
    profileFieldValue: {
      label: 'Profile field value',
      description: 'The value of the Profile Field',
      type: 'string',
      allowNull: false,
      required: true
    }
  },
  perform: (request, options) => {
    // Make your partner api request here!
    console.log(request, options.payload)
    return request('https://api.listrak.com/email/v1/ipPool', {
      method: 'GET'
    })
  }
}

export default action
