import { EventNotifierSQSMessage } from 'street-manager-data'
import * as Knex from 'knex'
import { KnexPostgis } from 'knex-postgis'

export default interface ObjectMessageService {
  sendMessageToSNS(sqsMessage: EventNotifierSQSMessage, timeReceived: Date, knex: Knex, knexPostgis: KnexPostgis): Promise<void>
}
