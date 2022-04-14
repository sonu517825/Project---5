const pincodeValidator = require('pincode-validator');
const mongoose= require("mongoose")




const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}




const isValidRequestValue = function (isValidRequestValue) {
    if (typeof isValidRequestValue === 'undefined' || isValidRequestValue === 'null' || isValidRequestValue === 'undefined') return false
    if (typeof isValidRequestValue === 'string' && isValidRequestValue.trim().length === 0) return false
    return true
}




const isStrictString = function (value) {
    if (typeof value !== 'string') return false
    let flag = 0
    value = value.trim()
    for (let i = 0; i < value.length; i++)
        if ((value.charCodeAt(i) >= 97 && value.charCodeAt(i) <= 122) || (value.charCodeAt(i) >= 65 && value.charCodeAt(i) <= 90) || (value.charCodeAt(i)==32) ) flag++
    if (flag !== value.length) return false
    return true
}



const isValidEmail = function (email) {
    email = email.trim()
    let regexForEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    return regexForEmail.test(email)
};



const isValidPhone = function (phone) {
    phone = phone.trim()
    let regexForphone = /^(?:(?:\+|0{0,2})91(\s*|[\-])?|[0]?)?([6789]\d{2}([ -]?)\d{3}([ -]?)\d{4})$/
    return regexForphone.test(phone)
};




const isValidPassword = function (password) {
    password = password.trim()
    if (password.length > 7 && password.length < 16) return true
    return false
}



const isValidAddress = async function (address) {
    try {
        return await JSON.parse(address)
    }
    catch (err) {
        console.log(err)
        if (err) return false
    }
}



const isValidPincode = function (pincode) {
    try{


    if (typeof pincode !== 'number') return false
    pincode = `${pincode}`


    if (pincode.length !== 6) return false
    if (pincode[0] === 0) return false


    let flag = 0
    pincode = pincode.trim()
    for (let i = 1; i < pincode.length; i++)
        if ((pincode.charCodeAt(i) >= 48 && pincode.charCodeAt(i) <= 57)) flag++


    if (flag !== pincode.length-1) return false
    return true
    }
    catch(err){
        console.log(err)
    }
}




const isObjectId = function (ObjectId) {
return  mongoose.isValidObjectId(ObjectId)
}




module.exports = {
    isStrictString,
    isValidRequestBody,
    isValidRequestValue,
    isValidEmail,
    isValidPhone,
    isValidPassword,
    isValidAddress,
    isValidPincode,
    isObjectId
}



