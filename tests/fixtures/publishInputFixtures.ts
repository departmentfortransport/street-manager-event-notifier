import { SNS } from 'aws-sdk'
import { EventNotifierSNSMessage } from 'street-manager-data'
import { USRN } from '../../src/constants/snsMessageAttributes'
import { generateSNSMessage } from './snsFixtures'

export function generatePublishInput(): SNS.PublishInput {
  const snsMessage: EventNotifierSNSMessage = generateSNSMessage()

  return {
    Message: JSON.stringify(snsMessage),
    TopicArn: 'work-start',
    MessageAttributes: generateMessageAttributes()
  }
}

export function generateMessageAttributes(): SNS.MessageAttributeMap {
  return {
    [USRN] : {
      DataType: 'Number',
      StringValue: '100001'
    }
  }
}
