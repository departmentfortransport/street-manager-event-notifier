import 'reflect-metadata'
import { injectable } from 'inversify'
import { WorkData } from '../models/workData'
import { EventNotifierWorkData, RefWorkStatus, RefWorkCategory, RefTrafficManagementType } from 'street-manager-data'
import { buildDateString } from '../helpers/dateHelper'
import { mapCoordinatesToCSV } from '../helpers/coordinatesHelper'
import { worksCategoryFilter, trafficManagementTypeFilter, worksStatusFilter, asOptionalDateTime, asOptionalTime, booleanFilter, activityTypeFilter } from '../filters'

@injectable()
export default class WorkDataMapper {

  public mapDataToInfo(data: WorkData): EventNotifierWorkData {
    return {
      work_reference_number: data.work_reference_number,
      permit_reference_number: data.permit_reference_number,
      promoter_swa_code: data.promoter_organisation_reference,
      promoter_organisation: data.promoter_organisation_name,
      highway_authority: data.ha_organisation_name,
      works_location_coordinates: mapCoordinatesToCSV(data.permit_coordinates.toString()),
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
      work_status: worksStatusFilter(RefWorkStatus[data.work_status_id]),
      usrn: data.usrn.toString(),
      highway_authority_swa_code: data.ha_organisation_reference,
      work_category_ref: RefWorkCategory[data.work_category_id],
      traffic_management_type_ref: RefTrafficManagementType[data.traffic_management_type_id],
      work_status_ref: RefWorkStatus[data.work_status_id],
      activity_type: activityTypeFilter(data.activity_type_id),
      is_ttro_required: booleanFilter(data.is_ttro_required)
    }
  }
}
