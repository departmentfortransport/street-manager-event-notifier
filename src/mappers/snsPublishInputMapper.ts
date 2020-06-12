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
    @inject(TYPES.WorkStopTopic) private workStopTopic: string
  ) {}

  public async mapToSNSPublishInput(sqsMessage: EventNotifierSQSMessage): Promise<SNS.PublishInput> {
    const snsMessage: EventNotifierSNSMessage = await this.mapper.mapToSNSMessage(sqsMessage)

    return {
      Message: JSON.stringify(snsMessage),
      TopicArn: this.getTopic(snsMessage.event_type),
      MessageAttributes: this.generateMessageAttributes(snsMessage.object_data)
    }
  }

  private generateMessageAttributes(workData: EventNotifierWorkData): MessageAttributeMap {
    const attributes: MessageAttributeMap = {
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
      [ACTIVITY_TYPE]: {
        DataType: 'String',
        StringValue: workData.activity_type
      }
    }

    if (workData.area_name) {
      attributes[AREA] = {
          DataType: 'String',
          StringValue: workData.area_name
      }
    }

    return attributes
  }

  private getTopic(eventType: EventTypeNotificationEnum): string {
    switch (eventType) {
      case EventTypeNotificationEnum.WORK_START:
        return this.workStartTopic
      case EventTypeNotificationEnum.WORK_STOP:
        return this.workStopTopic
      default:
        throw new Error(`The following event type is not valid: [${eventType}]`)
    }
  }
}
