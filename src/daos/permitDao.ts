import * as Knex from 'knex'
import { inject, injectable } from 'inversify'
import TYPES from '../types'
import { HighLevelWorkData } from 'street-manager-data'

@injectable()
export default class PermitDao {

  private readonly PERMIT_TABLE_NAME = 'permit'

  private PERMIT_COLUMNS: string[] = [
    'work.street_name',
    'work.usrn',
    'work.town',
    'work.area_name',
    'work.road_category',
    'permit_coordinates',
    'permit_version.activity_type_id',
    'permit_version.proposed_start_date',
    'permit_version.proposed_start_time',
    'permit_version.proposed_end_date',
    'permit_version.proposed_end_time',
    'permit.permit_start_date',
    'permit.permit_end_date',
    // location types
    'permit_version.works_location_description',
    'permit_version.work_category_id',
    'permit_version.traffic_management_type_id',
    'permit_version.collaborative_working',
    // additional info
    // cancelled
    'permit.promoter_swa_code',
    'permit.highway_authority_swa_code'
  ]

  public constructor(
    @inject(TYPES.KnexRead) private knex: Knex
  ) {}

  public async getPermit(permitReferenceNumber: string): Promise<HighLevelWorkData> {
    const query: Knex.QueryBuilder = this.preparePermitsQuery(permitReferenceNumber)
      .select(this.PERMIT_COLUMNS)
      .limit(1)

    return await query.first()
  }

  private preparePermitsQuery(permitReferenceNumber: string): Knex.QueryBuilder {
    const query: Knex.QueryBuilder = this.knex(this.PERMIT_TABLE_NAME)
      .innerJoin('work', 'permit.work_id', 'work.work_id')
      .where('permit.permit_reference_number', permitReferenceNumber.toUpperCase())

    return query
  }
}
