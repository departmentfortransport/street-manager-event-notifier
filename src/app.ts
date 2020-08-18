import TYPES from './types'
import iocContainer from './ioc'
import DBService from './services/dbService'
import Logger from './utils/logger'
import { SQSHandler, SQSEvent, SQSRecord } from 'aws-lambda'
import { EventNotifierSQSMessage } from 'street-manager-data'
import ObjectMessageServiceDelegator from './services/objectMessageServiceDelegator'
import * as Knex from 'knex'
import * as postgis from 'knex-postgis'

const logger: Logger = iocContainer.get<Logger>(TYPES.Logger)
const objectMessageServiceDelegator: ObjectMessageServiceDelegator = iocContainer.get<ObjectMessageServiceDelegator>(TYPES.ObjectMessageServiceDelegator)
const dbService: DBService = iocContainer.get<DBService>(TYPES.DBService)
let knex: Knex
let knexPostgis: postgis.KnexPostgis

export const handler: SQSHandler = async(event: SQSEvent) => {
  knex = await dbService.knex()
  knexPostgis = await dbService.postgis()

  const sqsRecord: SQSRecord = event.Records[0]
  const sqsMessage: EventNotifierSQSMessage = JSON.parse(sqsRecord.body)
  logger.logWithObject('Received message:', sqsRecord)

  try {
    await objectMessageServiceDelegator.getObjectMessageService(sqsMessage.object_type).sendMessageToSNS(sqsMessage, new Date(), knex, knexPostgis)
  } catch (err) {
    throw new Error(err)
  }

  return
}
