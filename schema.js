const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    Name: {
        type: String,
        
        trim: true,
        min: 1,
        max: 20
    },
    Moto: {
        type: String,
    
        trim: true,
        min: 1,
        max: 20
    },
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        index: true,
        lowercase: true
    },
    Email: {
        type: String,
     
        trim: true,
        unique: true,
        lowercase: true
    },
    hash_password: {
        type: String,

    },
    Age: {
        type: String,

        trim: true,
        min: 1,
        max: 3
    },
    role: {
        type: String,

        enum: ['user', 'admin'],
        default:'user'
    },
    Phone: {
         type: String 
    },
    pofilePicture: { 
        type: String ,
        default: 'https://th.bing.com/th/id/OIP.DAQotCc6NyxQdo_BIXIGlwHaIa?pid=Api&rs=1'
    }
}, { timestamps: true });

userSchema.virtual('password')
.set(function(password){
    this.hash_password = bcrypt.hashSync(password, 10);
});

userSchema.methods = {
    authenticate: function(password){
        return bcrypt.compareSync(password,this.hash_password);
    }
}

module.exports = mongoose.model('User', userSchema);