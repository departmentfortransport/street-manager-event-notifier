import 'reflect-metadata'
import { injectable } from 'inversify'
import { EventNotifierSNSMessage, EventNotifierSQSMessage, EventNotifierWorkData, EventNotifierActivityData } from 'street-manager-data'

@injectable()
export default class EventNotifierSNSMessageMapper {

  private readonly SNS_MESSAGE_VERSION = 1

  public mapToSNSMessage(sqsMessage: EventNotifierSQSMessage, eventNotifierData: EventNotifierWorkData | EventNotifierActivityData): EventNotifierSNSMessage {
    return {
      event_reference: sqsMessage.event_reference,
      event_type: sqsMessage.event_type,
      object_data: eventNotifierData,
      event_time: sqsMessage.event_time,
      object_type: sqsMessage.object_type,
      object_reference: sqsMessage.object_reference,
      version: this.SNS_MESSAGE_VERSION
    }
  }
}
