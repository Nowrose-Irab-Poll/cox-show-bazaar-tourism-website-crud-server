const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectID;

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.g5tsn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    console.log("Connected to db");
    const database = client.db("cox_show_db");
    const packageCollection = database.collection("packages");

    //Packages GET API
    app.get("/packages", async (req, res) => {
      const cursor = packageCollection.find({});
      const packages = await cursor.toArray();
      res.send(packages);
    });

    //Single package GET API
    app.get("/packages/:id", async (req, res) => {
      const id = req.params.id;

      const query = { _id: ObjectId(id) };

      const result = await packageCollection.findOne(query);

      res.send(result);
    });

    //Order POST API
    app.post("place-order/", async (req, res) => {
      console.log(req.body);
      res.send("This is place order response");
    });
  } finally {
    // await client.close()
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Welcome to Cox Show Bazaar API");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
