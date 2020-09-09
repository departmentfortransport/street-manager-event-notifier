import 'mocha'
import { assert } from 'chai'
import { SNS } from 'aws-sdk'
import { EventNotifierWorkData, EventNotifierActivityData } from 'street-manager-data'
import { generateEventNotifierActivityData } from '../../fixtures/eventNotifierActivityDataFixtures'
import SNSMessageAttributeMapper from '../../../src/mappers/snsMessageAttributeMapper'
import { USRN, AREA, HA_ORG, PROMOTER_ORG, ACTIVITY_TYPE } from '../../../src/constants/snsMessageAttributes'
import { generateEventNotifierWorkData } from '../../fixtures/eventNotifierWorkDataFixtures'

describe('SNSMessageAttributeMapper', () => {
  const snsMessageAttributeMapper: SNSMessageAttributeMapper = new SNSMessageAttributeMapper()

  describe('mapSQSToPublishInput - Activity', () => {
    const eventNotifierActivityData: EventNotifierActivityData = generateEventNotifierActivityData()

    it('should map the Activity sqs message to an AWS publish input object', async () => {
      const result: SNS.MessageAttributeMap = await snsMessageAttributeMapper.mapMessageAttributes(
        eventNotifierActivityData.usrn,
        eventNotifierActivityData.highway_authority,
        eventNotifierActivityData.activity_type,
        eventNotifierActivityData.area_name
      )

      assert.equal(result[USRN].StringValue, eventNotifierActivityData.usrn)
      assert.equal(result[HA_ORG].StringValue, eventNotifierActivityData.highway_authority)
      assert.equal(result[ACTIVITY_TYPE].StringValue, eventNotifierActivityData.activity_type)
      assert.equal(result[AREA].StringValue, eventNotifierActivityData.area_name)
    })

    it('should not map the Area attribute to AWS publish input object if not provided', async () => {
      const result: SNS.MessageAttributeMap = await snsMessageAttributeMapper.mapMessageAttributes(
        eventNotifierActivityData.usrn,
        eventNotifierActivityData.highway_authority,
        eventNotifierActivityData.activity_type
      )

      assert.isUndefined(result[AREA])
    })
  })

  describe('mapSQSToPublishInput - Work', () => {
    const eventNotifierWorkData: EventNotifierWorkData = generateEventNotifierWorkData()

    it('should map the Work sqs message to an AWS publish input object', async () => {
      const result: SNS.MessageAttributeMap = await snsMessageAttributeMapper.mapMessageAttributes(
        eventNotifierWorkData.usrn,
        eventNotifierWorkData.highway_authority,
        eventNotifierWorkData.activity_type,
        eventNotifierWorkData.area_name,
        eventNotifierWorkData.promoter_organisation
      )

      assert.equal(result[USRN].StringValue, eventNotifierWorkData.usrn)
      assert.equal(result[HA_ORG].StringValue, eventNotifierWorkData.highway_authority)
      assert.equal(result[ACTIVITY_TYPE].StringValue, eventNotifierWorkData.activity_type)
      assert.equal(result[AREA].StringValue, eventNotifierWorkData.area_name)
      assert.equal(result[PROMOTER_ORG].StringValue, eventNotifierWorkData.promoter_organisation)
    })

    it('should not map the Area attribute to AWS publish input object if not provided', async () => {
      const result: SNS.MessageAttributeMap = await snsMessageAttributeMapper.mapMessageAttributes(
        eventNotifierWorkData.usrn,
        eventNotifierWorkData.highway_authority,
        eventNotifierWorkData.activity_type,
        null,
        eventNotifierWorkData.promoter_organisation
      )

      assert.isUndefined(result[AREA])
    })

    it('should not map the Promoter Org attribute to AWS publish input object if not provided', async () => {
      const result: SNS.MessageAttributeMap = await snsMessageAttributeMapper.mapMessageAttributes(
        eventNotifierWorkData.usrn,
        eventNotifierWorkData.highway_authority,
        eventNotifierWorkData.activity_type,
        eventNotifierWorkData.area_name
      )

      assert.isUndefined(result[PROMOTER_ORG])
    })
  })
})
