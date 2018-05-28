var mongoose = require("mongoose");
var User = mongoose.model('User');
var Listing = mongoose.model('Listing');
var House = mongoose.model('House');
var Coupon = mongoose.model('Coupon');
var Request = mongoose.model('Request');

const {check, validationResult} = require('express-validator/check');

function createUser(req, res, next) {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
         return res.status(422).json({ errors: errors.mapped() });
    } else {
        const user = new User(req.body);
        user.password = user.hashPassword(user.password);
        user.save((err) => {
            if (err) {
            console.log('Error saving user: ', user);
            return next();    
            }
            res.json({ok: true});
        })
    }
   }



   var validateRegister = () => {
    return (
            check('firstName', 'Please enter your full name.').not().isEmpty(),
            check('email', 'Your email is not valid').isEmail(),
            check('lastName', 'Your Last name is already exist, try another one.').not().isEmpty(),
            check('password', 'Your password should be between 6 and 16 chars.')
                  .isLength({ min: 6, max: 16 }),
            check('confirmPassword', 'Your password and confirm are not matched.')
                  .custom( (value, {req}) => value === req.body.password)
    );
};

function createCoupon(req, res, next) {
    
        const coupon = new Coupon(req.body);
        coupon.save((err) => {
            if (err) {
            console.log('Error saving coupon: ', coupon);
            return next();    
            }
            res.json({ok: true});
        })
    
   }



function createHouse(req, res, next) {
  if(req.session.user)
   {
   const house = new House(req.body);
   house.user_id= req.session.user._id;
   house.save((err) => {
       if (err) {
       console.log('Error saving house: ', house);
       return next();    
       }
       res.json({ok: true});
   })
}
}


function loginCoupon( req, res, next){
   
    Coupon.findOne({coupon_student: req.body.coupon_student}, (err, coupon_student) => {
       // console.log(coupon_student);
        if (err) {
            console.log('Error getting user: ', err);
            return next();
        }
        if(!coupon_student) {
            return res.status(404).json({err : true, message : "Coupon does not exist"})
        };

        req.session.coupon_student= coupon_student;
        res.json(coupon_student);
    })
}

function deleteCoupon(req, res) {
    Coupon.findOneAndRemove({_id:req.params.id})
    .then((res)=>{res.send( res)})
    .catch((err)=>{res.send(err)})
};
 
function loginUser( req, res, next){
   
    User.findOne({email : req.body.email}, (err, user) => {
        if (err) {
            console.log('Error getting user: ', err);
            return next();
        }
        if(!user) {
            return res.status(404).json({err : true, message : "User dose not exist"})
        };
        if(!user.comparePassword(req.body.password, user.password)) {
            return res.status(404).json({err: true, message:"Passwords do not match"});
        }
        req.session.user= user;
        res.json(user)
    })
}

function getAllHouses(req, res, next) {
    House.find({}, ['houseName','coins', 'level'], (err, houses) => {
        if (err) {
            console.log('Error getting houses: ', err);
            return next();    
            }
            console.log(houses);
            res.json(houses);
    })
}

function updatingHouse(req, res) {
    House.findById(req.params.id)
        .then(function(house) {
            house.houseName = req.body.houseName;
            house.coins= req.body.coins;
            house.level = req.body.level;
            house.save().then(function(house) {
             res.send(house);
        });
    })
        .catch(err => res.send(err));
};

function deleteHouse(req, res) {
    House.findOneAndRemove({_id:req.params.id})
    .then((res)=>{res.send( res)})
    .catch((err)=>{res.send(err)})
};

function createListing(req, res, next) {
        //console.log(req.body.listing);
    //    console.log('sess '+ req.session.user);
      if(req.session.user)
       {
       const listing = new Listing(req.body);
       listing.user_id= req.session.user._id;
       listing.save((err) => {
           if (err) {
           console.log('Error saving user: ', listing);
           return next();    
           }
           res.json({ok: true});
       })
    }
}


function getAllListings(req, res, next) {
    const listing = new Listing(req.body);
    Listing.find({})
       .populate('user_id')
       .then((listing)=>{res.send({
           list: listing,
           isUser: req.session.user
       })})
       .catch((err)=>{res.send(err)})
}


function showOneListing(req, res) {
    Listing.findById({_id:req.params.id})
    .populate('user',['firstname','email'])
    .then((listing)=>{res.json(listing)})
    .catch((error)=>{res.json(error)})
}


function deleteListing(req, res) {
    Listing.findOneAndRemove({_id:req.params.id})
    .then((res)=>{res.send( res)})
    .catch((err)=>{res.send(err)})
};


function updatingListing(req, res) {
    Listing.findById(req.params.id)
        .then(function(listing) {
            listing.name = req.body.name;
            listing.price = req.body.price;
            listing.description = req.body.description;
            listing.picture = req.body.picture;
            listing.save().then(function(listing) {
             res.send(listing);
        });
    })
        .catch(err => res.send(err));
};

function userRequest(req, res, next) {
    const request = new Request(req.body);
    request.save((err) => {
        if (err) {
        console.log('Error saving request: ', request);
        return next();    
        }
        res.json({ok: true});
    })
  }
  function getAlluserRequest(req, res, next) {
    Request.find({}, ['userName','userHouse','userLevel'], (err, requests) => {
        if (err) {
            console.log('Error getting userRequest: ', err);
            return next();    
            }
            console.log(requests);
            res.json(requests);
    })
}
function deleteRequest(req, res) {
    Request.findOneAndRemove({_id:req.params.id})
    .then((res)=>{res.send( res)})
    .catch((err)=>{res.send(err)})
};




function getAuthenticateUserName(req,res, next) {
    res.json({name:req.session.user.firstname});
 }
function getAuthenticateUserID(req,res, next) {
    res.json({name:req.session.user._id});
}

 function authenticateUser(req,res, next) {
    if(req.session.user) return next();
    res.json({err:true, message:"Not Authenticated"});
 }

 function logout(req,res , next) {
    req.session.destroy((err) => {
        if(err) {
            console.log('Error logging out: ', err);
            return next();
        }
        res.json({ok : true})
     })
 };
 

module.exports= {
    getAllHouses,
    createUser,
    createHouse,
    updatingHouse,
    loginUser,
    createListing,
    getAllListings,
    showOneListing,
    logout,
    authenticateUser,
    deleteHouse,
     // getAllUsers,
     createCoupon,
     userRequest,
     getAlluserRequest,
     deleteRequest,
    getAuthenticateUserName,
    loginCoupon,
    deleteCoupon,
    
    updatingListing,
    // likeListing,
    deleteListing,
    validateRegister
 };