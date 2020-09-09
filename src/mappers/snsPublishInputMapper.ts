import 'reflect-metadata'
import { injectable } from 'inversify'
import { EventNotifierSNSMessage } from 'street-manager-data'
import { SNS } from 'aws-sdk'
import { MessageAttributeMap } from 'aws-sdk/clients/sns'

@injectable()
export default class SNSPublishInputMapper {
  public mapToSNSPublishInput(message: EventNotifierSNSMessage, topic: string, attributes?: MessageAttributeMap): SNS.PublishInput {
    return {
      Message: JSON.stringify(message),
      TopicArn: topic,
      MessageAttributes: attributes
    }
  }
}
