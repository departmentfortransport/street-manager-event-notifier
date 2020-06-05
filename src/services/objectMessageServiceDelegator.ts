import 'reflect-metadata'
import { injectable, inject } from 'inversify'
import TYPES from '../types'
import ObjectMessageService from '../models/objectMessageService'
import PermitObjectMessageService from './permitObjectMessageService'
import { ObjectTypeNotificationEnum } from 'street-manager-data'

@injectable()
export default class ObjectMessageServiceDelegator {

  public constructor(
    @inject(TYPES.PermitObjectMessageService) private permitObjectMessageService: PermitObjectMessageService
  ) {}

  public getObjectMessageService(objectMessageType: ObjectTypeNotificationEnum): ObjectMessageService {
    switch (objectMessageType) {
      case ObjectTypeNotificationEnum.PERMIT:
        return this.permitObjectMessageService
      default:
        throw new Error(`The following object message type is not valid: [${objectMessageType}]`)
    }
  }
}
