import 'mocha'
import * as sinon from 'sinon'
import RDSService from '../../../../src/services/aws/rdsService'
import { RDS } from 'aws-sdk'
import { assert } from 'chai'
import Logger from '../../../../src/utils/logger'
import { mock} from 'ts-mockito'

describe('rdsService', () => {

  let service: RDSService

  let rds: RDS.Signer
  let logger: Logger

  const awsRegion = 'awsRegion'
  const dbHostName = 'dbHost'
  const port = 1234
  const user = 'dbUser'

  beforeEach(() => {
    rds = new RDS.Signer({
      region: awsRegion,
      hostname: dbHostName,
      port: port,
      username: user
    })

    logger = mock(Logger)

    service = new RDSService(rds, logger)
  })

  describe('getToken', () => {
    let getAuthToken: sinon.SinonStub

    beforeEach(() => {
      getAuthToken = sinon.stub()
      rds.getAuthToken = getAuthToken
    })

    it('should return the rds token from aws', async () => {
      const rdsToken = 'rds-token'
      getAuthToken.yields(null, rdsToken)

      const token = await service.getAuthToken()
      assert.equal(token, rdsToken)
    })
  })
})
