import 'mocha'
import EventNotifierSNSMessageMapper from '../../../src/mappers/eventNotifierSNSMessageMapper'
import { EventNotifierWorkData, EventNotifierSQSMessage, EventNotifierSNSMessage } from 'street-manager-data'
import { assert } from 'chai'
import PermitDao from '../../../src/daos/permitDao'
import WorkDataMapper from '../../../src/mappers/workDataMapper'
import { mock, instance, when, anything } from 'ts-mockito'
import { generateSQSMessage } from '../../fixtures/sqsFixtures'
import { generateEventNotifierWorkData } from '../../fixtures/EventNotifierWorkData'

describe('EventNotifierSNSMapper', () => {
  let sqsMessage: EventNotifierSQSMessage
  let eventNotifierSNSMessageMapper: EventNotifierSNSMessageMapper
  let permitDao: PermitDao
  let workDataMapper: WorkDataMapper
  let eventNotifierWorkData: EventNotifierWorkData

  before(() => {
    sqsMessage = generateSQSMessage()

    permitDao = mock(PermitDao)
    workDataMapper = mock(WorkDataMapper)

    eventNotifierWorkData = generateEventNotifierWorkData()

    eventNotifierSNSMessageMapper = new EventNotifierSNSMessageMapper(
      instance(permitDao),
      instance(workDataMapper)
    )
    when(workDataMapper.mapDataToInfo(anything())).thenReturn(eventNotifierWorkData)
  })

  describe('mapSQSToSNSMessage', () => {
    it('should map the sqs message to an sns message', async () => {

      const result: EventNotifierSNSMessage = await eventNotifierSNSMessageMapper.mapToSNSMessage(sqsMessage)

      assert.equal(result.event_reference, sqsMessage.event_reference)
      assert.equal(result.event_type, sqsMessage.event_type)
      assert.equal(result.object_data, eventNotifierWorkData)
      assert.equal(result.event_time, sqsMessage.event_time)
      assert.equal(result.object_type, sqsMessage.object_type)
      assert.equal(result.object_reference, sqsMessage.object_reference)
      assert.equal(result.version, 1)
    })
  })
})
