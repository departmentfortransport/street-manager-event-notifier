import 'mocha'
import DBService from '../../../src/services/dbService'
import * as Knex from 'knex'
import { mock, instance, when } from 'ts-mockito'
import RDSService from '../../../src/services/aws/rdsService'
import { assert } from 'chai'

describe('dbService', () => {

  let service: DBService
  let rds: RDSService
  let knexConfig: Knex.Config

  beforeEach(() => {
    rds = mock(RDSService)

    knexConfig = {
      client: 'pg',
      connection: {
        host: 'host',
        port: 1234,
        user: 'user',
        database: 'database'
      }
    }
  })

  describe('connect', () => {
    it('should use password from config if provided', async () => {
      (<Knex.PgConnectionConfig>knexConfig.connection).password = 'knexpw'
      service = new DBService(instance(rds), knexConfig)

      const knex: Knex = await service.connect()

      assert.equal(knex.client.config.connection.password, 'knexpw')
    })

    it('should called RDS Service to fetch token if no password provided', async () => {
      when(rds.getAuthToken()).thenResolve('token')
      service = new DBService(instance(rds), knexConfig)

      const knex: Knex = await service.connect()

      assert.equal(knex.client.config.connection.password, 'token')
    })
  })
})
