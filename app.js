const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const _ = require('lodash');
const {
  Pool
} = require('pg');

const storage = require(__dirname + "/storage.js");


const app = express();

app.use(express.urlencoded({
  extended: true
}));

app.set('view engine', 'ejs');
app.use(express.static("public"));


// global vars

var CustomerLoginInfo = {
  customerId: "Null",
  customerName: "Null",
  email: "Null",
  dateOfBirth: "Null",
  address: "Null"
};


var ArtistLoginInfo = {
  artistName: "",
  sellerName: "",
  email: "",
  ratting: ""
};

var Songs = {};



var Tracks = [
  {
    trackName: "Null"
  }
];

var Albums = [{
  albumName: "Null"
}];




let pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: '201901085_db',
  password: 'admin',
  port: 5432
});



app.get("/info/get", (req, res) => {
  try {
    pool.connect(async (err, client, release) => {
      client.query('SET SEARCH_PATH TO "OMMS"');

      const Query = `SELECT "noOfSongsForEveryGenre"();`;

      let resp = await client.query(Query);
      res.send(resp.rows);
    });
  } catch (err) {
    console.log(err);
  }
});


app.get("/", (req, res) => {
  try {
    pool.connect(async (err, client, release) => {
      client.query('SET SEARCH_PATH TO "OMMS"');
      let Query = `SELECT * FROM "Track"`;

      let resp = await client.query(Query);

      

      res.render("home", {
        // Artist: resp.rows
        Songs: resp.rows,
        name: "Look at The Tracks",
        visualLogin: "",
        visualCart: "visually-hidden",
        CustomerId: 1
      });
    });
  } catch (err) {
    console.log(err);
  }

});





app.get("/customerRegister", function(req, res) {
  res.render("customerRegister", {
    visualLogin: "",
    visualCart: "visually-hidden",
    message: "",
    CustomerId: 1
  });
});



app.get("/artistRegister", function(req, res) {
  res.render("artistRegister", {
    visualLogin: "",
    visualCart: "visually-hidden",
    message1: "",
    message2: "",
    CustomerId: 1
  });
});






app.get("/customerLogin", function(req, res) {
  res.render("customerLogin", {
    visualLogin: "",
    visualCart: "visually-hidden",
    CustomerId: 1
  });
});


app.get("/artistLogin", function(req, res) {
  res.render("artistLogin", {
    visualLogin: "",
    visualCart: "visually-hidden",
    CustomerId: 1
  });
});





app.get("/customerLoggedIn", function(req, res) {

  res.render("customerLoggedIn", {
    customerData: CustomerLoginInfo,
    visualLogin: "visually-hidden",
    visualCart: "",
    CustomerId: CustomerLoginInfo.customerId
  });
});


app.get("/artistLoggedIn", function(req, res) {

  res.render("artistLoggedIn", {
    artistData: ArtistLoginInfo,
    visualLogin: "visually-hidden",
    visualCart: "visually-hidden",
    CustomerId: 1
  });
});






app.post("/customerRegister", function(req, res) {

  const customerName = req.body.CustomerName;
  const email = req.body.Email;
  const DOB = req.body.DOB;
  const Address = req.body.Address;
  const Username = req.body.Username;
  const Password = req.body.Password;

  try {
    pool.connect(async (err, client, release) => {
      client.query('SET SEARCH_PATH TO "OMMS"');
      let Query1 = `SELECT * FROM "Customer"`;

      let resp1 = await client.query(Query1);
      var temp = "false";


      for (let i = 0; i < resp1.rows.length; i++) {
        if (resp1.rows[i].userName === Username) {
          
          temp = "true";
          res.render("customerRegister", {
            visualLogin: "",
            visualCart: "visually-hidden",
            message: "* Username already exists Please try another one",
            CustomerId: 1
          });
        }
      }

      if(temp === "false") {
        const id = resp1.rows.length + 1;

        const text = `INSERT INTO "Customer"("customerId", "customerName", "userName", "password_", "email", "dateOfBirth", "address")
                      VALUES ($1, $2, $3, $4, $5, $6, $7)`;
        const values = [id, customerName, Username, Password, email, DOB, Address];



        client.query('SET SEARCH_PATH TO "OMMS"');

        let resp2 = await client.query(text, values);


      client.query('SET SEARCH_PATH TO "OMMS"');
      let Query2 = `SELECT * FROM "Track"`;

      let resp3 = await client.query(Query2);




        res.render("home", {
          Songs: resp3.rows,
          name: "Items Inserted!, You can look at the Tracks",
          visualLogin: "",
          visualCart: "visually-hidden",
          CustomerId: 1
        });
      }


    });
  } catch (err) {
    console.log(err);
  }
});









app.post("/artistRegister", function(req, res) {

  const artistName = req.body.ArtistName;
  const sellerName = req.body.SellerName;
  const email = req.body.Email;
  const gender = req.body.Gender;
  const Username = req.body.Username;
  const Password = req.body.Password;

  try {
    pool.connect(async (err, client, release) => {
      client.query('SET SEARCH_PATH TO "OMMS"');
      let Query1 = `SELECT * FROM "Artist"`;

      let resp1 = await client.query(Query1);
      var temp = "false";


      for (let i = 0; i < resp1.rows.length; i++) {
        if (resp1.rows[i].userName === Username) {
          
          temp = "true";
          res.render("artistRegister", {
            visualLogin: "",
            visualCart: "visually-hidden",
            message1: "* Username already exists Please try another one",
            message2: "",
            CustomerId: 1
          });
        }
      }

      if(temp === "false" && !(gender == "Male" || gender == "Female")) {
        temp = "true";
        res.render("artistRegister", {
          visualLogin: "",
          visualCart: "visually-hidden",
          message1: "",
          message2: "* Please write gender value as shown in instructions below that gender input.",
          CustomerId: 1
        });
      }



      if(temp === "false") {
        const id = resp1.rows.length + 1;

        const text = `INSERT INTO "Artist"("artistId", "artistName", "sellerName", "email", "userName", "password_", "gender", "ratting")
                                  VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`;
        const values = [id, artistName, sellerName, email, Username, Password, gender, 1];



        client.query('SET SEARCH_PATH TO "OMMS"');

        let resp2 = await client.query(text, values);


      client.query('SET SEARCH_PATH TO "OMMS"');
      let Query2 = `SELECT * FROM "Track"`;

      let resp3 = await client.query(Query2);

        res.render("home", {
          Songs: resp3.rows,
          name: "Items Inserted!, You can look at the Tracks",
          visualLogin: "",
          visualCart: "visually-hidden",
          CustomerId: 1
        });
      }


    });
  } catch (err) {
    console.log(err);
  }
});

























app.post("/customerLoggedIn", function(req, res) {

  try {
    pool.connect(async (err, client, release) => {
      await client.query('SET SEARCH_PATH TO "OMMS"');
      const Query = `SELECT * FROM "Customer"`;
      const resp = await client.query(Query);

      //console.log(req.body);

      for (let i = 0; i < resp.rows.length; i++) {
        //console.log(resp.rows[i]);

        if (req.body.Username === resp.rows[i].userName) {
          if (req.body.Password === resp.rows[i].password_) {
            // console.log(resp1.rows);

            CustomerLoginInfo = resp.rows[i];

            res.render("customerLoggedIn", {
              customerData: resp.rows[i],
              visualLogin: "visually-hidden",
              visualCart: "",
              CustomerId: resp.rows[i].customerId
            });
          }
        }
      }

      // res.redirect("/");

    });
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }

});




app.post("/artistLoggedIn", function(req, res) {

  try {
    pool.connect(async (err, client, release) => {
      await client.query('SET SEARCH_PATH TO "OMMS"');
      const Query = `SELECT * FROM "Artist"`;
      const resp = await client.query(Query);

      //console.log(req.body);

      for (let i = 0; i < resp.rows.length; i++) {
        //console.log(resp.rows[i]);

        if (req.body.Username === resp.rows[i].userName) {
          if (req.body.Password === resp.rows[i].password_) {
            // console.log(resp1.rows);

            ArtistLoginInfo = resp.rows[i];


            client.query('SET SEARCH_PATH TO "OMMS"');
    
            const resp1 = await client.query(`SELECT "trackName" FROM "Track" 
                                        INNER JOIN "artistTrack" ON "Track"."trackId" = "artistTrack"."trackId"
                                        INNER JOIN "Artist" ON "Artist"."artistId" = "artistTrack"."artistId"
                                        GROUP BY "Track"."trackName", "Artist"."artistId"
                                        HAVING "Artist"."artistId" = $1`, [resp.rows[i].artistId]);

            Tracks = resp1.rows;



            client.query('SET SEARCH_PATH TO "OMMS"');
    
            const resp2 = await client.query(`SELECT "albumName" FROM "Album" 
                                        INNER JOIN "artistAlbum" ON "Album"."albumId" = "artistAlbum"."albumId"
                                        INNER JOIN "Artist" ON "Artist"."artistId" = "artistAlbum"."artistId"
                                        GROUP BY "Album"."albumName", "Artist"."artistId"
                                        HAVING "Artist"."artistId" = $1`, [resp.rows[i].artistId]);

            Albums = resp2.rows;


            //Tracks = storage.getTracks(resp.rows[i].artistId);
            // console.log(Tracks);

            res.render("artistLoggedIn", {
              artistData: resp.rows[i],
              visualLogin: "visually-hidden",
              visualCart: "visually-hidden",
              ArtistId: resp.rows[i].artistId,
              CustomerId: 1
            });
          }
        }
      }

      // res.redirect("/");

    });
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }

});




app.get("/tracks", (req, res) => {
  res.render("tracks", {
    Tracks: Tracks,
    visualLogin: "visually-hidden",
    visualCart: "visually-hidden",
    CustomerId: 1
  });
});


app.get("/albums", (req, res) => {
  res.render("albums", {
    Albums: Albums,
    visualLogin: "visually-hidden",
    visualCart: "visually-hidden",
    CustomerId: 1
  });
});












app.get("/cart/:Customer_Id", (req, res) => {

  try {
    pool.connect(async (err, client, release) => {
      
      const id = _.lowerCase(req.params.Customer_Id);

      await client.query('SET SEARCH_PATH TO "OMMS"');
      const resp = await client.query(`SELECT "Track"."trackName", "amount" FROM "Cart" INNER JOIN "Track" ON "Track"."trackId" = "Cart"."trackId"
                                        INNER JOIN "Customer" ON "Cart"."customerId" = "Customer"."customerId"
                                        GROUP BY "Customer"."customerId", "Track"."trackName", "amount"
                                        HAVING "Customer"."customerId" = $1`, [id]);


      res.render("cart", {
        cartData: resp.rows,
        visualLogin: "visually-hidden",
        visualCart: "visually-hidden",
        CustomerId: id
      });
    });
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }

});



app.get("/wishlist/:Customer_Id", (req, res) => {

  try {
    pool.connect(async (err, client, release) => {
      
      const id = _.lowerCase(req.params.Customer_Id);


      await client.query('SET SEARCH_PATH TO "OMMS"');
      const resp = await client.query(`SELECT "Track"."trackName", "amount" FROM "Wishlist" INNER JOIN "Track" ON "Track"."trackId" = "Wishlist"."trackId"
                                        INNER JOIN "Customer" ON "Wishlist"."customerId" = "Customer"."customerId"
                                        GROUP BY "Customer"."customerId", "Track"."trackName", "amount"
                                        HAVING "Customer"."customerId" = $1`, [id]);


      res.render("wishlist", {
        wishlistData: resp.rows,
        visualLogin: "visually-hidden",
        visualCart: "visually-hidden",
        CustomerId: id
      });
    });
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }

});










app.listen(3000, function() {
  console.log('Server is running on port 3000');
});