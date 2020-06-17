import * as moment from 'moment-timezone'
import { RefActivityType, RefTrafficManagementType, RefWorkCategory, RefWorkStatus } from 'street-manager-data'
import { generatePointGeoJson } from './geojsonFixtures'
import { WorkData } from '../../src/models/workData'

export function generateWorkData(): WorkData {
  return {
    work_reference_number: 'some ref',
    permit_reference_number: 'some ref-01',
    street_name: 'some street',
    area_name: 'some area',
    usrn: 8400845,
    work_status_id: RefWorkStatus.planned,
    permit_coordinates: generatePointGeoJson(),
    proposed_start_date: moment('2019-07-15 00:00').toDate(),
    proposed_start_time: moment('2019-07-15 10:00').toDate(),
    proposed_end_date: moment('2019-07-17 00:00').toDate(),
    proposed_end_time: moment('2019-07-17 11:00').toDate(),
    activity_type_id: RefActivityType.core_sampling,
    work_category_id: RefWorkCategory.standard,
    traffic_management_type_id: RefTrafficManagementType.no_carriageway_incursion,
    promoter_organisation_name: 'some promoter',
    ha_organisation_name: 'some ha',
    promoter_organisation_reference: 'a',
    ha_organisation_reference: 'a',
    actual_start_date: moment('2019-07-15 00:00').toDate(),
    actual_end_date: moment('2019-07-17 00:00').toDate(),
    is_ttro_required: false,
    is_covid_19_response: false,
    permit_version_id: 1
  }
}
