//  Mongodb connection with nodejs
 

// 1 Connection library - mongoose - npm i mongoose

// import Mongoose
const mongoose=require('mongoose')

//2 define connection string between mongoose and node
mongoose.connect('mongodb://localhost:27017/BankApp')

// 3 create a model and schema for storing data
// model = collection(s is exclude)
// schema = data inside collection
const User=mongoose.model('User',{//user is model
    username: String,
    acno:Number,
    password:String,
    balance:Number,
    transactions:[]//these are schemas

}) 
module.exports={
    User
}
