import { inject, injectable } from 'inversify'
import TYPES from '../types'
import DBService from '../services/dbService'
import * as Knex from 'knex'
import { PermitLocationType } from 'street-manager-data'

@injectable()
export default class PermitLocationTypeDao {

  public constructor(@inject(TYPES.DBService) private db: DBService) {}

  private readonly PERMIT_LOCATION_TYPE_TABLE_NAME = 'permit_location_type'

  public async getByPermitVersionId(permitVersionId: number): Promise<PermitLocationType[]> {
    const knex: Knex = await this.db.knex()

    return await knex(this.PERMIT_LOCATION_TYPE_TABLE_NAME).where('permit_version_id', permitVersionId)
  }
}
