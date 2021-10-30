const express = require('express');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;


const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.r53mt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {
        await client.connect();
        const database = client.db("assignmet11");
        const databaseCollection = database.collection("data");
        const bookingCollection = database.collection("booking")
        console.log("Database connected");

        //GET API
        app.get('/', (req, res) => {
            res.send("Hello from Assignment 11");

        })
        app.get('/services', async (req, res) => {
            const cursor = databaseCollection.find({});
            const users = await cursor.toArray();
            res.send(users);
        })
        app.get('/booking', async (req, res) => {
            const cursor = bookingCollection.find({});
            const users = await cursor.toArray();
            res.send(users);
        })


        //GET SPECIFIC DATA USING ID
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const user = await databaseCollection.findOne(query);
            res.send(user);
        })

        //DELTE A SERVICE
        app.delete('/booking/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await bookingCollection.deleteOne(query);
            res.send(result);


        })

        //POST API FOR INSERT OR SENDING THE DATA
        app.post('/services', async (req, res) => {
            const newUser = req.body;
            const result = await databaseCollection.insertOne(newUser);
            res.json(result);
        })

        //POST API FOR SPECIFIC BOOKING
        app.post('/booking', async (req, res) => {
            const newUser = req.body;
            const result = await bookingCollection.insertOne(newUser);
            res.json(result);
        })

        //UPDATE USER
        app.put('/booking/:id', async (req, res) => {
            const id = req.params.id;
            const updateBookingStatus = req.body;
            console.log(updateBookingStatus);
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: updateBookingStatus.status,

                }
            }
            const result = await bookingCollection.updateOne(filter, updateDoc, options);
            res.send(result);

        })


    } finally {
        // await client.close();
    }
}
run().catch(console.dir);




app.listen(port, () => {
    console.log("Listening to port", port)
})