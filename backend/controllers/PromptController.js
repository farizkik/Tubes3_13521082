const { KnuthMorrisPratt, BoyerMoore, LevenstheinDistance } = require("./StringFunctions");

// const KnuthMorrisPratt		= require("./StringFunctions");
// const BoyerMoore			= require("./StringFunctions");
// const LevenstheinDistance	= require("./StringFunctions");

// SETUP FILE
const { where } = require("sequelize");
const db = require("../models");
const Prompt = db.prompts;
const History = db.histories;
const evaluateExpression = require("./arit")

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
    const {ChatId,BubbleId} = req.params;
	let text = "";

    History.findAll({
        where:{
            ChatId: ChatId,
            BubbleId:BubbleId
        }
    })
        .then((data)=> {
			text = data[0].Text;

            if(!data){
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

	Prompt.findAll({
		where: null,
	})
		.then((data) => {
			if (data.length !== 0)
			{
				// Cek KMP
				const algorithm = new KnuthMorrisPratt(text, data);

				let value = algorithm.searchPattern();

				if (value != null)
				{
					res.status(200).send(value);
				}
				else
				{
					// Cek levensthein
					const levensthein = new LevenstheinDistance(text, data);

					let reply = levensthein.initializeLevensthein();

					if (reply.length == 1)
					{
						res.status(200).send(reply);
					}
					else
					{
						let string = "Pertanyaan tidak ditemukan pada database.\nApakah maksud anda\n";
						string += reply[0] + '\n';
						string += reply[1] + '\n';
						string += reply[2] + '\n';

						console.log(string);

						res.status(200).send(string);
					}
				}
			}
			else
			{
				 res.status(404).send({
					message: "Not Found"
				});
			}
		})
		.catch((error) => {
			res.status(500).send({
				message : error.message || "Internal Server Error"
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
