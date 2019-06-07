const Product = require('../models/product');

const Order = require('../models/order');//dont need 



exports.getIndex = (req, res, next) => {
  Product
  .find()
  .then((products)=>{
    
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });

  })
  .catch(err=>{
    console.log(err);

  });

  
};
// will be shown all products added by all users 
exports.getProducts = (req, res, next) => {
  Product.find()
  .then((products)=>{
    console.log(products);
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All products',
      path: '/products'
    });
  }).catch(err=>{
    console.log(err);

  });
    
};


//accesiing a single product 
exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  
  Product
  .findById(prodId)
  .then(product=>{
    //console.log('single product is ', product)
    res.render('shop/product-detail', {
          product: product,
          pageTitle: product.title,
          path: '/products'
        });
  })
  .catch(err=>{
    console.log(err);
  });

    

 };


exports.getCart = (req, res, next) => {

  req.user
  .populate('cart.items.productId').execPopulate()
  .then(user=>{
    console.log(user.cart.items);
    const products = user.cart.items;

      res.render('shop/cart', {
              path: '/cart',
              pageTitle: 'Your Cart',
              products: products
          })
  })
  .catch(err=>{
    console.log(err);
  });
  

  };
//  //postCart will a particular product (prodId) to the cart , it will check if a product is exis ted first or else it will add new product 
  
// add to cart will go to this route
exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    console.log('product id got is ',prodId);
    Product.findById(prodId).then(product=>{
      console.log('add to cart product is ',product);

      return req.user.addToCart(product);

    }).then(result=>{
      console.log(result);
      res.redirect('/cart');
    });
    
  };

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user //always request a user first
  .deleteItemFromCart(prodId)
  .then((result)=>{
    res.redirect('/cart');
  })

  .catch(err =>{
    console.log(err);
  });

 
};
exports.postOrder =(req,res,next)=>{

  req.user
  .populate('cart.items.productId').execPopulate()
  .then(user=>{
    console.log(user.cart.items);

    const products = user.cart.items.map(i=>{
      return {quantity : i.quantity , product : {...i.productId._doc}}
    });

    const order = new Order({
      products : products,
      user : {
        name : req.user.name,
        userId : req.user
      }

    });

    return order.save();


  })
  .then(result=>{
    return req.user.clearCart();
  
  }).then(result=>{

    res.redirect('/orders');
  }
  ).catch(err=>{
    console.log(err);
  });



}
exports.getOrders = (req, res, next) => {
  Order.find({"user.userId": req.user._id})
  .then(orders=>{
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'orders',
      orders : orders
    });
  });
  
};

