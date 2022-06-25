const express = require("express");
const app = express();
const {sequelize} = require("./db.js");
const bodyParser = require('body-parser');
require('dotenv').config();
const cors = require("cors");



app.use(
    cors({
        origin:"http://localhost:3000",
    })
);
app.use( bodyParser.json() );
app.use('/api',require('./apis/routes.js'));

const init = async() =>{
    try{
        await sequelize.authenticate();
        await sequelize.sync();
        // await sequelize.sync({force:true});
        console.log("successfully conected to database!");
    }catch(e){
        console.log(e);
    }

    app.listen(process.env.port, ()=>{
        console.log("server initiated");
    });
};

init();