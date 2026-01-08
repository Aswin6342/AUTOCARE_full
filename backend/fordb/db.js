import mongoose from 'mongoose';
import 'dotenv/config';
const DB_url=process.env.url;

export async function connectToDB(){
    try{
        await mongoose.connect(DB_url);
        console.log("Connected to MongoDB successfully");
    }catch(error){
        console.error("Error connecting to MongoDB:",error.message);
    }
}