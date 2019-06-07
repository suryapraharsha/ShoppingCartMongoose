const Product = require('../models/product');



exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};
// for posting new values to data base from add product 
exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  
  const product = new Product({title : title,
     price : price ,
      description : description,
      imageUrl : imageUrl ,
      userId : req.user}); // you are just passing a user object mongoose will automatically pick the id from it 
  product                   // since we are passing the type of the userID as objectid in the product model 
  .save()

    .then(result => {
       //console.log('added product is ',result);
      
      res.redirect('/admin/products');
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product
  .findById(prodId)
  .then(product => {
    
    
    console.log('edited product is ',product);
    if (!product) {
      return res.redirect('/');
    }
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product
    });
  })
  .catch(err => console.log(err));
};


exports.getProducts = (req, res, next) => {
  
  Product
  .find()
  // .select('title price -_id') //for getting onley particular fields
  // .populate('userId','name')// first argument is getting fully populated field second argument is for dispalying particualr fields
  
    .then(products => {
      console.log('products are ',products);

      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    })
    .catch(err => console.log(err));
};
exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
 
  Product.findById(prodId).then(product=>{
    product.title = updatedTitle;
    product.price = updatedPrice;
    product.imageUrl = updatedImageUrl;
    product.description = updatedDesc;

    return product.save()
  })
    .then(result => {
      console.log('UPDATED PRODUCT!');
      //console.log(result);
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByIdAndRemove(prodId)
    
    .then(result => {

      console.log('DESTROYED PRODUCT');
     
      

      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};
