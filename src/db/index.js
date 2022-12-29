const pg = require("pg");

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;
const URL = `postgres://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?options=project%3D${ENDPOINT_ID}`;

const client = new pg.Client({
  connectionString: URL || "",
  ssl: {
    rejectUnauthorized: false,
  },
});

client
  .connect()
  .catch((e) => console.log(`Error connecting to Postgres server:\n${e}`));

module.exports = client;
