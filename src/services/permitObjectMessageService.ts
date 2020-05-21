import 'reflect-metadata'
import { injectable, inject } from 'inversify'
import TYPES from '../types'
import ObjectMessageService from '../models/objectMessageService'
import PermitDao from '../daos/permitDao'
import { EventNotifierSQSMessage, EventNotifierSNSMessage, EventTypeNotificationEnum, HighLevelWorkData } from 'street-manager-data'
import SNSService from './aws/snsService'
import { SNS } from 'aws-sdk'
import Knex = require('knex')

@injectable()
export default class PermitObjectMessageService implements ObjectMessageService {

  public constructor(
    @inject(TYPES.PermitDao) private dao: PermitDao,
    @inject(TYPES.SNSService) private snsService: SNSService,
    @inject(TYPES.WorkStartTopic) private workStartTopic: string,
    @inject(TYPES.WorkStopTopic) private workStopTopic: string) {}

  public async sendMessageToSNS(sqsMessage: EventNotifierSQSMessage, knex: Knex): Promise<void> {
    try {
      await this.generateSNSMessage(sqsMessage, knex)
    } catch (err) {
      return Promise.reject(err)
    }
  }

  private async generateSNSMessage(sqsMessage: EventNotifierSQSMessage, knex: Knex) {
    const eventNotifierSNSMessage: EventNotifierSNSMessage = {
      event_reference: sqsMessage.event_reference,
      event_type: sqsMessage.event_type,
      work_data: await this.generateWorkData(sqsMessage.object_reference, knex),
      event_time: sqsMessage.event_time,
      object_type: sqsMessage.object_type,
      object_reference: sqsMessage.object_reference,
      version: 1
    }
    const params: SNS.PublishInput = {
      Message: JSON.stringify(eventNotifierSNSMessage),
      TopicArn: this.getTopic(sqsMessage.event_type),
      MessageAttributes: this.generateMessageAttributes(eventNotifierSNSMessage.work_data.usrn.toString(), eventNotifierSNSMessage.work_data.highway_authority_swa_code, eventNotifierSNSMessage.work_data.promoter_swa_code, eventNotifierSNSMessage.work_data.area_name, eventNotifierSNSMessage.work_data.activity_type_id.toString())
    }

    await this.snsService.publishMessage(params)
  }

  private generateMessageAttributes(usrn: string, haSwa: string, promoterSwa: string, area: string, activityType: string): {} {
    return {
      'USRN': {
        DataType: 'Number',
        StringValue: usrn
      },
      'HA_SWA': {
        DataType: 'String',
        StringValue: haSwa
      },
      'Promoter_SWA': {
        DataType: 'String',
        StringValue: promoterSwa
      },
      'Area': {
        DataType: 'String',
        StringValue: area
      },
      'Activity_Type': {
        DataType: 'String',
        StringValue: activityType
      }
    }
  }

  private getTopic(eventType: EventTypeNotificationEnum): string {
    switch (eventType) {
      case EventTypeNotificationEnum.work_start:
        return this.workStartTopic
      case EventTypeNotificationEnum.work_end:
        return this.workStopTopic
      default:
        throw new Error(`The following event type is not valid: [${eventType}]`)
    }
  }
  private async generateWorkData(permitReferenceNumber: string, knex: Knex): Promise<HighLevelWorkData> {
    console.log(' NAT: ', await this.dao.getPermit(permitReferenceNumber, knex))
    const permit: HighLevelWorkData =  await this.dao.getPermit(permitReferenceNumber, knex)

    return permit
  }

}
