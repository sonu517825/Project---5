const userModel = require("../models/userModel")
const validator = require("../validator/validator")
const awsConnection = require("../configs/awsConnection")
const setEncription = require("../configs/encryption")




const registerUser = async function (req, res) {
    try {



        const shippingSuggestData = { shipping: { street: 'MG Road', city: 'indore', pincode: 452001 } }
        const billingSuggestData = { billing: { street: 'MG Road', city: 'indore', pincode: 452001 } }



        if (validator.isValidRequestBody(req.query)) return res.status(400).send({ status: false, msg: "can not pass request query. query is blocked" })
        const requestBody = req.body
        if (!validator.isValidRequestBody(requestBody)) return res.status(400).send({ status: false, msg: "please provide user details in form data of request body" })
        const { fname, lname, email, phone, password, shippingAdd, billingAdd } = requestBody



        if (!validator.isValidRequestValue(fname)) return res.status(400).send({ status: false, message: ` Key Name : 'fname' You can pass only a to z OR A to Z. Make sure you can not pass only key name or a blank key` })
        if (!validator.isStrictString(fname)) return res.status(400).send({ status: false, message: ` Key Name : 'fname' You can pass only a to z OR A to Z. Make sure you can not pass only key name or a blank key` })


        if (!validator.isValidRequestValue(lname)) return res.status(400).send({ status: false, message: ` Key Name : 'lname' You can pass only a to z OR A to Z. Make sure you can not pass only key name or a blank key` })
        if (!validator.isStrictString(lname)) return res.status(400).send({ status: false, message: ` Key Name : 'lname' You can pass only a to z OR A to Z. Make sure you can not pass only key name or a blank key` })


        if (!validator.isValidRequestValue(email)) return res.status(400).send({ status: false, message: ` Key Name : 'email' You can pass only a valid email. Make sure you can not pass only key name or a blank key` })
        if (!validator.isValidEmail(email)) return res.status(400).send({ status: false, message: ` Key Name : 'email' You can pass only a valid email. Make sure you can not pass only key name or a blank key` })


        const profileImage = await awsConnection.uploadProfileImage(req.files)
        if (!profileImage) return res.status(400).send({ status: false, message: ` Key Name : 'profileImage' You can pass only files. Make sure you can not pass only key name or a blank key` })


        if (!validator.isValidRequestValue(phone)) return res.status(400).send({ status: false, message: ` Key Name : 'phone' You can pass only a valid Indian Mobile No. Make sure you can not pass only key name or a blank key` })
        if (!validator.isValidPhone(phone)) return res.status(400).send({ status: false, message: ` Key Name : 'phone' You can pass only a valid Indian Mobile No. Make sure you can not pass only key name or a blank key` })


        if (!validator.isValidRequestValue(password)) return res.status(400).send({ status: false, message: ` Key Name : 'password' You can pass only a valid password more than 8 character and less than 15 character. Make sure you can not pass only key name or a blank key` })
        if (!validator.isValidPassword(password)) return res.status(400).send({ status: false, message: ` Key Name : 'password' You can pass only a valid password more than 8 character and less than 15 character. Make sure you can not pass only key name or a blank key` })
        const encryptedPassword = await setEncription.setEncription(password)



        const shippingAddressData = await validator.isValidAddress(shippingAdd)
        if (!shippingAddressData) return res.status(400).send({ status: false, msg: "please provide shippingAddress in object form. Make sure you can not pass only key name or a blank key", shippingSuggestData: shippingSuggestData })
        const { street, city, pincode } = shippingAddressData.shipping
        console.log("shipp",shippingAddressData.shipping)


        if (!validator.isValidRequestValue(street)) return res.status(400).send({ status: false, msg: "please provide 'street' key in shipping address. Make sure you can not pass only key name or a blank key" })
        if (!validator.isValidRequestValue(city)) return res.status(400).send({ status: false, msg: "please provide 'city' key in shipping address. Make sure you can not pass only key name or a blank key" })
        if (!validator.isStrictString(city)) return res.status(400).send({ status: false, message: ` Key Name : 'city' You can pass only a to z OR A to Z. Make sure you can not pass only key name or a blank key` })


        if (!validator.isValidRequestValue(pincode)) return res.status(400).send({ status: false, message: ` Key Name : 'pincode' You can pass only 0 to 9 digit. Make sure you can not pass only key name or a blank key or starting from 0` })
        if (!validator.isValidPincode(pincode)) return res.status(400).send({ status: false, message: ` Key Name : 'pincode' You can pass only 0 to 9 digit. Make sure you can not pass only key name or a blank key or starting from 0` })


        if (!validator.isValidRequestValue(req.body.same)) return res.status(400).send({ status: false, msg: "please provide 'same' key true or false which says your billing address. Make sure you can not pass only key name or a blank key" })
        if ((req.body.same !== 'true') && (req.body.same !== 'false')) return res.status(400).send({ status: false, msg: "please provide 'same' key true or false which says your billing address. Make sure you can not pass only key name or a blank key" })


        if (req.body.same === 'false') {
            const billingAddressData = await validator.isValidAddress(billingAdd)
            if (!billingAddressData) return res.status(400).send({ status: false, msg: "please provide billingAddress in object form. Make sure you can not pass only key name or a blank key", billingSuggestData: billingSuggestData })


            const { street, city, pincode } = billingAddressData.billing


            if (!validator.isValidRequestValue(street)) return res.status(400).send({ status: false, msg: "please provide 'street' key in billing address. Make sure you can not pass only key name or a blank key" })
            if (!validator.isValidRequestValue(city)) return res.status(400).send({ status: false, msg: "please provide 'city' key in billing address. Make sure you can not pass only key name or a blank key" })
            if (!validator.isStrictString(city)) return res.status(400).send({ status: false, message: ` Key Name : 'city' You can pass only a to z OR A to Z. Make sure you can not pass only key name or a blank key` })


            if (!validator.isValidRequestValue(pincode)) return res.status(400).send({ status: false, message: ` Key Name : 'pincode' You can pass only 0 to 9 digit. Make sure you can not pass only key name or a blank key or starting from 0` })
            if (!validator.isValidPincode(pincode)) return res.status(400).send({ status: false, message: ` Key Name : 'pincode' You can pass only 0 to 9 digit. Make sure you can not pass only key name or a blank key or starting from 0` })


            finalAddress = {
                shipping: shippingAddressData.shipping,
                billing: shippingAddressData.shipping
            }
console.log("false",finalAddress)

            const finalSave = {
                fname: fname,
                lname: lname,
                email: email,
                profileImage: profileImage,
                phone: phone,
                password: encryptedPassword,
                address: finalAddress,
            }

            
            const saveUserData= await userModel.create(finalSave)
            return res.status(201).send({status:true,msg:"User created successfully",Data:saveUserData})
       

        }


        if (req.body.same === 'true') {


            finalAddress = {
                shipping: shippingAddressData.shipping,
                billing: shippingAddressData.shipping
            }


            const finalSave = {
                fname: fname,
                lname: lname,
                email: email,
                profileImage: profileImage,
                phone: phone,
                password: encryptedPassword,
                address: finalAddress,
            }


            const saveUserData= await userModel.create(finalSave)
            return res.status(201).send({status:true,msg:"User created successfully",Data:saveUserData})
        }


        const abd = await userModel.create(requestBody)
        console.log(abd)
        return res.send(abd)
    }
    catch (err) {
        return res.send(err)
    }
}







const getUser = async function (req, res) {
    try {


        const userId = req.params.userId

        const abd = await userModel.findById(userId)
        console.log(abd)
        if (!abd) return res.send("no data")

        return res.send(abd)
    }
    catch (err) {
        console.log(err)
        return res.send(err)
    }
}




module.exports = {
    registerUser,
    getUser
}