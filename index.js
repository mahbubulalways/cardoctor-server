const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken');
require('dotenv').config()
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
app.use(cors())
app.use(express.json())
const port = process.env.PORT || 8000


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jgce6rp.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {

  const verifyJWt = (req, res, next) => {
    const authorization = req.headers.authorization
    console.log(authorization);
    if (!authorization) {
      return res.status(401).send({ error: true, message: 'Unauthorized access' })
    }
    const token = authorization.split(' ')[1]
    // verify a token symmetric
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET , (err, decoded)=>{
      if(err){
        return res.status(403).send({ error: true, message: 'Unauthorized access' })
      }
      req.decoded =decoded
      next()
    });

  }



  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const servicesCollection = client.db("carHub").collection("services")
    const customerBooking = client.db("carHub").collection("bookings")

    app.post('/booking', async (req, res) => {
      const book = req.body
      const result = await customerBooking.insertOne(book);
      res.send(result)
    })


    app.get('/bookings', verifyJWt, async (req, res) => {
      const decoded =req.decoded
      console.log(decoded);
      if(decoded.email !== req.query.email){
        return res.status(403).send({email:true,message:'forbidden access'})
      }
      let query = {}
      if (req.query?.email) {
        query = { email: req.query?.email }
      }
      const result = await customerBooking.find(query).toArray()
      res.send(result)
    })


    app.delete('/booking/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) };
      const result = await customerBooking.deleteOne(query);
      res.send(result)

    })

    //TOKEN

    app.post('/token', (req, res) => {
      const user = req.body
      console.log(user);
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 5 });
      // console.log(token);
      res.send({ token })
    })


    //service

    app.get('/services', async (req, res) => {
      const cursor = servicesCollection.find()
      const result = await cursor.toArray();
      res.send(result)
    })

    app.get('/services/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      // const options = {

      //     projection: {  title: 1, price: 1 },
      //   };

      const result = await servicesCollection.findOne(query);
      res.send(result)
    })




    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();

  
  }
}
run().catch(console.dir);










const data = require('./data/data.json')
app.get('/', (req, res) => {
  res.send(data)
})


app.listen(port, () => {
  console.log('data reading port', port);
})