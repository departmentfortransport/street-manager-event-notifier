import { EventNotifierSQSMessage } from 'street-manager-data'

export default interface ObjectMessageService {
  sendMessageToSNS(sqsMessage: EventNotifierSQSMessage): Promise<void>
}
