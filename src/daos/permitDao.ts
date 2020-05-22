import * as Knex from 'knex'
import { HighLevelWorkDataData } from '../models/highLevelWorkDataData'
import { injectable, inject } from 'inversify'
import TYPES from '../types'
import DBService from '../services/dbService'

@injectable()
export default class PermitDao {
  private readonly PERMIT_TABLE_NAME = 'permit'

  private PERMIT_COLUMNS: string[] = [
    'work.work_reference_number',
    'permit.permit_reference_number',
    'work.promoter_organisation_reference',
    'promoter_organisation.organisation_name as promoter_organisation_name',
    'work.ha_organisation_reference',
    'ha_organisation.organisation_name as ha_organisation_name',
    'permit_version.permit_coordinates',
    'work.street_name',
    'work.area_name',
    'permit_version.work_category_id',
    'permit_version.traffic_management_type_id',
    'permit_version.proposed_start_date',
    'permit_version.proposed_start_time',
    'permit_version.proposed_end_date',
    'permit_version.proposed_end_time',
    'permit.actual_start_date',
    'permit.actual_end_date',
    'work.work_status_id',
    'work.usrn'
  ]

  public constructor (
    @inject(TYPES.DBService) private db: DBService
  ) {}

  public async getPermit(permitReferenceNumber: string): Promise<HighLevelWorkDataData> {
    const knex: Knex = await this.db.knex()

    const query: Knex.QueryBuilder = this.preparePermitsQuery(permitReferenceNumber, knex)
      .select(this.PERMIT_COLUMNS)
      .limit(1)

    return await query.first()
  }

  private preparePermitsQuery(permitReferenceNumber: string, knex: Knex): Knex.QueryBuilder {
    const query: Knex.QueryBuilder = knex(this.PERMIT_TABLE_NAME)
      .innerJoin('permit_version', 'permit.permit_id', 'permit_version.permit_id').where('permit_version.is_current_version', true)
      .innerJoin('work', 'permit.work_id', 'work.work_id')
      .innerJoin('organisation as promoter_organisation', 'promoter_organisation.org_ref', 'work.promoter_organisation_reference')
      .innerJoin('organisation as ha_organisation', 'ha_organisation.org_ref', 'work.ha_organisation_reference')
      .where('permit.permit_reference_number', permitReferenceNumber.toUpperCase())

    return query
  }
}
