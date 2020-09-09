import 'mocha'
import { ActivityData } from '../../../src/models/activityData'
import ActivityDataMapper from '../../../src/mappers/activityDataMapper'
import { EventNotifierActivityData, RefTrafficManagementType, ActivityLocationType, RefActivityActivityType } from 'street-manager-data'
import { generateActivityData } from '../../fixtures/activityDataFixtures'
import { booleanFilter } from '../../../src/filters'
import { assert } from 'chai'
import GeometryService from '../../../src/services/geometryService'
import { mock, instance, when } from 'ts-mockito'
import { generateActivityLocationType } from '../../fixtures/activityLocationTypeFixtures'

describe('ActivityDataMapper', () => {
  let activityData: ActivityData
  let activityLocationTypes: ActivityLocationType[]

  let activityDataMapper: ActivityDataMapper
  let geometryService: GeometryService

  const activityCoordinates = '{"type":"Point","coordinates":[85647.67,653421.03]}'
  const activityCoordinatesFormatted = 'POINT(85647.67 653421.03)'

  before(() => {
    geometryService = mock(GeometryService)

    activityData = { ...generateActivityData(), activity_coordinates: activityCoordinates }
    activityLocationTypes = [generateActivityLocationType(activityData.activity_id)]
    activityDataMapper = new ActivityDataMapper(instance(geometryService))

    when(geometryService.parseGeoJSONStringToWKT(activityCoordinates)).thenReturn(activityCoordinatesFormatted)
  })

  describe('mapActivityDataToEventNotifierActivityData', () => {
    it('should map the activity data to event notifier activity data', () => {
      const eventNotifierActivityData: EventNotifierActivityData = activityDataMapper.mapActivityDataToEventNotifierActivityData(activityData, activityLocationTypes)

      assert.equal(eventNotifierActivityData.activity_reference_number, activityData.activity_reference_number)
      assert.equal(eventNotifierActivityData.usrn, activityData.usrn.toString())
      assert.equal(eventNotifierActivityData.street_name, activityData.street_name)
      assert.equal(eventNotifierActivityData.area_name, activityData.area_name)
      assert.equal(eventNotifierActivityData.town, activityData.town)
      assert.equal(eventNotifierActivityData.road_category, activityData.road_category)
      assert.equal(eventNotifierActivityData.activity_coordinates, activityCoordinatesFormatted)
      assert.equal(eventNotifierActivityData.activity_name, activityData.activity_name)
      assert.equal(eventNotifierActivityData.activity_type, RefActivityActivityType[activityData.activity_activity_type_id])
      assert.equal(eventNotifierActivityData.start_date, activityData.start_date.toISOString())
      assert.equal(eventNotifierActivityData.end_date, activityData.end_date.toISOString())
      assert.equal(eventNotifierActivityData.start_time, activityData.start_time.toISOString())
      assert.equal(eventNotifierActivityData.end_time, activityData.end_time.toISOString())
      assert.equal(eventNotifierActivityData.activity_location_type, 'Footway')
      assert.equal(eventNotifierActivityData.traffic_management_required, booleanFilter(activityData.traffic_management_required))
      assert.equal(eventNotifierActivityData.traffic_management_type, RefTrafficManagementType[activityData.traffic_management_type_id])
      assert.equal(eventNotifierActivityData.collaborative_working, booleanFilter(activityData.collaborative_working))
      assert.equal(eventNotifierActivityData.cancelled, booleanFilter(activityData.cancelled))
      assert.equal(eventNotifierActivityData.highway_authority_swa_code, activityData.ha_organisation_reference)
      assert.equal(eventNotifierActivityData.highway_authority, activityData.ha_organisation_name)
    })
  })
})
