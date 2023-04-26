import Prompt from "../models/PromptModel.js";

export const getPrompts = async(req, res)=>{
    try{
        const response = await Prompt.findAll();
        res.status(200).json(response);
    } catch (error){
        console.log(error.message);
    }
}

export const getPromptById = async(req, res)=>{
    try{
        const response = await Prompt.findOne({
            where:{
                id: req.params.id
            }
    });
        res.status(200).json(response);
    } catch (error){
        console.log(error.message);
    }
}

export const createPrompt = async(req, res)=>{
    try{
        await Prompt.create(req.body);
        res.status(201).json({msg:"Prompt Created"});
    } catch (error){
        console.log(error.message);
    }
}

export const updatePrompt = async(req, res)=>{
    try{
        await Prompt.update(req.body,{
            where:{
                id: req.params.id
            }
        });
        res.status(200).json({msg:"Prompt updated"});
    } catch (error){
        console.log(error.message);
    }
}

export const deletePrompt = async(req, res)=>{
    try{
        await Prompt.destroy({
            where:{
                id: req.params.id
            }
        });
        res.status(200).json({msg:"Prompt deleted"});
    } catch (error){
        console.log(error.message);
    }
}