import TYPES from './types'
import iocContainer from './ioc'
import DBService from './services/dbService'
import Knex = require('knex')
import Logger from './utils/logger'
import SNSService from './services/aws/snsService'
import { SQS } from 'aws-sdk'

let knex: Knex
const logger: Logger = iocContainer.get<Logger>(TYPES.Logger)

async function main(event) {
    const sqsMessage: SQS.Types.Message = <SQS.Types.Message>event
    logger.log(`Recieved message: ${JSON.stringify(sqsMessage)}`)

    await connectDB()

    const permit = await getPermitFromDB()

    await sendMessageToSNS(JSON.stringify(permit))

    return
}

async function connectDB(): Promise<void> {
  if (!knex) {
    knex = await iocContainer.get<DBService>(TYPES.DBService).connect()
  }
}

async function getPermitFromDB(): Promise<any> {
  try {
     return await knex('permit').select('permit_reference_number').limit(1)
  } catch (err) {
    logger.error(err)
    throw new Error(err)
  }
}

async function sendMessageToSNS(message: string): Promise<void> {
  const snsService: SNSService = iocContainer.get<SNSService>(TYPES.SNSService)
  await snsService.publishMessage(message, iocContainer.get<string>(TYPES.WorkStartTopic))
}

export const handler = main
