module.exports = {
  // AWS
  AWSREGION: process.env.AWSREGION,

  // DB
  PGHOST: process.env.PGHOST,
  PGDATABASE: process.env.PGDATABASE,
  PGUSER: process.env.PGUSER,
  PGPASSWORD: process.env.PGPASSWORD,
  PGPORT: process.env.PGPORT,
  PGMINPOOLSIZE: Number(process.env.PGMINPOOLSIZE) || 5,
  PGMAXPOOLSIZE: Number(process.env.PGMAXPOOLSIZE) || 10,
  PGSSL: (process.env.PGSSL === true || process.env.PGSSL === 'true') || false,

  // SNS
  PERMITTOPICARN: process.env.PERMITTOPICARN,
  ACTIVITYTOPICARN: process.env.ACTIVITYTOPICARN
}
