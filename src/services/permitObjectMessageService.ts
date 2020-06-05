import 'reflect-metadata'
import { injectable, inject } from 'inversify'
import TYPES from '../types'
import ObjectMessageService from '../models/objectMessageService'
import { EventNotifierSQSMessage } from 'street-manager-data'
import SNSService from './aws/snsService'
import SNSPublishInputMapper from '../mappers/snsPublishInputMapper'
import Logger from '../utils/logger'

export interface EventLogMessage {
  object_reference: string
  event_reference: number
  time_message_received: Date
  time_message_sent: Date
}

@injectable()
export default class PermitObjectMessageService implements ObjectMessageService {

  public constructor(
    @inject(TYPES.Logger) private logger: Logger,
    @inject(TYPES.SNSService) private snsService: SNSService,
    @inject(TYPES.SNSPublishInputMapper) private mapper: SNSPublishInputMapper) {}

  public async sendMessageToSNS(sqsMessage: EventNotifierSQSMessage, timeReceived: Date): Promise<void> {
    try {
      await this.snsService.publishMessage(await this.mapper.mapToSNSPublishInput(sqsMessage))

      this.logger.log(`Message successfully sent to SNS: ${this.generateLogMessage(sqsMessage, timeReceived)}`)
    } catch (err) {
      return Promise.reject(err)
    }
  }

  private generateLogMessage(message: EventNotifierSQSMessage, timeReceived: Date): EventLogMessage {
    return {
      object_reference: message.object_reference,
      event_reference: message.event_reference,
      time_message_received: timeReceived,
      time_message_sent: new Date()
    }
  }
}
