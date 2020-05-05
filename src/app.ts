import TYPES from './types'
import iocContainer from './ioc'
import DBService from './services/dbService'
import Knex = require('knex')
import Logger from './utils/logger'
import SNSService from './services/aws/snsService'
import { SQSHandler, SQSEvent, SQSRecord } from 'aws-lambda'

const logger: Logger = iocContainer.get<Logger>(TYPES.Logger)

export const handler: SQSHandler = async(event: SQSEvent) => {
  const sqsMessage: SQSRecord = event.Records[0]
  logger.log(`Received message: ${JSON.stringify(sqsMessage)}`)

  const knex: Knex = await iocContainer.get<DBService>(TYPES.DBService).connect()

  try {
    const permit = await getPermitFromDB(knex)
    await sendMessageToSNS(permit, sqsMessage.messageId)
  } catch (err) {
    throw new Error(err)
  } finally {
    await knex.destroy()
  }

  return
}

async function getPermitFromDB(knex: Knex): Promise<any> {
  try {
    return await knex('permit').select('permit_reference_number').limit(1)
  } catch (err) {
    logger.error(err)
    return Promise.reject(err)
  }
}

async function sendMessageToSNS(permit: any, messageId: string): Promise<void> {
  const msg: any = {permit: permit, message_id: messageId}
  const snsService: SNSService = iocContainer.get<SNSService>(TYPES.SNSService)
  await snsService.publishMessage(JSON.stringify(msg), iocContainer.get<string>(TYPES.WorkStartTopic))
}
