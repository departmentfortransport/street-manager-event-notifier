const TYPES = {
  // Utils
  Logger: Symbol.for('Logger'),
  Knex: Symbol.for('Knex'),
  Postgis: Symbol.for('Postgis'),

  // AWS
  RDSSigner: Symbol.for('RDSSigner'),
  SNS: Symbol.for('SNS'),
  PermitTopic: Symbol.for('PermitTopic'),
  ActivityTopic: Symbol.for('ActivityTopic'),

  // Services
  DBService: Symbol.for('DBService'),
  RDSService: Symbol.for('RDSService'),
  SNSService: Symbol.for('SNSService'),
  ObjectMessageServiceDelegator: Symbol.for('ObjectMessageServiceDelegator'),
  PermitObjectMessageService: Symbol.for('PermitObjectMessageService'),
  ActivityObjectMessageService: Symbol.for('ActivityObjectMessageService'),
  GeometryService: Symbol.for('GeometryService'),

  // DAOs
  PermitDao: Symbol.for('PermitDao'),
  PermitLocationTypeDao: Symbol.for('PermitLocationTypeDao'),
  PermitPermitConditionDao: Symbol.for('PermitPermitConditionDao'),
  ActivityDao: Symbol.for('ActivityDao'),
  ActivityLocationTypeDao: Symbol.for('ActivityLocationTypeDao'),

  // Mappers
  WorkDataMapper: Symbol.for('WorkDataMapper'),
  ActivityDataMapper: Symbol.for('ActivityDataMapper'),
  EventNotifierSNSMessageMapper: Symbol.for('EventNotifierSNSMessageMapper'),
  SNSPublishInputMapper: Symbol.for('SNSPublishInputMapper'),
  SNSMessageAttributeMapper: Symbol.for('SNSMessageAttributeMapper'),
  EventLogMapper: Symbol.for('EventLogMapper')
}

export default TYPES
