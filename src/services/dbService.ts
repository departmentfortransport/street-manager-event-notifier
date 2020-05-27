import 'reflect-metadata'
import { injectable, inject } from 'inversify'
import * as Knex from 'knex'
import RDSService from './aws/rdsService'
import TYPES from '../types'

@injectable()
export default class DBService {
  public constructor(
    @inject(TYPES.RDSService) private rds: RDSService,
    @inject(TYPES.Knex) private knexConfig: Knex.Config) {
  }

  public async connect(): Promise<Knex> {
    const config: Knex.Config = this.knexConfig

    await this.configureConnection(<Knex.PgConnectionConfig>this.knexConfig.connection)

    return Knex(config)
  }

  private async configureConnection(connection: Knex.PgConnectionConfig): Promise<void> {
    if (!connection.password) {
      connection.password = await this.rds.getAuthToken()
    }
  }
}
