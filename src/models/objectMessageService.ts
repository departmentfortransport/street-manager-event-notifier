import { EventNotifierSQSMessage } from 'street-manager-data'
import * as Knex from 'knex'
import * as postgis from 'knex-postgis'

export default interface ObjectMessageService {
  sendMessageToSNS(sqsMessage: EventNotifierSQSMessage, timeReceived: Date, knex: Knex, knexPostgis: postgis.knexPostgis): Promise<void>
}
