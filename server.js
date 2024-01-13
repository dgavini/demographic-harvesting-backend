// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fetchData = require('./components/fetchData');

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());

app.get("/fetch", async (req, res)=>{
  try {
    console.log("Hello");
    const lat = req.query.lat;
    const lng = req.query.lng;
    const radius = req.query.radius;
    const method = req.query.method;

    const data = await fetchData(lat, lng, radius, method);


    res.send(data);
} catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Internal Server Error");
}
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
