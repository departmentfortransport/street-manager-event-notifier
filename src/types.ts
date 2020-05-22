const TYPES = {
  // Utils
  Logger: Symbol.for('Logger'),
  Knex: Symbol.for('Knex'),
  KnexRead: Symbol.for('KnexRead'),
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

  // DAOs
  PermitDao: Symbol.for('PermitDao'),

  // Mappers
  HighLevelWorkDataMapper: Symbol.for('HighLevelWorkDataMapper')
}

export default TYPES
