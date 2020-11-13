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

  router.get("/choices", (request, response) => {
    // findUserByID(request.session.user_id)
    //   .then((user) => {
        findUserCoordinates(request.session.user_id)
          .then((coordinates) => {
            db.query(
              `
              SELECT * 
              FROM neighbourhoods;
              `
            ).then(({ rows: data }) => {
              for (items of data) {
                items.score = Math.sqrt(Math.pow((coordinates.x - items.coordinates.x), 2) + Math.pow((coordinates.y - items.coordinates.y), 2));
              }
              response.json(data.sort((a, b) => {
                if (a.score < b.score) return -1;
                if (a.score > b.score) return 1;
                return 0;
              }));
            });
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
