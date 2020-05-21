import { EventNotifierSQSMessage } from 'street-manager-data'
import Knex = require('knex')

export default interface ObjectMessageService {
  sendMessageToSNS(sqsMessage: EventNotifierSQSMessage, messageId: string, knex: Knex): Promise<void>
}
