// Generated file. DO NOT MODIFY IT BY HAND.

export interface Payload {
  /**
   * Unique name for personas audience
   */
  audience_key?: string
  /**
   * Event for audience entering or exiting
   */
  event?: string
  /**
   * The user's email
   */
  email?: string
  /**
   * Hash emails before sending them to Listrak (may lower your audience's match rate). If deactivated, emails will be sent unhashed to Listrak's API and will be hashed upon reception at Listrak's server.
   */
  hash_emails?: boolean
}
