// SETUP FILE
const { where } = require("sequelize");
const db = require("../models");
const History = db.histories;

exports.create = (req,res) => {
    const {ChatId, BubbleId, Text, Sender} = req.body;

    if (ChatId && BubbleId && Text && Sender){
        History.create(req.body)
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

    History.findByPk(Id)
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

exports.findInChatId = (req,res) => {
    const {ChatId} = req.params;

    History.findAll({
        where:{ChatId: ChatId}
    })
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
    const {Text} = req.query;
    const condition = Text ? {Text:Text}:null

    History.findAll({
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
    const {Text, Sender} = req.body;

    if (Text && Sender){
        const history = {
            Text: Text,
            Sender: Sender
        };

        History.update(history,{
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

    History.destroy({
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
    History.destroy({
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