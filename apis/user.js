const { Router } = require("express");
const { User, Cart } = require("../db.js");
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
require('dotenv').config();
const { verifyToken } = require("./verifyToken");

let router = Router();

router.post("/signup", async (req, res) => {
    try {

        let validator = /^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$/;
        if (!validator.test(req.body.mobileNumber)) {
            throw new Error("Please give a valid Mobile Number")
        };
        if(req.body.password!==req.body.confirmPassword){
            throw new Error("Password doesn't match with each other!")
        }

        const hash = bcrypt.hashSync(req.body.password, 10);

        const u = await User.findOne({ where: { isAdmin: "1" } });

        if (u) {
            await User.create({
                userName: req.body.userName,
                mobileNumber: req.body.mobileNumber,
                password: hash,
                address: req.body.address
            });
        }
        else {
            await User.create({
                userName: req.body.userName,
                mobileNumber: req.body.mobileNumber,
                password: hash,
                address: req.body.address,
                isAdmin: req.body.isAdmin
            });
        }

        const user = await User.findOne({ where: { mobileNumber: req.body.mobileNumber } });

        res.status(200).send(`Account with username: \'${user.userName}\' is made.`);
    }
    catch (e) {
        try {
            if (e.parent.code === "ER_DUP_ENTRY") {
                res.status(400).send("User with this mobie number already exist.");
            }
        } catch {
            res.status(400).send(e.message);
        }
    }
});

router.post('/login', async (req, res) => {
    try {

        const user = await User.findOne({ where: { mobileNumber: req.body.mobileNumber } });
        if (!user) throw new Error("Account with this number is not registered.Please sign-up first.")

        if (bcrypt.compareSync(req.body.password, user.password)) {
            if (user.isAdmin) {
                const token = jwt.sign({ id: user.id, isAdmin: user.isAdmin, mobileNumber: user.mobileNumber }, process.env.db_secret);
                res.status(200).send(token);
            } else {
                const token = jwt.sign({ id: user.id, mobileNumber: user.mobileNumber }, process.env.db_secret);
                const loginData = [];
                loginData.push(token, user.userName);
                res.status(200).send(loginData);
            }
        } else {
            throw new Error("Please type the correct password!");
        }

    }
    catch (e) {
        res.status(400).send(e.message);
    }
});

router.post('/update', verifyToken, async (req, res) => {
    try {
        const user = await User.findOne({ where: { mobileNumber: req.body.mobileNumber } });

        if (req.body.address) {
            await User.update({ address: req.body.address }, {
                where: {
                    id: user.id
                }
            });
        }
        else {
            console.log("no address input to update");
        }
        if (req.body.firstName) {
            await User.update({ firstName: req.body.firstName }, {
                where: {
                    id: user.id
                }
            });
        }
        else {
            console.log("no First Name input to update");
        }
        if (req.body.lastName) {
            await User.update({ lastName: req.body.lastName }, {
                where: {
                    id: user.id
                }
            });
        }
        else {
            console.log("no Last Name input to update");
        }

        const newUser = await User.findOne({
            where: { id: user.id }
        });
        res.status(200).send(newUser.toJSON());
    }
    catch (e) {
        res.status(400).send(e.message);
    }
});

router.delete('/delete', verifyToken, async (req, res) => {
    try {
        const user = await User.findOne({
            where: { mobileNumber: req.body.mobileNumber }
        });
        if (!user) throw new Error("Incorrect Mobile Number");

        const un = user.firstName + user.lastName;

        if (bcrypt.compare(req.body.password, user.password)) {
            await User.destroy({
                where: { mobileNumber: user.mobileNumber }
            });
            await Cart.destroy({ where:{ uID:user.id } });
        } else {
            throw new Error("Incorrect Password!");
        }
        res.status(200).send(`Account with userName: ${un} deleted!`);
    }
    catch (e) {
        res.status(400).send(e.message)
    }
});

module.exports = router;