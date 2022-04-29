const app = require("./app")


const server = async function () {


    const buildServer = app.listen(process.env.PORT, (err) => {
        if (err) console.log(err.message)
        console.log(`Server is running on ${process.env.HOST}${process.env.PORT}`);
    });


    // Unhandled Promise Rejection  // connection string currupt
    process.on("unhandledRejection", (err) => {
        console.log(`Error: ${err.message}`, err,);
        console.log(`Shutting down the server due to Unhandled Promise Rejection`);
        buildServer.close(() => {
            process.exit(1);
        });
    });
}



module.exports.server = server


