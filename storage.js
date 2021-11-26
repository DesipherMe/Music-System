const {
    Pool
  }  = require('pg');


let pool = new Pool({
user: 'postgres',
host: 'localhost',
database: '201901085_db',
password: 'admin',
port: 5432
});




exports.getTracks =  function(artist_Id) {

    var x = [];
    const id = artist_Id;
    console.log(id);


    try {
        pool.connect(async (err, client, release) => {
          
            client.query('SET SEARCH_PATH TO "OMMS"');
    
            const resp = await client.query(`SELECT "trackName" FROM "Track" 
                                        INNER JOIN "artistTrack" ON "Track"."trackId" = "artistTrack"."trackId"
                                        INNER JOIN "Artist" ON "Artist"."artistId" = "artistTrack"."artistId"
                                        GROUP BY "Track"."trackName", "Artist"."artistId"
                                        HAVING "Artist"."artistId" = $1`, [id]);
            console.log(resp.rows);
            x = await resp.rows;
            console.log(x);
            return x; 
            
        });
    } catch (err) {
        console.log(err);
    }
    return x;
};