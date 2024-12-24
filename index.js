require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000;



app.use(express.json())
app.use(cors())



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.NAME}:${process.env.PASS}@coffee.2vgrj.mongodb.net/?retryWrites=true&w=majority&appName=coffee`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection



    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    const homeData = client.db('home').collection('homeData')
    const bookdData = client.db('book').collection('bookData')
    const buyData = client.db('buy').collection('buyData')


    app.post('/addData',async(req,res)=>{
        const data = req.body
        const result = await homeData.insertOne(data)
        res.send(result)
        console.log(result);
        
    })

    app.post('/book', async(req,res)=>{
        const data = req.body
        delete data._id;
        const result = await bookdData.insertOne(data)
        res.send(result)
    })

    app.post('/buy', async(req,res)=>{
        let data = req.body
        let result = await buyData.insertOne(data)
        res.send(result)
    })

    app.put('/updateHome/:id',async(req,res)=>{
        const id = req.params.id
        const data = req.body
        const filter = { _id: new ObjectId(id) }
        const options = { upsert: true }
        const updateDoc = {
            $set:{
                serviceProvider: {
                    provideremail: data.serviceProvider.provideremail,
                    providerimage: data.serviceProvider.providerimage,
                    providername: data.serviceProvider.providername
                },
                 serviceName : data.serviceName,
                 serviceDescription : data.serviceDescription,
                 serviceImage : data.serviceImage,
                 servicePrice : data.servicePrice,
                 location : data.location,
                 userEmail : data.userEmail,
            }
        }

        const result = await homeData.updateOne(filter,updateDoc,options)

        res.send(result)

    })

    app.delete('/delete/:id',async(req,res)=>{
        let id = req.params.id
        const query = { _id: new ObjectId(id)}
        const result = await homeData.deleteOne(query)
        res.send(result)
    })

    app.get('/updateHome/:id',async(req,res)=>{
        let id = req.params.id
        const query = { _id: new ObjectId(id)}
        const result = await homeData.findOne(query)
        res.send(result)

    })

    

    app.get('/buyData',async(req,res)=>{
        const data = buyData.find()

        delete data._id;

        const result = await data.toArray()
        res.send(result)

    })

    app.get('/bookData', async(req,res)=>{

        const data = bookdData.find()
        const result = await data.toArray()
        res.send(result)

    })

    app.get('/alldata',async(req,res)=>{
        const data = homeData.find()
        const result = await data.toArray()
        res.send(result)

    })



  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('hello')
})
app.listen(port,()=>{
    console.log(port);
    
})