import 'mocha'
import EventNotifierSNSMessageMapper from '../../../src/mappers/eventNotifierSNSMessageMapper'
import { EventNotifierWorkData, EventNotifierSQSMessage, EventNotifierSNSMessage } from 'street-manager-data'
import { assert } from 'chai'
import { mock, instance, when } from 'ts-mockito'
import { generateSQSMessage } from '../../fixtures/sqsFixtures'
import { generateEventNotifierWorkData } from '../../fixtures/eventNotifierWorkDataFixtures'
import SNSPublishInputMapper from '../../../src/mappers/snsPublishInputMapper'
import { SNS } from 'aws-sdk'
import { generateSNSMessage } from '../../fixtures/snsFixtures'
import { USRN, AREA, HA_ORG, PROMOTER_ORG, ACTIVITY_TYPE } from '../../../src/constants/snsMessageAttributes'

describe('SNSPublishInputMapper', () => {
  let sqsMessage: EventNotifierSQSMessage
  let snsMessage: EventNotifierSNSMessage
  let eventNotifierSNSMessageMapper: EventNotifierSNSMessageMapper
  let snsPublishInputMapper: SNSPublishInputMapper
  let eventNotifierWorkData: EventNotifierWorkData
  let permitARN: string

  beforeEach(() => {
    sqsMessage = generateSQSMessage()
    snsMessage = generateSNSMessage()
    eventNotifierWorkData = generateEventNotifierWorkData()

    eventNotifierSNSMessageMapper = mock(EventNotifierSNSMessageMapper)
    permitARN = 'PERMIT'

    snsPublishInputMapper = new SNSPublishInputMapper(
      instance(eventNotifierSNSMessageMapper),
      permitARN
    )

    when(eventNotifierSNSMessageMapper.mapToSNSMessage(sqsMessage, eventNotifierWorkData)).thenResolve(snsMessage)
  })

  describe('mapSQSToPublishInput', () => {
    it('should map the sqs message to an AWS publish input object', async () => {
      const result: SNS.PublishInput = await snsPublishInputMapper.mapToSNSPublishInput(sqsMessage, eventNotifierWorkData)

      assert.equal(result.Message, JSON.stringify(snsMessage))
      assert.equal(result.TopicArn, permitARN)
      assert.equal(result.MessageAttributes[USRN].StringValue, snsMessage.object_data.usrn)
      assert.equal(result.MessageAttributes[AREA].StringValue, snsMessage.object_data.area_name)
      assert.equal(result.MessageAttributes[HA_ORG].StringValue, snsMessage.object_data.highway_authority_swa_code)
      assert.equal(result.MessageAttributes[PROMOTER_ORG].StringValue, snsMessage.object_data.promoter_swa_code)
      assert.equal(result.MessageAttributes[ACTIVITY_TYPE].StringValue, snsMessage.object_data.activity_type)
    })

    it('should not map the Area attribute to AWS publish input object if not provided', async () => {
      snsMessage.object_data.area_name = null

      const result: SNS.PublishInput = await snsPublishInputMapper.mapToSNSPublishInput(sqsMessage, eventNotifierWorkData)

      assert.equal(result.Message, JSON.stringify(snsMessage))
      assert.equal(result.TopicArn, permitARN)
      assert.equal(result.MessageAttributes[USRN].StringValue, snsMessage.object_data.usrn)
      assert.isUndefined(result.MessageAttributes[AREA])
      assert.equal(result.MessageAttributes[HA_ORG].StringValue, snsMessage.object_data.highway_authority_swa_code)
      assert.equal(result.MessageAttributes[PROMOTER_ORG].StringValue, snsMessage.object_data.promoter_swa_code)
      assert.equal(result.MessageAttributes[ACTIVITY_TYPE].StringValue, snsMessage.object_data.activity_type)
    })
  })
})
