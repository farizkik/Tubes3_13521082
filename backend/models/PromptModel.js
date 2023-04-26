import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const {DataTypes} = Sequelize;

const Prompt = db.define('prompts',{
    question: DataTypes.STRING,
    answer: DataTypes.STRING
},{
    freezeTableName:true
});

export default Prompt;

(async()=>{
    await db.sync();
})();