import 'mocha'
import { assert } from 'chai'
import GeometryService from '../../../src/services/geometryService'

describe('GeometryService', () => {

  let geometryService: GeometryService

  const pointCoordinates = '{"type":"Point","coordinates":[85647.67,653421.03]}'
  const pointCoordinatesFormatted = 'POINT(85647.67 653421.03)'

  const polygonCoordinates = '{"type":"Polygon","coordinates":[[[334090.702270508,350128.703491211],[334145.869018555,350178.640136719],[334112.633911133,350140.560913086],[334104.702270508,350098.703491211]]]}'
  const polygonCoordinatesFormatted = 'POLYGON((334090.702270508 350128.703491211,334145.869018555 350178.640136719,334112.633911133 350140.560913086,334104.702270508 350098.703491211))'

  const lineStringCoordinates = '{"type":"LineString","coordinates":[[[334003, 350162],[334083, 350162]]]}'
  const lineStringCoordinatesFormatted = 'LINESTRING(334003,350162 334083,350162)'

  before(() => {
    geometryService = new GeometryService()
  })

  describe('parseGeoJSONStringToWKT', () => {
    it('should return a Point object in the correct format', () => {
      const result: string = geometryService.parseGeoJSONStringToWKT(pointCoordinates)

      assert.equal(result, pointCoordinatesFormatted)
    })

    it('should return a Polygon object in the correct format', () => {
      const result: string = geometryService.parseGeoJSONStringToWKT(polygonCoordinates)

      assert.equal(result, polygonCoordinatesFormatted)
    })

    it('should return a LineString object in the correct format', () => {
      const result: string = geometryService.parseGeoJSONStringToWKT(lineStringCoordinates)

      assert.equal(result, lineStringCoordinatesFormatted)
    })
  })
})
