import { EventNotifierSQSMessage } from 'street-manager-data'

export default interface ObjectMessageService {
  sendMessageToSNS(sqsMessage: EventNotifierSQSMessage, timeReceived: Date): Promise<void>
}
