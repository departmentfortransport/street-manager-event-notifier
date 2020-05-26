import { EventNotifierWorkData } from 'street-manager-data'

export function generateEventNotifierWorkData(): EventNotifierWorkData {
  return {
    work_reference_number: 'some ref',
    permit_reference_number: 'some ref-01',
    promoter_swa_code: 'a',
    promoter_organisation: 'some promoter',
    highway_authority: 'some ha',
    works_location_coordinates: 'Point: 085647.67,653421.03',
    street_name: 'some street',
    area_name: 'some area',
    work_category: 'Standard',
    traffic_management_type: 'No carriageway incursion',
    proposed_start_date: '15-07-2019',
    proposed_start_time: '11:00',
    proposed_end_date: '17-07-2019',
    proposed_end_time: '12:00',
    actual_start_date: '15-07-2019 01:00',
    actual_end_date: '17-07-2019 01:00',
    work_status: 'Works planned',
    usrn: '8400845',
    highway_authority_swa_code: 'a',
    work_category_ref: 'standard',
    traffic_management_type_ref: 'no_carriageway_incursion',
    work_status_ref: 'planned',
    activity_type: 'Core Sampling',
    is_ttro_required: 'No'
  }
}
