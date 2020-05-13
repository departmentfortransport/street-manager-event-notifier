module.exports = {
  // AWS
  AWSREGION: process.env.AWSREGION || 'eu-west-2',

  // DB
  PGHOST: process.env.PGHOST || 'localhost',
  PGDATABASE: process.env.PGDATABASE || 'work',
  PGUSER: process.env.PGUSER,
  PGPASSWORD: process.env.PGPASSWORD,
  PGPORT: process.env.PGPORT || 5432,
  PGMINPOOLSIZE: Number(process.env.PGMINPOOLSIZE) || 5,
  PGMAXPOOLSIZE: Number(process.env.PGMAXPOOLSIZE) || 10,
  PGSSL: (process.env.PGSSL === true || process.env.PGSSL === 'true') || false,

  // SNS
  WORKSTARTTOPICARN: process.env.WORKSTARTTOPICARN,
  WORKSTOPTOPICARN: process.env.WORKSTOPTOPICARN
}
