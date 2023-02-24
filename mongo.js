//mongo
const { MongoClient, ObjectId } = require('mongodb')
// const Mongo_url="mongodb://localhost:27017/";
const Mongo_url = "mongodb://0.0.0.0:27017";
const mongo_name = "guvi";
//its a class
//var db;

const mongo = {
    db: null,

    posts: null,
    users: null,

    async connect() {
        try {
            //to connect to mongo
            let client = new MongoClient(Mongo_url)
            await client.connect();
            console.log('mongoDB connected sucessfully')

            //to select the database
            this.db = await client.db(mongo_name)
            console.log(`selected- ${mongo_name}`)

            this.posts = await this.db.collection('post')
            this.users = await this.db.collection('user')

        } catch (error) {
            throw new Error(error)
        }
    }
}

module.exports = mongo