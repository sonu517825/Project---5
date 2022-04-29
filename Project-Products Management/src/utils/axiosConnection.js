const axios = require('axios')
// const error = require("http-errors")



const axiosCheck = async function (pinCode , city) {

    try {

   
        const options = {
            method: "GET",
            url: `https://api.postalpincode.in/pincode/${pinCode}`,
        };

        const pinCodeDetail = await axios(options);

//console.log(pinCodeDetail.data[0].PostOffice[0])

        if (pinCodeDetail.data[0].PostOffice === null) return '404'//

        const cityNameByPinCode = pinCodeDetail.data[0].PostOffice[0].District;

        if (cityNameByPinCode.toLowerCase() !== city.toLowerCase()) return '400'// 

        return {city:cityNameByPinCode, state:pinCodeDetail.data[0].PostOffice[0].State , country: pinCodeDetail.data[0].PostOffice[0].Country , pinCode }

    }
    catch (err) {

        console.log(err)
        
    }

}


module.exports = {

    axiosCheck 

}

