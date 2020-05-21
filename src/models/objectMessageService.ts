import { EventNotifierSQSMessage } from 'street-manager-data'
import Knex = require('knex')

export default interface ObjectMessageService {
  sendMessageToSNS(sqsMessage: EventNotifierSQSMessage, knex: Knex): Promise<void>
}
