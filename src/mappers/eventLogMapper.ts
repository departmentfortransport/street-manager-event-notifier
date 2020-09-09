import { EventNotifierSQSMessage } from 'street-manager-data'
import { EventLogMessage } from '../models/eventLogMessage'
import { injectable } from 'inversify'

@injectable()
export default class EventLogMapper {
  public generateEventLogMessage(message: EventNotifierSQSMessage, timeReceived: Date): EventLogMessage {
    return {
      object_reference: message.object_reference,
      event_reference: message.event_reference,
      time_message_received: timeReceived,
      time_message_sent: new Date()
    }
  }
}
