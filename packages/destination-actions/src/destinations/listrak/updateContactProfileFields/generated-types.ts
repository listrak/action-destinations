// Generated file. DO NOT MODIFY IT BY HAND.

export interface Payload {
  /**
   * Identifier used to locate the list.
   */
  listId: number
  /**
   * Email address of the contact.
   */
  email2: string
  /**
   * Profile field values associated with the contact.
   */
  segmentationFieldValues: {
    segmentationFieldId: number
    value: string
  }[]
}
