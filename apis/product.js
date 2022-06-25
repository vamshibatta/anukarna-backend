const {Router} = require("express");
const {Product, Cart}  = require("../db.js");
const {isAdmin} = require("./verifyToken");

let router = Router();

router.post('/create', isAdmin, async(req, res) => {
    try{
        console.log("creating new entry for a desired product");

        const product = await Product.findOne({
            where:{ name:req.body.name }
        });

        if(product){
            throw new Error('Product already exists')
        }
        let newp = await Product.create({
            name:req.body.name,
            quantity:req.body.quantity,
            price:req.body.price,
            category:req.body.category,
        });

        res.status(200).send(newp.toJSON());
    }
    catch(e){
        console.log(e);
        res.status(400).send(e.message);
    }
});

router.post('/update', isAdmin, async(req, res) => {
    try{
        const product = await Product.findOne({
            where:{ name:req.body.name }
        });
        if(!product){
            throw new Error("Product with this name does not exist!");
        };

        if (req.body.name) {
            await Product.update({ name: req.body.name }, {
                where: { id: product.id }
            });
        }
        else{
            console.log("no \"quantity\" input to update");
        }
        if (req.body.quantity) {
            await Product.update({ quantity: req.body.quantity }, {
                where: { id: product.id }
            });
        }
        else{
            console.log("no \"quantity\" input to update");
        }
        if (req.body.price) {
            await Product.update({ price: req.body.price }, {
                where: { id: product.id }
            });
        }
        else{
            console.log("no \"price\" input to update");
        }

        const updatedProduct = await Product.findOne({ where:{id:product.id} });
        res.status(200).send(updatedProduct.toJSON());

    }
    catch(e){
        res.status(400).send(e.message);
    }
});

router.delete('/delete', isAdmin, async(req, res) => {
    try{
        const product = await Product.findOne({
            where:{ name:req.body.name }
        });
        if(!product){ throw new Error(`No such Product with name: ${req.body.name} exists!!`) }

        if(req.body.name){
            await Product.destroy({ where:{ id: product.id } });
            await Cart.destroy({ where:{ pID: product.id } });
        };
        res.status(200).send(`Product named ${product.name} has been deleted!`);
    }
    catch(e){
        res.status(400).send(e.message);
    }
});

module.exports = router;