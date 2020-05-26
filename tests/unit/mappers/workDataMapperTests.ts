import 'mocha'
import { WorkData } from '../../../src/models/workData'
import WorkDataMapper from '../../../src/mappers/workDataMapper'
import { EventNotifierWorkData, RefWorkStatus, RefWorkCategory, RefTrafficManagementType } from 'street-manager-data'
import { generateWorkData } from '../../fixtures/workDataFixtures'
import { worksStatusFilter, trafficManagementTypeFilter, activityTypeFilter, worksCategoryFilter, booleanFilter } from '../../../src/filters'
import { assert } from 'chai'
import { buildDateTimeString, buildTimeString, buildDateString } from '../../../src/helpers/dateHelper'

describe('WorkDataMapper', () => {
  let workData: WorkData
  let workDataMapper: WorkDataMapper

  before(() => {
    workData = { ...generateWorkData(), permit_coordinates: '{"type":"Point","coordinates":[85647.67,653421.03]}' }
    workDataMapper = new WorkDataMapper()
  })

  describe('mapWorkDataToEventNotifierWorkData', () => {
    it('should map the work data to a high level work data response', () => {
      const result: EventNotifierWorkData = workDataMapper.mapDataToInfo(workData)

      assert.equal(result.work_reference_number, workData.work_reference_number)
      assert.equal(result.permit_reference_number, workData.permit_reference_number)
      assert.equal(result.promoter_swa_code, workData.promoter_organisation_reference)
      assert.equal(result.promoter_organisation, workData.promoter_organisation_name)
      assert.equal(result.highway_authority, workData.ha_organisation_name)
      assert.equal(result.works_location_coordinates, 'Point: 085647.67,653421.03')
      assert.equal(result.street_name, workData.street_name)
      assert.equal(result.area_name, workData.area_name)
      assert.equal(result.work_category, worksCategoryFilter(workData.work_category_id))
      assert.equal(result.traffic_management_type, trafficManagementTypeFilter(workData.traffic_management_type_id))
      assert.equal(result.proposed_start_date, buildDateString(workData.proposed_start_date))
      assert.equal(result.proposed_end_date, buildDateString(workData.proposed_end_date))
      assert.equal(result.proposed_start_time, buildTimeString(workData.proposed_start_time))
      assert.equal(result.proposed_end_time, buildTimeString(workData.proposed_end_time))
      assert.equal(result.actual_start_date, buildDateTimeString(workData.actual_start_date))
      assert.equal(result.actual_end_date, buildDateTimeString(workData.actual_end_date))
      assert.equal(result.work_status, worksStatusFilter(RefWorkStatus[workData.work_status_id]))
      assert.equal(result.usrn, workData.usrn.toString())
      assert.equal(result.highway_authority_swa_code, workData.ha_organisation_reference)
      assert.equal(result.work_category_ref, RefWorkCategory[workData.work_category_id])
      assert.equal(result.traffic_management_type_ref, RefTrafficManagementType[workData.traffic_management_type_id])
      assert.equal(result.work_status_ref, RefWorkStatus[workData.work_status_id])
      assert.equal(result.activity_type, activityTypeFilter(workData.activity_type_id))
      assert.equal(result.is_ttro_required, booleanFilter(workData.is_ttro_required))
    })
  })
})
