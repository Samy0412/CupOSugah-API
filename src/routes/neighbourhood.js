const router = require("express").Router();
const { findUserCoordinates } = require("../helpers/findUserCoordinates");



module.exports = db => {
  router.get("/", (request, response) => {
    db.query(
      `
      SELECT *
      FROM neighbourhoods;
    `
    ).then(({ rows: neighbourhoods }) => {
      response.json(neighbourhoods);
    });
  });


  router.post("/create", (request,response)=> {
    const values = [
      request.body.neighbourhoodName,
      request.body.coordinates,
      request.body.bounds,
      request.body.picture ? request.body.picture : 'https://i.imgur.com/j6IJGS2.png',
    ];

    db.query(
      `
  INSERT INTO neighbourhoods (name, coordinates, bounds, neighbourhood_photo)
  VALUES ($1, $2, $3, $4)
  RETURNING *;
    `,
      values
    )
      .then((data) => {
        const neighbourhoodObj = data.rows[0];
        response.status(200).json(neighbourhoodObj);
        console.log("Neighbourhood created successfully with the following values", neighbourhoodObj);
      }).catch ((err)=> console.log(err));
  })

  

  return router;
};
