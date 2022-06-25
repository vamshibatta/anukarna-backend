const {Sequelize, DataTypes} = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.db_username, process.env.db_database, process.env.db_password,{
    host:process.env.db_host,
    dialect: 'mysql'
});

const User = sequelize.define('User', {
    userName:{
        type: DataTypes.TEXT,
        allowNull:false
    },
    password:{
        type: DataTypes.STRING,
        allowNull:false
    },
    mobileNumber:{
        type: DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    otp:{
        type: DataTypes.STRING,
        // allowNull:false
    },
    address:{
        type: DataTypes.STRING,
        allowNull:false
    },
    isAdmin:{
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    }


}, {
    // tablelName: 'Users'
}); 

const Product = sequelize.define('Product', {
    name:{ type: DataTypes.STRING, unique:true },
    category:{ type: DataTypes.STRING },
    quantity:{ type: DataTypes.DECIMAL(10,2) },
    price:{ type: DataTypes.INTEGER }

}, {
    allowNull:false
    // tableName: 'Products'
});

const Cart = sequelize.define('Cart', {

    uID: { type: DataTypes.STRING },
    pID: { type:DataTypes.STRING },
    itemQuantity: { type:DataTypes.INTEGER }

}, {
    // allowNull:false
});

module.exports = {sequelize, User, Product, Cart};