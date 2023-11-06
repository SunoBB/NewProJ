const mongoose = require('mongoose');
require('dotenv').config();
const username = process.env.DATABASE_USERNAME;
const password = process.env.DATABASE_PASSWORD;
const server = `mongodb+srv://${username}:${password}@cluster0.q2isi.mongodb.net/ArtStoreDb?retryWrites=true`;
console.log(server);
class Database{
    constructor()
    {
        this._connect()
    }
    _connect(){
        mongoose.connect(server).then(
            () =>{
                console.log('Database connected')
            }
        ).catch(err=>{
            console.log('Database connection failed')
        })
    }
}
module.exports = new Database()