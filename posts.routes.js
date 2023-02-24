// const express=require('express')
// const route=express.Router();

const { ObjectId } = require('mongodb')

const route = require('express').Router()
const mongo = require('../shared/mongo')

//get method
route.get('/', async (req, resp) => {
    try {
        let data = await mongo.posts.find().toArray()
        resp.json(data)
    } catch (error) {
        resp.json({ error: 'cannot get the data' })
        console.log(error)
    }
})

//to get multiple from multiple params from an api
// route.get('/:startId/:endId',async(req, resp)=>{
//     const {startId, endId}=req.params;
//     try{
//         let data = await mongo.posts.find({id:{$gte:parseInt(startId),$lte:parseInt(endId) }}).toArray()
//         resp.json(data)
//     }catch(err){
//         console.log(err)
//     }
// })

//get method for specific id 
//and in data base id: is stored as integer so we need to convert id string to integer
route.get('/:id', async (req, resp) => {
    try {
        let id = new ObjectId(req.params.id);
        let data = await mongo.posts.findOne({ _id: id });
        resp.json(data)
    } catch (error) {
        resp.json({ error: 'cannot get the data' })
        console.log(error)
    }
})

route.get('/userId/:id', async (req, resp) => {
    try {
        let id = parseInt(req.params.id)
        let data = await mongo.posts.find({ userId: id }).toArray()
        resp.json(data)
    } catch (error) {
        resp.json({ message: 'connot get data' })
    }
})

route.delete('/:id', async (req, resp) => {
    try {
        let id = new ObjectId(req.params.id)
        await mongo.posts.deleteOne({ _id: id })
        resp.json({ message: `deleted the data for id-${id}` })
    } catch (error) {
        console.log(error)
        resp.json({ error: `data with id${id} not deleted` })
    }
})

//create method/post method

route.post('/', async (req, res) => {
    try {
        console.log(req.body)
        const data = await mongo.posts.insertOne(req.body)
        res.json({ message: 'post methos was successfull', data, content: req.body })
    } catch (error) {
        console.log(error)
        res.json({ error: 'cannot create the post method' })
    }
})

//put /update method

route.put('/:id', async (req, res) => {
    try {
        let id = new ObjectId(req.params.id);
        let { value: put } = await mongo.posts.findOneAndUpdate({ _id: id }, { $set: req.body }, { returnDocument: 'after' })
        res.json(put)
    }
    catch (err) {
        console.log(err)
        res.json({ error: 'not updated sucessfully' })
    }
})

module.exports = route;

