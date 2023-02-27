const mongoose = require('mongoose')
mongoose.set("strictQuery", false);
const  connectDB = async () => {
    try{
        //  awaits the promise of the mongoURI global varaible in the env file
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            // options to avoid / stop any warnings in the console
            useNewUrlParser: true,
            useUnifiedTopology : true
            
        })

        console.log(`MongoDB connected: ${conn.connection.host}`)
    } 
    // if something goes wrong and it cant connect it should catch an error
    catch (err){
        
        // log in the errors
        console.error(err)
        // stop the process
        process.exit(1)
    }
}
// to be able to run it in the app.js file
module.exports = connectDB