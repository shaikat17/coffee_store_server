const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.l30hzpi.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const coffeeDB = client.db("coffeeDB").collection("coffees");

    app.post("/coffee", async (req, res) => {
      const newCoffee = req.body;
      // console.log(newCoffee);
      const result = await coffeeDB.insertOne(newCoffee)
      res.send(result)
    });

    app.get('/coffees', async (req, res) => {
      const result = await coffeeDB.find().toArray()
      // console.log(result)
      res.send(result)
    })

    app.delete('/coffee/:id', async (req, res) => {
      const id = req.params.id
      // console.log(id)
      const result = await coffeeDB.deleteOne({"_id" : new ObjectId(id)})
      res.send(result)
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
