const mongoose = require("mongoose")




const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}




const isValidRequestValue = function (isValidRequestValue) {

    if (typeof isValidRequestValue === 'undefined' || isValidRequestValue === null || isValidRequestValue === 'undefined') return false
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





const isNormalString = function (value) {
    let flag = 0
    value = value.trim()
    for (let i = 0; i < value.length; i++)
        if ((value.charCodeAt(i) >= 97 && value.charCodeAt(i) <= 122) || (value.charCodeAt(i) >= 65 && value.charCodeAt(i) <= 90)) flag++
    if (flag === 0) return false
    return true
}





const isValidPrice = function (price) {
    try {


        if (isNaN(price)) return false


        if (price <= 0) return false


        return true
    }

    catch (err) {
        console.log(err)

    }

}









const isValidAvailableSizes = function (availableSize) {

    if (availableSize[0] !== '[' || availableSize[availableSize.length - 1] !== ']') return false


    availableSize = availableSize.toUpperCase()


    availableSize = availableSize.replace("[", "")
    availableSize = availableSize.replace("]", "")
    let sizeArray = availableSize.split(",").map((ele) => ele.trim())


    for (let i = 0; i < sizeArray.length; i++)
        if (!(["S", "XS", "M", "X", "L", "XXL", "XL"].includes(sizeArray[i]))) return false


    return sizeArray


}





const isValidInstallments = function (installments) {
    try {


        if (isNaN(installments)) return false
        installments = Number(installments)


        if (installments < 0) return false


        if (installments !== parseInt(installments)) return false


        return true

    }


    catch (err) {

        console.log(err)

    }

}







const isValidAvailableSizesForUpdate = function (availableSize, dbData) {


    if (availableSize[0] !== '[' || availableSize[availableSize.length - 1] !== ']') return false


    availableSize = availableSize.toUpperCase()


    availableSize = availableSize.replace("[", "")
    availableSize = availableSize.replace("]", "")
    let sizeArray = availableSize.split(",").map((ele) => ele.trim())


    for (let i = 0; i < sizeArray.length; i++)
        if (!(["S", "XS", "M", "X", "L", "XXL", "XL"].includes(sizeArray[i]))) return false



    // if you replace
    // return sizeArray


    // if you don't replace
    sizeArray.filter((ele) => dbData.includes(ele) == false ? dbData.push(ele) : ele * ele)
    return dbData

}





const isValidPriceSort = function (priceSort) {

    if (priceSort != -1 && priceSort != 1) return false

    return true

}




module.exports = {
    isValidRequestBody,
    isValidRequestValue,
    isStrictString,
    isNormalString,
    isValidPrice,
   // isValidCurrency,
    isValidAvailableSizes,
    isValidInstallments,
  //  isObjectId,
    isValidAvailableSizesForUpdate,
    isValidPriceSort
}




