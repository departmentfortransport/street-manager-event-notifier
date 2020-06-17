const TYPES = {
  // Utils
  Logger: Symbol.for('Logger'),
  Knex: Symbol.for('Knex'),
  Postgis: Symbol.for('Postgis'),

  // AWS
  RDSSigner: Symbol.for('RDSSigner'),
  SNS: Symbol.for('SNS'),
  WorkStartTopic: Symbol.for('WorkStartTopic'),
  WorkStopTopic: Symbol.for('WorkStopTopic'),

  // Services
  DBService: Symbol.for('DBService'),
  RDSService: Symbol.for('RDSService'),
  SNSService: Symbol.for('SNSService'),
  ObjectMessageServiceDelegator: Symbol.for('ObjectMessageServiceDelegator'),
  PermitObjectMessageService: Symbol.for('PermitObjectMessageService'),
  GeometryService: Symbol.for('GeometryService'),

  // DAOs
  PermitDao: Symbol.for('PermitDao'),
  PermitLocationTypeDao: Symbol.for('PermitLocationTypeDao'),

  // Mappers
  WorkDataMapper: Symbol.for('WorkDataMapper'),
  EventNotifierSNSMessageMapper: Symbol.for('EventNotifierSNSMessageMapper'),
  SNSPublishInputMapper: Symbol.for('SNSPublishInputMapper')
}

export default TYPES
