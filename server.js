const express=require('express');
const mongoose=require('mongoose');
const path=require('path');
require('dotenv').config();

const app=express();
const PORT=3002;

app.use(express.json());
app.use(express.static(path.join(__dirname,'public')));

const mongoURI=process.env.MONGO_URI;

//Connect to MongoDB
mongoose.connect(mongoURI)
    .then(()=> console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:',err));

//Define user schema
const userSchema =new mongoose.Schema({
    name :String,
    email: String,
    password: String
});

//Defining model for user schema
const User = mongoose.model('User',userSchema);

app.get('/users',(req,res)=>{
    User.find({})
    .then(users => res.json(users))
    .catch(err => res.status(500).json({message: err.message}));
});

app.post('/users',(req,res)=>{
    const user=new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });
    user.save()
    .then(newUser => res.status(201).json(newUser))
    .catch(err => res.status(400).json({message: err.message}));
});

app.put('/users/:id',(req,res)=>{
    const userId=req.params.id;
    const updatedata={
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    };

    User.findByIdAndUpdate(userId,updatedata,{new : true})
    .then(updateduser => {
        if(!updateduser){
            return res.status(404).json({message: 'User not found'});
        }
        res.json(updateduser);
    })
    .catch(err => res.status(400).json({message: err.message}));
});

app.delete('/users/:id',(req,res)=>{
    const userid=req.params.id;

    User.findByIdAndDelete(userid)
        .then(deleteduser => {
            if(!deleteduser){
                return res.status(404).json({message: 'User not found'});
            }
            res.json({message: 'User deleted Successfully'});
        })
        .catch(err => res.status(400).json({message: err.message}));
});

app.listen(PORT,()=> console.log(`Server is running at http://localhost:${PORT}`));