import { EventLogMessage } from '../../src/models/eventLogMessage'

export function generateEventLogMessage(objectRef = 'WRN-001-01', eventRef = 1, timeReceived = new Date(), timeSent = new Date()): EventLogMessage {
  return {
    object_reference: objectRef,
    event_reference: eventRef,
    time_message_received: timeReceived,
    time_message_sent: timeSent
  }
}
