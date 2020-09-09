import 'mocha'
import { assert } from 'chai'
import { mock } from 'ts-mockito'
import { ObjectTypeNotificationEnum } from 'street-manager-data'
import ObjectMessageServiceDelegator from '../../../src/services/objectMessageServiceDelegator'
import PermitObjectMessageService from '../../../src/services/permitObjectMessageService'
import ObjectMessageService from '../../../src/models/objectMessageService'
import ActivityObjectMessageService from '../../../src/services/activityObjectMessageService'

describe('ObjectMessageServiceDelegator', () => {

  let objectMessageServiceDelegator: ObjectMessageServiceDelegator
  let permitObjectMessageService: PermitObjectMessageService
  let activityObjectMessageService: ActivityObjectMessageService

  before(() => {
    permitObjectMessageService = mock(PermitObjectMessageService)
    activityObjectMessageService = mock(ActivityObjectMessageService)

    objectMessageServiceDelegator = new ObjectMessageServiceDelegator(
      permitObjectMessageService,
      activityObjectMessageService
    )
  })

  describe('getObjectMessageService', () => {
    it('should return the permit object message service when the object type is Permit', () => {
      const result: ObjectMessageService = objectMessageServiceDelegator.getObjectMessageService(ObjectTypeNotificationEnum.PERMIT)

      assert.equal(result, permitObjectMessageService)
    })

    it('should return the activity object message service when the object type is Activity', () => {
      const result: ObjectMessageService = objectMessageServiceDelegator.getObjectMessageService(ObjectTypeNotificationEnum.ACTIVITY)

      assert.equal(result, activityObjectMessageService)
    })

    it('should throw an error if an invalid object type is provided', () => {
      try {
        objectMessageServiceDelegator.getObjectMessageService(<ObjectTypeNotificationEnum>'INVALID')
        assert.fail()
      } catch (err) {
        assert.equal(String(err), 'Error: The following object message type is not valid: [INVALID]')
      }
    })
  })
})
