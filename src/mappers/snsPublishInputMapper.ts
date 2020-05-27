import 'reflect-metadata'
import { injectable, inject } from 'inversify'
import TYPES from '../types'
import EventNotifierSNSMessageMapper from './eventNotifierSNSMessageMapper'
import { EventNotifierWorkData, EventNotifierSNSMessage, EventTypeNotificationEnum, EventNotifierSQSMessage } from 'street-manager-data'
import { SNS } from 'aws-sdk'
import { USRN, AREA, HA_ORG, PROMOTER_ORG, ACTIVITY_TYPE } from '../constants/snsMessageAttributes'
import { MessageAttributeMap } from 'aws-sdk/clients/sns'
@injectable()
export default class SNSPublishInputMapper {

  public constructor(
    @inject(TYPES.EventNotifierSNSMessageMapper) private mapper: EventNotifierSNSMessageMapper,
    @inject(TYPES.WorkStartTopic) private workStartTopic: string,
    @inject(TYPES.WorkStopTopic) private workStopTopic: string) {}

  public async mapToSNSPublishInput(sqsMessage: EventNotifierSQSMessage): Promise<SNS.PublishInput> {
    const snsMessage: EventNotifierSNSMessage = await this.mapper.mapToSNSMessage(sqsMessage)
    return {
      Message: JSON.stringify(snsMessage),
      TopicArn: this.getTopic(snsMessage.event_type),
      MessageAttributes: this.generateMessageAttributes(snsMessage.object_data)
    }
  }

  private generateMessageAttributes(workData: EventNotifierWorkData): MessageAttributeMap {

    return {
      [USRN] : {
        DataType: 'Number',
        StringValue: workData.usrn
      },
      [HA_ORG]: {
        DataType: 'String',
        StringValue: workData.highway_authority_swa_code
      },
      [PROMOTER_ORG]: {
        DataType: 'String',
        StringValue: workData.promoter_swa_code
      },
      [AREA]: {
        DataType: 'String',
        StringValue: workData.area_name
      },
      [ACTIVITY_TYPE]: {
        DataType: 'String',
        StringValue: workData.activity_type
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
}
