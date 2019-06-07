const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');

const mongoose = require('mongoose');  // a mongoose ODM (object document mapping library)

const app = express();
//setting view engine as ejs 
app.set('view engine', 'ejs');
app.set('views', 'views');

//importing routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
//importing models 
const User = require('./models/user');




app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
    User.findById("5cf9908382e1701b9c1225cf")
      .then(user => {
        req.user = user; // this is a mongoose model so we can call all mongoose fucntions on that 
        next();
      })
      .catch(err => console.log(err));
  });
  
 app.use('/admin', adminRoutes);
 app.use(shopRoutes);
 app.use(errorController.get404);



//connection 
mongoose
.connect('mongodb+srv://surya:G67ip7pJVjaOuzZb@node-cluster-tjxes.mongodb.net/shop?retryWrites=true&w=majority',{useNewUrlParser: true})
.then(result=>{
  console.log('connected');
 User.findOne().then(user=>{
   if(!user){
    const user = new User({
      name : 'surya',
      email : 'suryapraharsha@gmail.com',
      cart : {
        items : []
      }
  
    });
    user.save();

   }

 });
  
  

  app.listen(3000);
})
.catch(err=>{console.log(err);});