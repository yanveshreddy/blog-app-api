let errorHandler = (err,req,res,next) =>{
   
    console.log("error handler called");
    console.log(err);
    res.send('some error occured at global level');
}

let notFoundHandler =(req,res,next) =>{
    console.log("notFound handler called");
  //  console.log(err);
    res.status(404).send('route not found')

}

module.exports={

    globalErrorHandler:errorHandler,
    globalNotFoundHandler:notFoundHandler
}