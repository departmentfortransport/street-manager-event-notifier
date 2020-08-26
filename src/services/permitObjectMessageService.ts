import 'reflect-metadata'
import { injectable, inject } from 'inversify'
import TYPES from '../types'
import ObjectMessageService from '../models/objectMessageService'
import { EventNotifierSQSMessage, EventNotifierWorkData } from 'street-manager-data'
import SNSService from './aws/snsService'
import SNSPublishInputMapper from '../mappers/snsPublishInputMapper'
import Logger from '../utils/logger'
import PermitDao from '../daos/permitDao'
import PermitLocationTypeDao from '../daos/permitLocationTypeDao'
import PermitConditionDao from '../daos/permitConditionDao'
import WorkDataMapper from '../mappers/workDataMapper'
import { WorkData } from '../models/workData'
import { SNS } from 'aws-sdk'
import * as Knex from 'knex'
import * as postgis from 'knex-postgis'

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
    @inject(TYPES.SNSPublishInputMapper) private mapper: SNSPublishInputMapper,
    @inject(TYPES.PermitDao) private permitDao: PermitDao,
    @inject(TYPES.PermitLocationTypeDao) private permitLocationTypeDao: PermitLocationTypeDao,
    @inject(TYPES.PermitConditionDao) private permitConditionDao: PermitConditionDao,
    @inject(TYPES.WorkDataMapper) private workDataMapper: WorkDataMapper
  ) {}

  public async sendMessageToSNS(sqsMessage: EventNotifierSQSMessage, timeReceived: Date, knex: Knex, knexPostgis: postgis.knexPostgis): Promise<void> {
    try {
      const eventNotifierWorkData: EventNotifierWorkData = await this.getWorkData(sqsMessage.object_reference, knex, knexPostgis)

      const snsPublishInput: SNS.PublishInput = await this.mapper.mapToSNSPublishInput(sqsMessage, eventNotifierWorkData)

      await this.snsService.publishMessage(snsPublishInput)

      this.logger.logWithObject('Message successfully sent to SNS:', this.generateLogMessage(sqsMessage, timeReceived))
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

  private async getWorkData(permitReferenceNumber: string, knex: Knex, knexPostgis: postgis.Knex): Promise<EventNotifierWorkData> {
    const workData: WorkData = await this.permitDao.getWorkData(permitReferenceNumber, knex, knexPostgis)

    const [locationTypes, permitConditions] = await Promise.all([
      this.permitLocationTypeDao.getByPermitVersionId(workData.permit_version_id, knex),
      this.permitConditionDao.getByPermitVersionId(workData.permit_version_id, knex)
    ])

    return this.workDataMapper.mapWorkDataToEventNotifierWorkData(workData, locationTypes, permitConditions)
  }
}
