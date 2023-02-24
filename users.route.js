let route = require('express').Router();
let mongo = require('../shared/mongo');

route.get('/', async (req, resp) => {
    try {
        let data = await mongo.users.find().toArray()
        resp.json(data)
    } catch (err) {
        console.log(err)
        resp.json({ error: 'connot get data' })
    }
})

route.get('/:id', async (req, res) => {
    try {
        let id = parseInt(req.params.id);
        let data = await mongo.users.findOne({ id: id })
        res.json(data)
    }
    catch (err) {
        res.json({ error: 'cannot get the data ' })
        console.log(err)
    }
})

route.delete('/:id', async (req, resp) => {
    let id = new ObjectId(req.params.id);
    try {
        await mongo.users.deleteOne({ _id: id })
        resp.json({ message: `deleted data with id-${id}` })
    } catch (err) {
        resp.json({ error: 'connot get data' })
        console.log(err)
    }
})

module.exports = route