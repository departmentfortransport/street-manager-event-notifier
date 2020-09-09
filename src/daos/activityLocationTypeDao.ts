import { injectable } from 'inversify'
import * as Knex from 'knex'
import { ActivityLocationType } from 'street-manager-data'

@injectable()
export default class ActivityLocationTypeDao {

  private readonly ACTIVITY_LOCATION_TYPE_TABLE = 'activity_location_type'

  private readonly ACTIVITY_LOCATION_TYPE_COLUMNS: string[] = [
    'activity_id',
    'location_type_id'
  ]

  public async getActivityLocationTypeByActivityId(activityId: number, knex: Knex): Promise<ActivityLocationType[]> {
    return await knex(this.ACTIVITY_LOCATION_TYPE_TABLE)
      .select(this.ACTIVITY_LOCATION_TYPE_COLUMNS)
      .where('activity_id', activityId)
  }
}
