require("dotenv").config();
require("./config/database").connect();
const express = require("express");

const app = express();
let bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const auth = require("./middleware/auth");
let mongodb = require('mongodb');

app.use(express.json());


module.exports = app;

// importing user context
const User = require("./model/user");
const Service = require("./model/service");

app.post("/additem", auth, async(req, res) => {
    const { id ,descritpion, work_cost, material_cost} = req.body;

    try{
    // Validate user inputx`
    if (!(id && descritpion && work_cost && material_cost)) {
        res.status(400).send("All input is required");
    }
    
    const oldService = await Service.findOne({ id });

    if (oldService) {
        return res.status(409).send("Serice Already Exist. Change id");
    }
     // Create user in our database
    const service = await Service.create({
        id,
        descritpion,
        work_cost, 
        material_cost,
    });
    if(service){
        res.status(200).json(service);
    }
    else{
        res.status(500).send("internal server error")
    }
    } catch (err) {
        console.log(err);
        res.status(500).send("internal server error")
    }

});

app.delete("/deleteitem", auth, async(req, res) => {
    const { id } = req.body;
    const delelte_item = await Service.findOne({ id });
    const service_item = Service.deleteOne({_id: new mongodb.ObjectID(delelte_item._id)}, function(err, results) {
        if (err){
          console.log("failed");
          res.status(500)
          throw err;
        }
        console.log("success");
        res.status(200)
     });
    
});

app.post("/updateitem", auth,async(req, res) => {
    const { id ,descritpion, work_cost, material_cost} = req.body;

    const updateDoc = {
        $set: {
            descritpion,
            work_cost, 
            material_cost
        }
    };
     
     const item = await Service.updateOne({id},updateDoc, function(err, results) {
        if (err){
          console.log("failed");
          res.status(500).send("Internal server error");
          throw err;
        }
        console.log("success");
        res.status(200).send("Success updated");
    });

});

app.get("/getallitems", async(req, res) => {
   // const {} = req.body;
    const all = await Service.find({});

    res.status(200).json(all);

    
});

app.post("/register", async(req, res) => {

    // Our register logic starts here
    try {
        // Get user input
        const { first_name, last_name, email, password } = req.body;

        // Validate user inputx`
        if (!(email && password && first_name && last_name)) {
            res.status(400).send("All input is required");
        }

        // check if user already exist
        // Validate if user exist in our database
        const oldUser = await User.findOne({ email });

        if (oldUser) {
            return res.status(409).send("User Already Exist. Please Login");
        }

        //Encrypt user password
        encryptedPassword = await bcrypt.hash(password, 10);

        // Create user in our database
        const user = await User.create({
            first_name,
            last_name,
            email: email.toLowerCase(), // sanitize: convert email to lowercase
            password: encryptedPassword,
        });

        // Create token
        const token = jwt.sign({ user_id: user._id, email },
            process.env.TOKEN_KEY, {
                expiresIn: "2h",
            }
        );
        // save user token
        user.token = token;

        // return new user
        res.status(201).json(user);
    } catch (err) {
        console.log(err);
    }
    // Our register logic ends here
});

app.post("/login", async(req, res) => {

    // Our login logic starts here
    try {
        // Get user input
        const { email, password } = req.body;

        // Validate user input
        if (!(email && password)) {
            res.status(400).send("All input is required");
        }
        // Validate if user exist in our database
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            // Create token
            const token = jwt.sign({ user_id: user._id, email },
                process.env.TOKEN_KEY, {
                    expiresIn: "2h",
                }
            );

            // save user token
            user.token = token;

            // user
            res.status(200).json(user);
        }
        // res.status(400).send("Invalid Credentials");
    } catch (err) {
        console.log(err);
    }
    // Our register logic ends here
});


app.post("/welcome", auth, (req, res) => {
    res.status(200).send("Welcome 🙌 ");
});

