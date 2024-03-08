// import db
const { response } = require('express');
const db = require('./db')

//import jsonweb token
const jwt = require('jsonwebtoken')


// logic for register
const register = (username, acno, password) => {
    return db.User.findOne({ acno }).then((response) => {
        console.log(response);
        if (response) {
            return {
                statusCode: 401,
                message: "Acno is already registered"
            }
        }
        else {
            const newUser = new db.User({
                username,
                acno,
                password,
                balance: 2000,
                transactions: []
            }
            )
            // to store the new user in the database
            newUser.save()
            // response send back to the client
            return {
                statusCode: 200,
                message: "Registration successful"
            }
        }
    })
}

// logic for login
const login = (acno, password) => {
    return db.User.findOne({ acno, password }).then((response) => {
        console.log(response);
        if (response) {
            //token genration
            const token = jwt.sign({
                loginAcno: acno
            }, 'superkey2023')
            return {
                statusCode: 200,
                message: "Login Successful",
                currentUser: response.username,//current user name send to frontend
                balance: response.balance,
                token,
                currentAcno: acno
            }
        }
        // if acno and password not present in db
        else {
            return {
                statusCode: 401,
                message: "Invalid Login"
            }

        }
    })
}


const getBalance = (acno) => {
    return db.User.findOne({ acno }).then((ressult) => {
        if (ressult) {
            return {
                statusCode: 200,
                balance: ressult.balance
            }
        }
        else {
            return {
                statusCode: 401,
                message: 'invalid acno'
            }
        }
    })
}

const fundTransfer = (fromAcno, frompswd, toAcno, amt) => {

    //convert amt in to number
    let amount = parseInt(amt)
    //check fromAcno and frompswd in mogodb
    return db.User.findOne({ acno: fromAcno, password: frompswd }).then((debit) => {
        if (debit) {
            //check toAcno in monogodb
            return db.User.findOne({ acno: toAcno }).then((credit) => {
                //fund transfer
                if (credit) {
                    if (debit.balance >= amount) {
                        debit.balance -= amount
                        debit.transactions.push({
                            type: 'Debit',
                            amount,
                            fromAcno,
                            toAcno
                        })
                    }
                    else {
                        return {
                            statusCode: 401,
                            message: 'Insufficient funds'
                        }
                    }
                    //save changes into database
                    debit.save()
                    credit.balance += amount
                    credit.transactions.push({
                        type: 'Credit',
                        amount,
                        fromAcno,
                        toAcno
                    })
                    //save chages into database
                    credit.save()

                    //send response back to client
                    return {
                        statusCode: 200,
                        message: 'Fund transfer successful....'
                    }
                }
                else {
                    return {
                        statusCode: 401,
                        message: 'Invalid credit details'
                    }
                }

            })
        }
        else {
            return {
                statusCode: 401,
                message: 'Invalid debit details'
            }
        }
    })

}

//transaction history
const transactionHistory = (acno) => {
    //check acno present in mongodb
  return db.User.findOne({acno}).then((result)=>{
    if(result){
        return{
            statusCode:200,
            transactions:result.transactions
        }
    }
    else{
        return{
            statusCode:401,
            message:"Invalid Data"
        }
    }
  })
}

const deleteAccount=(acno)=>{
    //account delete from database 
    return db.User.deleteOne({acno}).then((result)=>{
        return{
            statusCode:200,
            message:"Account deleted successfully"
        }
    })

}

module.exports = {
    register,
    login,
    getBalance,
    fundTransfer,
    transactionHistory,
    deleteAccount
};