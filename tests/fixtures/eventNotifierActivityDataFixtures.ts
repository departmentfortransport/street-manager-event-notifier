import { EventNotifierActivityData } from 'street-manager-data'

export function generateEventNotifierActivityData(): EventNotifierActivityData {
  return {
    activity_reference_number: 'some ref',
    usrn: '8400845',
    street_name: 'some street',
    area_name: 'some area',
    town: 'town',
    road_category: '1',
    activity_coordinates: 'Point: 085647.67,653421.03',
    activity_name: 'Activity Name',
    activity_type: 'compound',
    activity_location_type: 'footway',
    activity_type_details: 'Type details',
    start_date: '15-07-2019',
    start_time: '11:00',
    end_date: '17-07-2019',
    end_time: '12:00',
    activity_location_description: 'Location details',
    traffic_management_required: 'false',
    traffic_management_type: 'convoy_workings',
    collaborative_working: 'false',
    cancelled: 'false',
    highway_authority_swa_code: 'ha ref',
    highway_authority: 'ha org'
  }
}
