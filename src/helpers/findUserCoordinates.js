const db = require("../db");

const findUserCoordinates = function (id) {
  return db.query(
    `
    SELECT coordinates
    FROM users
    WHERE id = $1;
  `, [id]
  ).then((results) => {
    return results.rows[0].coordinates;
  });
};

module.exports = {
  findUserCoordinates
};

