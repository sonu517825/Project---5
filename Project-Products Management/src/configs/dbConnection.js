const mongoose = require('mongoose')


const connection = async function () {

    await mongoose.connect(process.env.DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .then(pass => console.log(`MongoDb is connected , Server Name : "${pass.connection.host}(localhost)" , Database Name : "${pass.connections[0].name}"`))

}



module.exports.connection = connection


