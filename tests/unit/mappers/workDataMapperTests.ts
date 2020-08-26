import 'mocha'
import { WorkData } from '../../../src/models/workData'
import WorkDataMapper from '../../../src/mappers/workDataMapper'
import { EventNotifierWorkData, RefWorkStatus, RefWorkCategory, RefTrafficManagementType, PermitLocationType, PermitPermitCondition, RefPermitConditionType } from 'street-manager-data'
import { generateWorkData } from '../../fixtures/workDataFixtures'
import { worksStatusFilter, trafficManagementTypeFilter, activityTypeFilter, worksCategoryFilter, booleanFilter, permitStatusFilter } from '../../../src/filters'
import { assert } from 'chai'
import GeometryService from '../../../src/services/geometryService'
import { mock, instance, when } from 'ts-mockito'
import { generatePermitLocationType } from '../../fixtures/permitLocationTypeFixtures'
import { generatePermitPermitCondition } from '../../fixtures/permitConditionFixtures'

describe('WorkDataMapper', () => {
  let workData: WorkData
  let permitLocationTypes: PermitLocationType[]
  let permitConditions: PermitPermitCondition[]

  let workDataMapper: WorkDataMapper
  let geometryService: GeometryService

  const permitCoordinates = '{"type":"Point","coordinates":[85647.67,653421.03]}'
  const permitCoordinatesFormatted = 'POINT(85647.67 653421.03)'

  before(() => {
    geometryService = mock(GeometryService)

    workData = { ...generateWorkData(), permit_coordinates: permitCoordinates }
    permitLocationTypes = [generatePermitLocationType(workData.permit_version_id)]
    permitConditions = [generatePermitPermitCondition(workData.permit_version_id, RefPermitConditionType.NCT01a), generatePermitPermitCondition(workData.permit_version_id, RefPermitConditionType.NCT02b)]
    workDataMapper = new WorkDataMapper(instance(geometryService))

    when(geometryService.parseGeoJSONStringToWKT(permitCoordinates)).thenReturn(permitCoordinatesFormatted)
  })

  describe('mapWorkDataToEventNotifierWorkData', () => {
    it('should map the work data to event notifier work data', () => {
      const eventNotifierWorkData: EventNotifierWorkData = workDataMapper.mapWorkDataToEventNotifierWorkData(workData, permitLocationTypes, permitConditions)

      assert.equal(eventNotifierWorkData.work_reference_number, workData.work_reference_number)
      assert.equal(eventNotifierWorkData.permit_reference_number, workData.permit_reference_number)
      assert.equal(eventNotifierWorkData.promoter_swa_code, workData.promoter_organisation_reference)
      assert.equal(eventNotifierWorkData.promoter_organisation, workData.promoter_organisation_name)
      assert.equal(eventNotifierWorkData.highway_authority, workData.ha_organisation_name)
      assert.equal(eventNotifierWorkData.works_location_coordinates, permitCoordinatesFormatted)
      assert.equal(eventNotifierWorkData.street_name, workData.street_name)
      assert.equal(eventNotifierWorkData.area_name, workData.area_name)
      assert.equal(eventNotifierWorkData.work_category, worksCategoryFilter(workData.work_category_id))
      assert.equal(eventNotifierWorkData.traffic_management_type, trafficManagementTypeFilter(workData.traffic_management_type_id))
      assert.equal(eventNotifierWorkData.proposed_start_date, workData.proposed_start_date.toISOString())
      assert.equal(eventNotifierWorkData.proposed_end_date, workData.proposed_end_date.toISOString())
      assert.equal(eventNotifierWorkData.proposed_start_time, workData.proposed_start_time.toISOString())
      assert.equal(eventNotifierWorkData.proposed_end_time, workData.proposed_end_time.toISOString())
      assert.equal(eventNotifierWorkData.actual_start_date_time, workData.actual_start_date.toISOString())
      assert.equal(eventNotifierWorkData.actual_end_date_time, workData.actual_end_date.toISOString())
      assert.equal(eventNotifierWorkData.work_status, worksStatusFilter(RefWorkStatus[workData.work_status_id]))
      assert.equal(eventNotifierWorkData.usrn, workData.usrn.toString())
      assert.equal(eventNotifierWorkData.highway_authority_swa_code, workData.ha_organisation_reference)
      assert.equal(eventNotifierWorkData.work_category_ref, RefWorkCategory[workData.work_category_id])
      assert.equal(eventNotifierWorkData.traffic_management_type_ref, RefTrafficManagementType[workData.traffic_management_type_id])
      assert.equal(eventNotifierWorkData.work_status_ref, RefWorkStatus[workData.work_status_id])
      assert.equal(eventNotifierWorkData.activity_type, activityTypeFilter(workData.activity_type_id))
      assert.equal(eventNotifierWorkData.is_ttro_required, booleanFilter(workData.is_ttro_required))
      assert.equal(eventNotifierWorkData.is_covid_19_response, booleanFilter(workData.is_covid_19_response))
      assert.equal(eventNotifierWorkData.works_location_type, 'Footway')
      assert.equal(eventNotifierWorkData.permit_conditions, 'NCT01a, NCT02b')
      assert.equal(eventNotifierWorkData.road_category, workData.road_category)
      assert.equal(eventNotifierWorkData.is_traffic_sensitive, booleanFilter(workData.is_traffic_sensitive))
      assert.equal(eventNotifierWorkData.is_deemed, booleanFilter(workData.is_deemed))
      assert.equal(eventNotifierWorkData.permit_status, permitStatusFilter(workData.permit_status_id))
      assert.equal(eventNotifierWorkData.town, workData.town)
    })
  })
})
