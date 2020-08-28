import * as Knex from 'knex'
import { injectable } from 'inversify'
import { PermitPermitCondition } from 'street-manager-data'

@injectable()
export default class PermitPermitConditionDao {
  private readonly TABLE: string = 'permit_permit_condition'
  private readonly COLUMNS: string[] = [
    'permit_condition_id',
    'permit_version_id'
  ]

  public async getByPermitVersionId(permitVersionId: number, knex: Knex): Promise<PermitPermitCondition[]> {
    return await knex(this.TABLE)
      .columns(this.COLUMNS)
      .where('permit_version_id', permitVersionId)
      .orderBy('permit_condition_id')
  }
}
