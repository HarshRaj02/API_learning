express = require ('express');

var app = express();

const { response } = require('express');
var bodyParser = require('express');
var mongoose = require('mongoose');

var db = mongoose.connect('mongodb://localhost/course1');

var Product = require ('./product.js');
var WishList = require ('./wishlist.js');



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false})) ;


app.post('/product',function(req,res) {

    var product = new Product();
    product.title = req.body.title;
    product.price = req.body.price;
    product.likes = 0;

    product.save(function(err,savedProduct){

        if(err)
          response.status(500).send({error:"Could not save product"});
         
        else
          response.status(200).send(savedProduct); 
    })
})

app.get('/product', function(req,res) {

  Product.find({},function (err,products){

    if(err)
      response.status(500).send({error:"Could not fetch products"});

    else
      response.send(products);  
  });
});


app.put ('/wishlist/product/add', function (req,res) {

    Product.findOne({_id:req.body.productId}, function (err, product)
     {

      if(err)
       res.status(500).send({error:"Could not add item to wishlist"});

      else
       {
         WishList.updateOne({_id:req.body.wishListId},{$addToSet: {products: product._id}}, function (err,wishlist)
          {
            if(err)
             response.send({error:"Could not add item to wishlist"});
            else
             response.send(wishlist);

          })
       } 
     }
    )

});

app.get('/wishlist', function (req,res) {

  Wishlist.find({}).populate({path:'products', model:'Product'}).exec(function(err,wishlist){

    if(err)
     res.send({error:"Could not fetch wishlist"});

    else
     res.send(wishlist); 
  })
})
app.post('/wishlist',function(req,res){

  var wishlist = new Wishlist();

  wishList.title = req.body.title;

  wishlist.save(function (err, wishlist){

    if(err)
      res.status(500).send({error:"could not create wishlist"});

    else
      res.status(200).send(wishlist);
  });




})

app.listen(3000, function() {
    console.log("Server listening at port 3000........");
})