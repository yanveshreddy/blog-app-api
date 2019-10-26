const express = require('express')

const appConfig = require('./config/appConfig')

//const port = 3000
const fs = require('fs');
const mongoose= require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

//importing middlewares

const globalErrorMiddleware = require('./middlewares/appErrorHandler')
const routeLoggerMiddleware = require('./middlewares/routeLogger')

const app = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}))
app.use(cookieParser());

app.use(globalErrorMiddleware.globalErrorHandler);
app.use(routeLoggerMiddleware.logIp);
//Bootstrapping models

let modelsPath ='./models';

fs.readdirSync(modelsPath).forEach(function(file)
{
    if(file.indexOf('.js')){
        require(modelsPath+'/'+file)
    }
})

//end Bootstrapping models

//Bootstrapping routes
let routesPath = './routes';

fs.readdirSync(routesPath).forEach(function (file)
{
    if(~file.indexOf('.js')){

        console.log("including below file");
        console.log(routesPath+'/'+file);
        let route = require(routesPath + '/' + file);
        route.setRouter(app);
        
    }
})

//end Bootstrrapping routes


//calling 404 not found application level middleware after routing

app.use(globalErrorMiddleware.globalNotFoundHandler)

//end middleware



app.listen(appConfig.appConfig.port, () => {
    console.log(`Example app listening on port ${appConfig.appConfig.port}!`)
    let db = mongoose.connect(appConfig.appConfig.db.uri);
   // let db = mongoose.connect(appConfig.appConfig.db.uri,{ useNewUrlParser: true },{ useUnifiedTopology: true });
}
)


//handling mongoose connection error

mongoose.connection.on('error',function(err){
    console.log('Database Connection error');
    console.log(err);
});


mongoose.connection.on('open', function(err) {
    if (err) {
        console.log('Database Connection error');
        console.log(err);
    } else {
        console.log('Database Connection open Succesful');
    
    }
})
