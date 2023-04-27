// SETUP FILE
const { where } = require("sequelize");
const db = require("../models");
const Prompt = db.prompts;

exports.create = (req,res) => {
    const {Question, Answer} = req.body;

    if (Question && Answer){
        const prompt = {
            Question: Question,
            Answer: Answer
        };

        Prompt.create(prompt)
            .then((data)=>{
                res.status(201).send(data);
            })
            .catch((error)=>{
                res.status(500).send({
                    message: error.message || "Internal Server Error"
                });
            });
    } else {
        res.status(400).send({
          message: "Bad Request",
        });
    }
}

exports.findOne = (req,res) => {
    const {Id} = req.params;

    Prompt.findByPk(Id)
        .then((data)=> {
            if(data){
                res.status(200).send(data);
            } else {
                res.status(404).send({
                    message:"Not Found"
                });
            }
        })
        .catch((error)=>{
            res.status(500).send({
                message: error.message || "Internal Server Error"
            })
        })
}

exports.findAll = (req,res) => {
    const {Question} = req.query;
    const condition = Question ? {Question:Question}:null

    Prompt.findAll({
        where: condition,
    })
        .then((data)=> {
            res.status(200).send(data);
        })
        .catch((error)=>{
            res.status(500).send({
                message: error.message || "Internal Server Error"
            })
        })
}

exports.update = (req,res) => {
    const {Question, Answer} = req.body;

    if (Question && Answer){
        const prompt = {
            Question: Question,
            Answer: Answer
        };

        Prompt.update(prompt,{
            where:{Id: req.params.Id},
        })
            .then((nums)=>{
                res.status(201).send(nums);
            })
            .catch((error)=>{
                res.status(500).send({
                    message: error.message || "Internal Server Error"
                });
            });
    } else {
        res.status(400).send({
          message: "Bad Request",
        });
    }
}

exports.delete = (req,res) => {
    //const {Id} = req.params.Id;

    Prompt.destroy({
        where: {Id: req.params.Id},
    })
        .then((nums)=> {
            if(nums){
                res.sendStatus(200).send(nums);
            } else {
                res.status(404).send({
                    message:"Bad Request"
                });
            }
        })
        .catch((error)=>{
            res.status(500).send({
                message: error.message || "Internal Server Error"
            })
        })
}

exports.deleteAll = (req,res) => {
    Prompt.destroy({
        where: {},
        truncate: false
    })
        .then((nums)=> {
            res.status(200).send(nums);
        })
        .catch((error)=>{
            res.status(500).send({
                message: error.message || "Internal Server Error"
            })
        })
}