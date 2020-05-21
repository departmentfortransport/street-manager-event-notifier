import TYPES from './types'
import iocContainer from './ioc'
import DBService from './services/dbService'
import * as Knex from 'knex'
import Logger from './utils/logger'
import { SQSHandler, SQSEvent, SQSRecord } from 'aws-lambda'
import { EventNotifierSQSMessage } from 'street-manager-data'
import ObjectMessageServiceDelegator from './services/objectMessageServiceDelegator'

const logger: Logger = iocContainer.get<Logger>(TYPES.Logger)
const objectMessageServiceDelegator: ObjectMessageServiceDelegator = iocContainer.get<ObjectMessageServiceDelegator>(TYPES.ObjectMessageServiceDelegator)

export const handler: SQSHandler = async(event: SQSEvent) => {
  const sqsRecord: SQSRecord = event.Records[0]
  console.log(sqsRecord)
  const sqsMessage: EventNotifierSQSMessage = JSON.parse(sqsRecord.body)
  logger.log(`Received message: ${JSON.stringify(sqsRecord)}`)
  const knex: Knex = await iocContainer.get<DBService>(TYPES.DBService).connect()
  // console.log(await knex('permit').select('permit_reference_number').limit(1))

  try {
    await objectMessageServiceDelegator.getObjectMessageService(sqsMessage.object_type).sendMessageToSNS(sqsMessage, sqsRecord.messageId, knex)
  } catch (err) {
    throw new Error(err)
  } finally {
    await knex.destroy()
  }

  return
}
