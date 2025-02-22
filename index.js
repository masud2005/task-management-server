const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cckud.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        // await client.connect();

        const usersCollection = client.db('taskManagement').collection('users');
        const tasksCollection = client.db('taskManagement').collection('all-task');

        // Get All Users
        app.get('/users', async (req, res) => {
            const result = await usersCollection.find().toArray();
            res.send(result);
        })

        // Store user to the database
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result);
        })

        // Store task to the database
        app.post('/all-task', async (req, res) => {
            const task = req.body;
            const result = await tasksCollection.insertOne(task);
            res.send(result);
        })

        // Get All Task
        app.get('/all-task', async (req, res) => {
            const result = await tasksCollection.find().toArray();
            res.send(result);
        })

        // Specific Users All Tasks
        app.get('/all-task/:email', async (req, res) => {
            const email = req.params.email;
            const query = { userEmail: email };

            const result = await tasksCollection.find(query).toArray();
            res.send(result);
        });

        // Delete a task
        app.delete('/all-task/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await tasksCollection.deleteOne(query);
            res.send(result);
        })

        // Update Task
        app.patch('/all-task/:id', async (req, res) => {
            const { id } = req.params;
            const updatedTask = req.body;
            const result = await tasksCollection.updateOne(
                { _id: new ObjectId(id) },
                { $set: updatedTask }
            )
            res.send(result);
        })

        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Task Management Server is Running...');
})

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
})