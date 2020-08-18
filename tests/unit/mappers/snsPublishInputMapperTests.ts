import 'mocha'
import { assert } from 'chai'
import { SNS } from 'aws-sdk'
import { mock, instance, when } from 'ts-mockito'
import { EventNotifierWorkData, EventNotifierSQSMessage, EventNotifierSNSMessage, EventTypeNotificationEnum } from 'street-manager-data'
import EventNotifierSNSMessageMapper from '../../../src/mappers/eventNotifierSNSMessageMapper'
import { generateSQSMessage } from '../../fixtures/sqsFixtures'
import { generateEventNotifierWorkData } from '../../fixtures/eventNotifierWorkDataFixtures'
import SNSPublishInputMapper from '../../../src/mappers/snsPublishInputMapper'
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

    describe('topic', () => {
      it('should map WORK_START events to the Permit Topic', async () => {
        snsMessage.event_type = EventTypeNotificationEnum.WORK_START

        const result: SNS.PublishInput = await snsPublishInputMapper.mapToSNSPublishInput(sqsMessage, eventNotifierWorkData)

        assert.equal(result.TopicArn, permitARN)
      })

      it('should map WORK_STOP events to the Permit Topic', async () => {
        snsMessage.event_type = EventTypeNotificationEnum.WORK_STOP

        const result: SNS.PublishInput = await snsPublishInputMapper.mapToSNSPublishInput(sqsMessage, eventNotifierWorkData)

        assert.equal(result.TopicArn, permitARN)
      })

      it('should map WORK_START_REVERTED events to the Permit Topic', async () => {
        snsMessage.event_type = EventTypeNotificationEnum.WORK_START_REVERTED

        const result: SNS.PublishInput = await snsPublishInputMapper.mapToSNSPublishInput(sqsMessage, eventNotifierWorkData)

        assert.equal(result.TopicArn, permitARN)
      })

      it('should map WORK_STOP_REVERTED events to the Permit Topic', async () => {
        snsMessage.event_type = EventTypeNotificationEnum.WORK_STOP_REVERTED

        const result: SNS.PublishInput = await snsPublishInputMapper.mapToSNSPublishInput(sqsMessage, eventNotifierWorkData)

        assert.equal(result.TopicArn, permitARN)
      })

      it('should map PERMIT_GRANTED events to the Permit Topic', async () => {
        snsMessage.event_type = EventTypeNotificationEnum.PERMIT_GRANTED

        const result: SNS.PublishInput = await snsPublishInputMapper.mapToSNSPublishInput(sqsMessage, eventNotifierWorkData)

        assert.equal(result.TopicArn, permitARN)
      })

      it('should map PERMIT_GRANTED events to the Permit Topic', async () => {
        snsMessage.event_type = EventTypeNotificationEnum.PERMIT_GRANTED

        const result: SNS.PublishInput = await snsPublishInputMapper.mapToSNSPublishInput(sqsMessage, eventNotifierWorkData)

        assert.equal(result.TopicArn, permitARN)
      })

      it('should map PERMIT_ALTERATION_GRANTED events to the Permit Topic', async () => {
        snsMessage.event_type = EventTypeNotificationEnum.PERMIT_ALTERATION_GRANTED

        const result: SNS.PublishInput = await snsPublishInputMapper.mapToSNSPublishInput(sqsMessage, eventNotifierWorkData)

        assert.equal(result.TopicArn, permitARN)
      })

      it('should map PERMIT_CANCELLED events to the Permit Topic', async () => {
        snsMessage.event_type = EventTypeNotificationEnum.PERMIT_CANCELLED

        const result: SNS.PublishInput = await snsPublishInputMapper.mapToSNSPublishInput(sqsMessage, eventNotifierWorkData)

        assert.equal(result.TopicArn, permitARN)
      })

      it('should map PERMIT_REVOKED events to the Permit Topic', async () => {
        snsMessage.event_type = EventTypeNotificationEnum.PERMIT_REVOKED

        const result: SNS.PublishInput = await snsPublishInputMapper.mapToSNSPublishInput(sqsMessage, eventNotifierWorkData)

        assert.equal(result.TopicArn, permitARN)
      })

      it('should map PERMIT_SUBMITTED events to the Permit Topic', async () => {
        snsMessage.event_type = EventTypeNotificationEnum.PERMIT_SUBMITTED

        const result: SNS.PublishInput = await snsPublishInputMapper.mapToSNSPublishInput(sqsMessage, eventNotifierWorkData)

        assert.equal(result.TopicArn, permitARN)
      })

      it('should map PERMIT_REFUSED events to the Permit Topic', async () => {
        snsMessage.event_type = EventTypeNotificationEnum.PERMIT_REFUSED

        const result: SNS.PublishInput = await snsPublishInputMapper.mapToSNSPublishInput(sqsMessage, eventNotifierWorkData)

        assert.equal(result.TopicArn, permitARN)
      })

      it('should error if event type is not valid', async () => {
        snsMessage.event_type = undefined

        try {
          await snsPublishInputMapper.mapToSNSPublishInput(sqsMessage, eventNotifierWorkData)
          assert.fail()
        } catch (err) {
          assert.equal(err.message, 'The following event type is not valid: [undefined]')
        }
      })
    })
  })
})
