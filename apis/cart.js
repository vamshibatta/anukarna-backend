const { Router } = require("express");
const { Product, Cart } = require("../db.js");
const { verifyToken } = require("./verifyToken.js");

let router = Router();

router.post('/add', verifyToken, async (req, res) => {
    try {

        const product = await Product.findOne({ where: { name: req.body.name } });
        if (!product) { throw new Error("No such Product exists to add to your cart!") };

        await Cart.create({
            uID: req.user.id,
            pID: product.id,
            itemQuantity: req.body.quantity
        });

        res.status(200).send(product.name);

    } catch (e) {
        console.log(e);
        res.status(400).send(e.message);
    }
});

router.post('/update', verifyToken, async (req, res) => {
    try {
        const u = req.user.id;
        const product = await Product.findOne({ where: { name: req.body.name } });
        const p = product.id;
        const q = req.body.itemQuantity;

        const item = await Cart.findOne({ where: { uID: u, pID: p } });

        if (item) {
            await Cart.update({ itemQuantity: q }, { where: { uID: u, pID: p } });
            res.status(200).send("cart updated");
        } else {
            throw new Error("Item does not exist in your cart");
        }

    } catch (e) {
        res.status(400).send(e.message);
    }
});

router.post('/fetch', verifyToken, async (req, res) => {
    try {
        const itemList = [];
        const totalData = [];
        const cartItems = await Cart.findAll({ where: { uID: req.user.id } });
        if (cartItems.length === 0) {
            res.status(200).send("noItems");
        }
        else {
            for (let i = 0; i < cartItems.length; i++) {
                const p = await Product.findOne({ where: { id: cartItems[i].dataValues.pID } });
                let cartObj = {
                    'name': p.name,
                    'price': p.price,
                    'quantity': cartItems[i].dataValues.itemQuantity,
                    'baseQuantity': p.quantity
                }
                itemList.push(cartObj);
            };
            totalData.push(itemList);
            totalData.push(cartItems);
            res.status(200).send(JSON.stringify(totalData));
        }

    } catch (e) {
        console.log(e);
        res.status(400).send(e.message);
    }
});

router.delete('/remove', verifyToken, async (req, res) => {
    try {
        const product = await Product.findOne({ where: { name: req.body.name } });
        const u = req.user.id;
        const p = product.id;

        const item = await Cart.findOne({ where: { uID: u, pID: p } });

        if (item) {
            await Cart.destroy({ where: { uID: u, pID: p } });
            res.status(200).send(product.name);
        } else {
            throw new Error("Item does not exist in your cart");
        }
    } catch (e) {
        res.status(400).send(e.message);
    }
});

module.exports = router;