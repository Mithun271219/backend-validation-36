require('fs');
let express = require('express');
let app = express();
let axios = require('axios');
let port = 3001;

//postroute is imported
const postroute = require('./routes/posts.routes.js')
const userroute = require('./routes/users.route');
const authroute = require('./routes/auth.routes');

//mongo is imported and connected
const mongo = require('./shared/mongo');

(async () => {
    try {
        await mongo.connect();

        app.use(express.json())

        app.use((req, resp, next) => {
            console.log(new Date().toLocaleString(), req.url, req.method)
            next()
        })

        app.use('/auth', authroute)
        app.use('/posts', postroute)
        app.use('/users', userroute)

        app.listen(port, console.log(`server running at- ${port} port`))
    } catch (error) {
        console.log(error.message)
        process.exit();
    }
})()
