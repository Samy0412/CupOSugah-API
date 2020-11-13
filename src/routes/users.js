const router = require("express").Router();
const { findUserByEmail } = require("../helpers/findUserEmail");

module.exports = (db) => {

  router.get("/profile-info", (request, response) => {
    db.query(
      `
      SELECT *
      FROM users;
    `
    ).then(({ rows: userData }) => {
      response.json(userData);
    });
  });

  // Register new user

  router.post("/register", (request, response) => {
    const values = [
      request.body.firstName,
      request.body.email,
      request.body.lastName,
      request.body.password,
      request.body.coordinates,
      request.body.url ? request.body.url : 'https://i.imgur.com/H9g7VHP.png',
      request.body.bio,
      request.body.phoneNumber
    ];

    findUserByEmail(request.body.email)
      .then((user) => {
        if (user) {
          response.status(406).send("user already registered");
        } else {
          db.query(
            `
        INSERT INTO users (first_name, email, last_name, password, coordinates, profile_photo, bio, phone_number)
        VALUES ($1, $2, $3, crypt($4, gen_salt('bf')), $5, $6, $7, $8 )
        RETURNING *;
          `,
            values
          )
            .then((data) => {
              const userObj = data.rows[0];
              request.session["user_id"] = userObj.id;
              response.status(200).json(userObj);
              console.log("User registered successfully with the following values", userObj);
            }).catch((error)=> {
              response.status(500).send({
                message: "failure",
                error,
              })
            })
        }
      }).catch((error)=> {
        response.status(500).send({
          message: "failure",
          error,
        })
      })
  });


//Update address  

router.post("/addAddress", (request, response) => {

  db.query(
    `
    UPDATE users 
    SET coordinates = $1
    WHERE id = $2
    RETURNING *;
    `,
    [
      request.body.coordinates,
      request.body.id
    ]
    ).then((data) => {
        const userObj = data.rows[0];
        request.session["user_id"] = userObj.id;
        // console.log("user cookie is:", request.session["user_id"]);
        response.status(200).json(userObj);
        console.log("User information updated successfully with the following values", userObj);
      }).catch((err)=>console.log(err));
          
});

// Update Neighbourhood

router.post("/addNeighbourhood", (request, response) => {
          
  db.query(
    `
    UPDATE users 
    SET neighbourhood_id = $1
    WHERE id = $2
    RETURNING*;
    `, [request.body.neighbourhood_id, request.body.id]
  ).then((data) => {
    const userObj = data.rows[0];
    response.status(200).json(userObj);
    console.log("User information updated successfully with the following values", userObj);
  });
            
});   

  //Login

  router.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    db.query(
      //gets the user object with its email and password
      `SELECT * FROM users WHERE email LIKE $1 AND password = crypt($2, password);`,
      [email, password]
    )
      .then((data) => {
        if (data) {
          const userObj = data.rows[0];
          console.log("User found with the following values:", userObj);
          //Sets the cookie when login in
          req.session["user_id"] = userObj.id;
          return res.json(userObj);
        }
      })
      .catch((err) => console.error("query error", err.stack));
  });

 //Logout 

  router.post("/logout", (req, res) => {
    req.session = null;
    return res.json({});
  });


 //Edit user information 

  router.post("/edit", (request, response) => {
    const values = [
      request.body.firstName,
      request.body.email,
      request.body.lastName,
      request.body.phone_number,
      request.body.profile_photo ? request.body.profile_photo : 'https://i.imgur.com/j6IJGS2.png',
      request.body.bio,
      request.body.id
    ];

    findUserByEmail(request.body.email)
      .then((user) => {

        if (user && user.id !== request.body.id) {
          response.status(406).send("Access forbidden!");
        } else {
          db.query(
            `
        UPDATE users 
        SET first_name = $1,
          email = $2,
          last_name = $3,
          phone_number = $4,
          profile_photo = $5,
          bio = $6
        WHERE id = $7
        RETURNING *;
          `,
            values
          )
            .then((data) => {
              const userObj = data.rows[0];
              request.session["user_id"] = userObj.id;
              console.log("user cookie is:", request.session["user_id"]);
              response.status(200).json(userObj);
              console.log("User information updated successfully with the following values", userObj);
            });
        }
      });
  });
 
    

router.get("/phone-numbers", (request, response) => {
  db.query(
    `
    SELECT id, phone_number, neighbourhood_id
    FROM users;
  `
  ).then(({ rows: userData }) => {
    response.json(userData);
  });
});

  return router;
};
