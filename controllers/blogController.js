const express = require('express');
const shortId = require('shortid');

const mongoose = require('mongoose');
const blogModel = mongoose.model('Blog');

const response = require('../libraries/responseLib');
const time = require('../libraries/timeLib');
const check = require('../libraries/checkLib');
const logger =require('../libraries/loggerLib')

let testRoute = (req, res) => {
    let name = req.params.fullname;
    let apiResponse=response.generate(false,"name found",200,name);
    res.send(apiResponse);
    //res.send(name);
}
let getAllBlogs = (req, res) => {
    console.log(req.xyz);
    blogModel.find().exec((err, result) => {
        if (err) {

            logger.error(err.message, 'Blog Controller: getAllBlog', 10)
            let apiResponse=response.generate(true,"Failed to find Blog Details",500,null);
            res.send(apiResponse);
        }
        else if (check.isEmpty(result)) {
            logger.info('No Blog Found', 'Blog Controller: getAllBlog')
            let apiResponse=response.generate(true,"No blog found",404,null);
            res.send(apiResponse);
        }
        else {
            let apiResponse=response.generate(false,"Deatails Found",200,result);
            res.send(apiResponse);
        }
    })
}

let viewByBlogId = (req, res) => {

    blogModel.findOne({ 'blogId': req.params.blogId }).exec((err, result) => {
        if (err) {
            logger.error(err.message, 'Blog Controller: viewByBlogId', 10)
            let apiResponse=response.generate(true,"Failed to find Blog Details",500,null);
            res.send(apiResponse);
        }
        else if (check.isEmpty(result)) {
            logger.info('No Blog Found', 'Blog Controller: viewByBlogId')
            let apiResponse=response.generate(true,"No blog found",404,null);
            res.send(apiResponse);
        }
        else {
            let apiResponse=response.generate(false,"Deatails Found",200,result);
            res.send(apiResponse);
        }
    })
}

let viewByAuthor = (req, res) => {

    blogModel.findOne({ 'author': req.params.author }).exec((err, result) => {
        if (err) {
            let apiResponse=response.generate(true,"Failed to find Blog Details",500,null);
            res.send(apiResponse);
        }
        else if (check.isEmpty(result)) {
            let apiResponse=response.generate(true,"No blog found",404,null);
            res.send(apiResponse);
        }
        else {
            let apiResponse=response.generate(false,"Deatails Found",200,result);
            res.send(apiResponse);
        }
    })
}

let viewByCategory = (req, res) => {

    blogModel.findOne({ 'category': req.params.category }).exec((err, result) => {
        if (err) {
            let apiResponse=response.generate(true,"Failed to find Blog Details",500,null);
            res.send(apiResponse);
        }
        else if (check.isEmpty(result)) {
            let apiResponse=response.generate(true,"No blog found",404,null);
            res.send(apiResponse);
        }
        else {
            let apiResponse=response.generate(false,"Deatails Found",200,result);
            res.send(apiResponse);
        }
    })
}

let createBlog = (req, res) => {

    var today = time.now();
    let blogId = shortId.generate();

    let newBlog = new blogModel({
        blogId: blogId,
        title: req.body.title,
        description: req.body.description,
        bodyHtml: req.body.blogBody,
        isPublished: true,
        category: req.body.category,
        author: req.body.fullName,
        created: today,
        lastModified: today
    })

    let tags = (req.body.tags != undefined && req.body.tags != "" && req.body.tags != null) ? req.body.tags.split(',') : []

    newBlog.tags = tags;
    newBlog.save((err, result) => {
        if (err) {
            logger.error(err.message, 'Blog Controller: createBlog', 10)
            let apiResponse=response.generate(true,"Failed to save Blog Details",500,null);
            res.send(apiResponse);
        }
        
        else {
            let apiResponse=response.generate(false,"created succesfully",200,result);
            res.send(apiResponse);
        }

    })

}

let editBlog = (req, res) => {

    let options = req.body;
    console.log(options);
    blogModel.update({ 'blogId': req.params.blogId }, options, { multi: true }).exec((err, result) => {
        if (err) {
            logger.error(err.message, 'Blog Controller: editBlog', 10)
            let apiResponse=response.generate(true,"Failed to edit Blog Details",500,null);
            res.send(apiResponse);
        }
        else if (check.isEmpty(result)) {
            let apiResponse=response.generate(true,"No blog found",404,null);
            res.send(apiResponse);
        }
        else {
            let apiResponse=response.generate(false,"blog edited succesfully",200,result);
            res.send(apiResponse);
        }
    })


}

let blogViewCount = (req, res) => {

    blogModel.findOne({ 'blogId': req.params.blogId }).exec((err, result) => {
        if (err) {
            logger.error(err.message, 'Blog Controller: blogViewCount', 10)
            let apiResponse=response.generate(true,"Failed to find Blog Details",500,null);
            res.send(apiResponse);
        }
        else if (check.isEmpty(result)) {
            let apiResponse=response.generate(true,"No blog found",404,null);
            res.send(apiResponse);
        }
        else {
            result.views += 1;
            result.save((err, result)=>{

                if (err) {
                    let apiResponse=response.generate(true,"Failed to save Blog Details",500,null);
                     res.send(apiResponse);
                }
                else {

                    let apiResponse=response.generate(false,"inserted succesfully",200,result);
                    res.send(apiResponse);
                }
            })


        }
    })
}

let deleteBlogbyID=(req,res) =>{

blogModel.remove({'blogId':req.params.blogId}).exec((err, result) => {
    if (err) {
        let apiResponse=response.generate(true,"Failed to find Blog Details",500,null);
        res.send(apiResponse);
    }
    else if (check.isEmpty(result)) {
        
        let apiResponse=response.generate(true,"Failed to find Blog Details",500,null);
        res.send(apiResponse);
    }
    else {
        let apiResponse=response.generate(false,"deleted succesfully",200,result);
        res.send(apiResponse);
    }
})

}



module.exports = {
    testRoute: testRoute,
    getAllBlogs: getAllBlogs,
    viewByBlogId: viewByBlogId,
    createBlog: createBlog,
    editBlog: editBlog,
    viewByAuthor: viewByAuthor,
    viewByCategory: viewByCategory,
    blogViewCount:blogViewCount,
    deleteBlogbyID:deleteBlogbyID
}