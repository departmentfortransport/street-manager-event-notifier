const TYPES = {
  // Utils
  Logger: Symbol.for('Logger'),
  Knex: Symbol.for('Knex'),

  // AWS
  RDSSigner: Symbol.for('RDSSigner'),
  SNS: Symbol.for('SNS'),
  WorkStartTopic: Symbol.for('WorkStartTopic'),

  // Services
  DBService: Symbol.for('DBService'),
  RDSService: Symbol.for('RDSService'),
  SNSService: Symbol.for('SNSService')
}

export default TYPES
