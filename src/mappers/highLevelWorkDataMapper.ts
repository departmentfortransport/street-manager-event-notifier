import { injectable, inject } from 'inversify'
import { HighLevelWorkDataData } from '../models/highLevelWorkDataData'
import { HighLevelWorkData, RefWorkStatus, RefWorkCategory, RefTrafficManagementType, RefActivityType } from 'street-manager-data'
import { buildDateString } from '../helpers/dateHelper'
import { mapCoordinatesToCSV } from '../helpers/coordinatesHelper'
import { worksCategoryFilter, trafficManagementTypeFilter, worksStatusFilter, asOptionalDateTime, asOptionalTime, booleanFilter } from '../filters'
import TYPES from '../types'
import DBService from '../services/dbService'

@injectable()
export default class HighLevelWorkDataMapper {
  public constructor (
    @inject(TYPES.DBService) private db: DBService
  ) {}

  public async mapDataToInfo(data: HighLevelWorkDataData): Promise<HighLevelWorkData> {
    console.log('Nat3: ', data.permit_coordinates)
    console.log('Nat4: ', this.db.postgis().asGeoJSON(data.permit_coordinates))

    const x: HighLevelWorkData = {
      work_reference_number: data.work_reference_number,
      permit_reference_number: data.permit_reference_number,
      promoter_swa_code: data.promoter_organisation_reference,
      promoter_organisation: data.promoter_organisation_name,
      highway_authority: data.ha_organisation_name,
      works_location_coordinates: mapCoordinatesToCSV(this.db.postgis().asGeoJSON(data.permit_coordinates)),
      street_name: data.street_name,
      area_name: data.area_name,
      work_category: worksCategoryFilter(data.work_category_id),
      traffic_management_type: trafficManagementTypeFilter(data.traffic_management_type_id),
      proposed_start_date: buildDateString(data.proposed_start_date),
      proposed_start_time: asOptionalTime(data.proposed_start_time),
      proposed_end_date: buildDateString(data.proposed_end_date),
      proposed_end_time:  asOptionalTime(data.proposed_end_time),
      actual_start_date:  asOptionalDateTime(data.actual_start_date),
      actual_end_date: asOptionalDateTime(data.actual_end_date),
      work_status: worksStatusFilter(RefWorkStatus[data.work_status]),
      usrn: data.usrn.toString(),
      highway_authority_swa_code: data.ha_organisation_reference,
      work_category_ref: RefWorkCategory[data.work_category_id],
      traffic_management_type_ref: RefTrafficManagementType[data.traffic_management_type_id],
      work_status_ref: RefWorkStatus[data.work_status],
      activity_type: RefActivityType[data.activity_type],
      is_ttro_required: booleanFilter(data.is_ttro_required)
    }
    console.log('Nat4: ', x)

    return x
  }
}
