import 'reflect-metadata'
import { injectable, inject } from 'inversify'
import TYPES from '../types'
import ObjectMessageService from '../models/objectMessageService'
import { EventNotifierSQSMessage } from 'street-manager-data'
import SNSService from './aws/snsService'
import SNSPublishInputMapper from '../mappers/snsPublishInputMapper'
import Logger from '../utils/logger'
import * as moment from 'moment'
import { buildDateTimeString } from '../helpers/dateHelper'

@injectable()
export default class PermitObjectMessageService implements ObjectMessageService {

  public constructor(
    @inject(TYPES.Logger) private logger: Logger,
    @inject(TYPES.SNSService) private snsService: SNSService,
    @inject(TYPES.SNSPublishInputMapper) private mapper: SNSPublishInputMapper) {}

  public async sendMessageToSNS(sqsMessage: EventNotifierSQSMessage): Promise<void> {
    try {
      const timeReceived = buildDateTimeString(moment().toDate())
      await this.snsService.publishMessage(await this.mapper.mapToSNSPublishInput(sqsMessage))
      const timeSent = buildDateTimeString(moment().toDate())

      this.logger.logSuccess(sqsMessage.object_reference, sqsMessage.event_reference.toString(), timeReceived, timeSent)
    } catch (err) {
      return Promise.reject(err)
    }
  }
}
