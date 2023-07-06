import { createHash } from 'crypto'
import { IntegrationError, RetryableError } from '@segment/actions-core'
import type { RequestClient } from '@segment/actions-core'

export const hash = (value: string | undefined): string | undefined => {
  if (value === undefined) return

  const hash = createHash('sha256')
  hash.update(value)
  return hash.digest('hex')
}

class ListrakAPIError extends IntegrationError {
  readonly error?: Record<string, string>

  constructor(message: string, code: string, status: number, error?: Record<string, string>) {
    super(message, code, status)
    this.error = error
  }
}

export type Operation = {
  operation_type: string
  audience_id: string
  user_list: string[]
}

export type ClientCredentials = {
  client_id: string
  client_secret: string
  access_token?: string
}

export const getRequestHeaders = async (
  request: RequestClient,
  credentials: ClientCredentials
): Promise<Record<string, string>> => {
  credentials = await listrakAuthenticate(request, credentials)

  return {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ` + credentials.access_token
  }
}

export const getAccessToken = async (request: RequestClient, credentials: ClientCredentials): Promise<string> => {
  const res = await request(`https://auth.listrak.com/OAuth2/Token`, {
    method: 'POST',
    body: new URLSearchParams({
      client_id: credentials.client_id,
      client_secret: credentials.client_secret,
      grant_type: 'client_credentials'
    }),
    headers: {
      Accept: 'text/plain',
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  const body = await res.json()

  if (res.status !== 200)
    // Centrifuge will automatically retry the batch if there's
    // an issue fetching an access token from Listrak.
    throw new RetryableError(`Error while getting an access token`)

  return body.access_token
}

export const listrakAuthenticate = async (
  request: RequestClient,
  credentials: ClientCredentials
): Promise<ClientCredentials> => {
  // If we don't have any auth token yet, we get one and add it to the credentials
  if (!credentials.access_token) credentials.access_token = await getAccessToken(request, credentials)
  return credentials
}


