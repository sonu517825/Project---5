const mongoose = require('mongoose')
const DB_URI = 'mongodb+srv://sonu517825:m0ww1dng9uqrz0ge@cluster0.wgtiy.mongodb.net/group13Database?retryWrites=true&w=majority'



const connection = async function () {
    try {


      await  mongoose.connect(DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })



            .then(pass => console.log(`MongoDb is connected , Database Name "${pass.connections[0].name}"`))
            .catch(err => console.log(err))

    }
    catch (err) {
        console.log(err)
        process.exit(1)
    }
}


module.exports.connection = connection

