const mongoose = require('mongoose');
if(process.env.NODE_ENV!=='production'){
    require('dotenv').config();
}
const server = `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@cluster0.q2isi.mongodb.net/ArtStoreDb?retryWrites=true`

class Database{
    constructor()
    {
        this._connect()
    }
    _connect(){
        mongoose.connect(server).then(
            () =>{
                console.log('Database connection successful')
            }
        ).catch(err=>{
            console.log('Database connection error')
        })
    }
}
module.exports = new Database()