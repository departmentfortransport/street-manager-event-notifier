import 'reflect-metadata'
import { injectable, inject } from 'inversify'
import TYPES from '../types'
import ObjectMessageService from '../models/objectMessageService'
import PermitObjectMessageService from './permitObjectMessageService'
import { ObjectTypeNotificationEnum } from 'street-manager-data'
import ActivityObjectMessageService from './activityObjectMessageService'

@injectable()
export default class ObjectMessageServiceDelegator {

  public constructor(
    @inject(TYPES.PermitObjectMessageService) private permitObjectMessageService: PermitObjectMessageService,
    @inject(TYPES.ActivityObjectMessageService) private activityObjectMessageService: ActivityObjectMessageService
  ) {}

  public getObjectMessageService(objectMessageType: ObjectTypeNotificationEnum): ObjectMessageService {
    switch (objectMessageType) {
      case ObjectTypeNotificationEnum.PERMIT:
        return this.permitObjectMessageService
      case ObjectTypeNotificationEnum.ACTIVITY:
        return this.activityObjectMessageService
      default:
        throw new Error(`The following object message type is not valid: [${objectMessageType}]`)
    }
  }
}
