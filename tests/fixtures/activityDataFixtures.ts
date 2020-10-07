import * as moment from 'moment-timezone'
import { RefTrafficManagementType, RefActivityActivityType } from 'street-manager-data'
import { generatePointGeoJson } from './geojsonFixtures'
import { ActivityData } from '../../src/models/activityData'

export function generateActivityData(): ActivityData {
  return {
    activity_id: 1,
    activity_reference_number: 'some ref',
    usrn: 8400845,
    street_name: 'some street',
    area_name: 'some area',
    town: 'town',
    road_category: 1,
    activity_coordinates: generatePointGeoJson(),
    activity_name: 'Activity Name',
    activity_activity_type_id: RefActivityActivityType.compound,
    activity_type_details: 'Type details',
    start_date: moment('2019-07-15 00:00').toDate(),
    start_time: moment('2019-07-15 10:00').toDate(),
    end_date: moment('2019-07-17 00:00').toDate(),
    end_time: moment('2019-07-17 11:00').toDate(),
    activity_location_description: 'Location description',
    traffic_management_required: false,
    traffic_management_type_id: RefTrafficManagementType.convoy_workings,
    collaborative_working: false,
    cancelled: false,
    ha_organisation_reference: 'ha ref',
    ha_organisation_name: 'ha org'
  }
}
