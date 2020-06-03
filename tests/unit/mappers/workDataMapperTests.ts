import 'mocha'
import { WorkData } from '../../../src/models/workData'
import WorkDataMapper from '../../../src/mappers/workDataMapper'
import { EventNotifierWorkData, RefWorkStatus, RefWorkCategory, RefTrafficManagementType } from 'street-manager-data'
import { generateWorkData } from '../../fixtures/workDataFixtures'
import { worksStatusFilter, trafficManagementTypeFilter, activityTypeFilter, worksCategoryFilter, booleanFilter } from '../../../src/filters'
import { assert } from 'chai'

describe('WorkDataMapper', () => {
  let workData: WorkData
  let workDataMapper: WorkDataMapper

  before(() => {
    workData = { ...generateWorkData(), permit_coordinates: '{"type":"Point","coordinates":[85647.67,653421.03]}' }
    workDataMapper = new WorkDataMapper()
  })

  describe('mapWorkDataToEventNotifierWorkData', () => {
    it('should map the work data to event notifier work data', () => {
      const result: EventNotifierWorkData = workDataMapper.mapWorkDataToEventNotifierWorkData(workData)

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
      assert.equal(result.proposed_start_date, workData.proposed_start_date.toISOString())
      assert.equal(result.proposed_end_date, workData.proposed_end_date.toISOString())
      assert.equal(result.proposed_start_time, workData.proposed_start_time.toISOString())
      assert.equal(result.proposed_end_time, workData.proposed_end_time.toISOString())
      assert.equal(result.actual_start_date, workData.actual_start_date.toISOString())
      assert.equal(result.actual_end_date, workData.actual_end_date.toISOString())
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
