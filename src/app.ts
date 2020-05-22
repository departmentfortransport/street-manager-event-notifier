import TYPES from './types'
import iocContainer from './ioc'
import DBService from './services/dbService'
import Logger from './utils/logger'
import { SQSHandler, SQSEvent, SQSRecord } from 'aws-lambda'
import { EventNotifierSQSMessage } from 'street-manager-data'
import ObjectMessageServiceDelegator from './services/objectMessageServiceDelegator'

const logger: Logger = iocContainer.get<Logger>(TYPES.Logger)
const objectMessageServiceDelegator: ObjectMessageServiceDelegator = iocContainer.get<ObjectMessageServiceDelegator>(TYPES.ObjectMessageServiceDelegator)

export const handler: SQSHandler = async(event: SQSEvent) => {
  const sqsRecord: SQSRecord = event.Records[0]
  const sqsMessage: EventNotifierSQSMessage = JSON.parse(sqsRecord.body)
  logger.log(`Received message: ${JSON.stringify(sqsRecord)}`)

  try {
    await objectMessageServiceDelegator.getObjectMessageService(sqsMessage.object_type).sendMessageToSNS(sqsMessage)
  } catch (err) {
    throw new Error(err)
  } finally {
    await iocContainer.get<DBService>(TYPES.DBService).destroy()
  }

  return
}
