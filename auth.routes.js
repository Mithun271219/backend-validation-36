const route = require('express').Router();
const bcrypt = require('bcryptjs');
const mongo = require('../shared/mongo');
const joi = require('joi');
const yup = require('yup')
let emailFormat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

let signupschemajoi = joi.object({
    name: joi.string().min(3).required(),
    email: joi.string().email().required(),
    // email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required,
    //password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,30}$')).required(),
    password: joi.string().required(),
    cpassword: joi.ref('password')
});

let signinschema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required()
    //password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,30}$')).required()
});

let valdation = async (schema, data) => {
    try {
        await schema.validateAsync(data)
        return false;
    } catch ({ details: [error] }) {
        return error.message
    }
};

//signUp
//firstname, lastname, email, password, confpassword
route.post('/signup', async (req, res) => {
    try {

        let check = await valdation(signupschemajoi, req.body)
        if (check) return res.status(400).json({ not_valid_message: check })

        //check whether user exist or not
        let user = await mongo.users.findOne({ email: req.body.email });
        if (user) return res.status(400).json({ message: 'user already exist' });

        //encrypting password
        // const salt = await bcrypt.genSalt()
        // bcrypt is an external library used to encrypt and decrypt the password inside the bd
        // req.body.password = await bcrypt.hash(req.body.password, salt)
        req.body.password = await bcrypt.hash(req.body.password, await bcrypt.genSalt());

        //deleting confirm password

        delete req.body.cpassword

        user = await mongo.users.insertOne(req.body);
        res.json({ message: "user signup success" })

    } catch (error) {
        res.json({ error: 'error while creating user' })
        console.log(error)
    }
})

//singIn

route.post('/signin', async (req, res) => {
    try {
        let message = await valdation(signinschema, req.body)
        if (message) return res.status(400).json({ not_valid_message: message });

        //to check user exist or not 
        let user = await mongo.users.findOne({ email: req.body.email })
        if (!user) return res.status(404).json({ mesaage: 'email or pass incorrect' });

        //to verify password
        // ther is method in bcrypt called caompare which will return the boolean value by
        //comapaing the hashed passs in db and the pass entered by user 
        let isValid = await bcrypt.compare(req.body.password, user.password)
        isValid ? res.json({ message: "login sucsess" }) : res.status(404).json({ mesaage: 'email or pass incorrect' });
    } catch (error) {
        res.status(500).json({ erroe: 'error while signing in' })
        console.log(error)
    }
})

module.exports = route;


        // //data validation
        // let message;
        // if (!req.body.name) message = 'name is required';
        // else if (req.body.name.length < 3) message = 'name must be min char of 3';
        // else if (!req.body.email) message = 'email is required';
        // else if (!emailFormat.test(req.body.email)) message = 'email id is not valid';
        // else if (req.body.password !== req.body.cpassword) message = 'password should match';

        // // to validate phone number use methid isNan(Number(req.body.phone)) this will check wether the IP type
        // //is number or cahr

        // // else if (!req.body.phone) message= "phone number is mandatory"
        // //  else if (isNaN(Number(req.body.phone))) message= "phone number should be type of numner"
        // //  else if (!req.body.phone.length == 10) message= "phone number should be type of numner"

        // if (message) return res.status(400).json({ message })
        // // we can also give the password length and its cahr types


        //sing in validattion
        //data validation
    // let message;
    // if (!req.body.email) message = 'email is required';
    // else if (!emailFormat.test(req.body.email)) message = "email is not valid";
    // else if (!req.body.password) message = 'password is required';

    // if (message) return res.status(400).json({ message })