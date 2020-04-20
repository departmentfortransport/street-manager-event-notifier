const TYPES = {
  // Utils
  Logger: Symbol.for('Logger'),
  Knex: Symbol.for('Knex'),

  // AWS
  RDSSigner: Symbol.for('RDSSigner'),

  // Services
  DBService: Symbol.for('DBService'),
  RDSService: Symbol.for('RDSService')
}

export default TYPES
