const { Pool } = require('pg');

async function fetchData(lat,lng,radius, method)
{
  return new Promise((resolve, reject) => {
    const pool = new Pool({
      user: 'guest',
      host: '3.235.170.15',
      database: 'gis',
      password: 'U8OPtddp',
      port: 5432,
    });

  const tableName = 'dfw_demo';
     if(method=="centroid")
     {
      var query = `SELECT
      SUM(population) AS weighted_population,
      AVG(income) AS weighted_average_salary
      FROM dfw_demo
      WHERE ST_DWithin(
      ST_Transform(ST_Centroid(spatialobj), 3857),
      ST_Transform(ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326), 3857),
      ${radius}
      );`;
     }
     else{
          var query = `WITH circle AS (
            SELECT ST_Buffer(ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography, ${radius}) AS circle_geom
        )
        SELECT
            COALESCE(SUM(ST_Area(ST_Intersection(c.circle_geom, dfw_demo.spatialobj)) / ST_Area(dfw_demo.spatialobj) * dfw_demo.population), 0) AS weighted_population,
            COALESCE(SUM(ST_Area(ST_Intersection(c.circle_geom, dfw_demo.spatialobj)) / ST_Area(dfw_demo.spatialobj) * dfw_demo.income) / COUNT(dfw_demo.income), 0) AS weighted_average_salary
        FROM
            dfw_demo, circle c
        WHERE
            ST_Intersects(c.circle_geom, dfw_demo.spatialobj);`;
     }


  pool.query(query, (err, result) => {
    if (err) {
      console.error('Error executing query', err);
      pool.end();
      reject(err);
      return;
    }
    console.log("fetrched Data:", result.rows)
    pool.end();
    resolve(result.rows);
  });
});
}

module.exports=fetchData;