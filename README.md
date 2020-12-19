# Cuposugah API (server-side)

## Setup

Install dependencies with `npm install`.

## Creating The DB

You need to use a machine with PostgreSQL installed on it.

Create a database with the command `CREATE DATABASE neighbourhood;`.

Copy the `.env.example` file to `.env.development` and fill in the necessary PostgreSQL configuration (all the [ ] need to be filled using your configuration data).
You also need to have a Cloudinary account and keys to be able to upload pictures.
```
PGHOST=localhost
PGUSER=[]
PGDATABASE=neighbourhood
PGPASSWORD=[]
PGPORT=5432 (or the PORT you are using for postgresql)

CLOUDINARY_CLOUD_NAME=[]
CLOUDINARY_API_KEY=[]
CLOUDINARY_API_SECRET=[]
```

## Seeding

Run the development server with `npm start`.

Go to http://localhost:8001/ in your browser.

Both of these achieve the same result.

- Make a `GET` request to `/api/debug/reset` with `curl http://localhost:8001/api/debug/reset`.
- Use the browser to navigate to `http://localhost:8001/api/debug/reset`.

## Run The Server

Running the server normally
```sh
npm start
```

## Exemple of API call

### Events

`GET /api/events`

Response

```json
[
  {
    id: 4,
    user_id: 27,
    category_id: 15,
    neighbourhood_id: 3,
    title: "Macrame workshop!",
    coordinates: {
    x: 45.54118,
    y: -73.636679
    },
    time_created: "2020-08-02T21:40:34.000Z",
    description: "Come and join me for a macrame workshop. I just ask for a 5$ participation for the material and you will come back home with a nice plant holder! I will have snacks for everyone.",
    event_start: "2020-12-20T18:53:10.502Z",
    event_photo: "/images/events/crafts-macrame.jpg",
    first_name: "Sara",
    last_name: "Costa",
    profile_photo: "/images/users/w9.png"
  },
  ...
]
```
