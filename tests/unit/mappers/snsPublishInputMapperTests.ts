import 'mocha'
import { assert } from 'chai'
import { SNS } from 'aws-sdk'
import { EventNotifierSNSMessage } from 'street-manager-data'
import SNSPublishInputMapper from '../../../src/mappers/snsPublishInputMapper'
import { generateSNSMessage } from '../../fixtures/snsFixtures'
import { MessageAttributeMap } from 'aws-sdk/clients/sns'
import { generateMessageAttributes } from '../../fixtures/publishInputFixtures'

describe('SNSPublishInputMapper', () => {
  let snsMessage: EventNotifierSNSMessage
  let messageAttributes: MessageAttributeMap
  let snsPublishInputMapper: SNSPublishInputMapper

  const permitARN = 'PERMIT'

  beforeEach(() => {
    snsMessage = generateSNSMessage()
    messageAttributes = generateMessageAttributes()

    snsPublishInputMapper = new SNSPublishInputMapper()
  })

  describe('mapSQSToPublishInput', () => {
    it('should map the sqs message to an AWS publish input object', async () => {
      const result: SNS.PublishInput = snsPublishInputMapper.mapToSNSPublishInput(snsMessage, permitARN, messageAttributes)

      assert.equal(result.Message, JSON.stringify(snsMessage))
      assert.equal(result.TopicArn, permitARN)
      assert.deepEqual(result.MessageAttributes, messageAttributes)
    })
  })
})
