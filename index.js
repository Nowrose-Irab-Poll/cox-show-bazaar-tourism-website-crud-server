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
    const orderCollection = database.collection("orders");
    const siteCollection = database.collection("sites");

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

    //All Orders GET API
    app.get("/orders", async (req, res) => {
      const cursor = orderCollection.find({});
      const orders = await cursor.toArray();

      res.send(orders);
    });

    //User wise Orders GET API
    app.get("/orders/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };

      const cursor = orderCollection.find(query);

      const result = await cursor.toArray();

      res.send(result);
    });

    //All Sites GET API
    app.get("/sites", async (req, res) => {
      const cursor = siteCollection.find({});
      const sites = await cursor.toArray();
      res.send(sites);
    });

    //Order POST API
    app.post("/place-order", async (req, res) => {
      const order = req.body;
      const result = await orderCollection.insertOne(order);

      res.send(result);
    });

    //Order DELETE API
    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await orderCollection.deleteOne(query);
      res.send(result);
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
