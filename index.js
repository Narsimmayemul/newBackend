const express = require('express');
const app=express();
app.use(express.json());
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const {connection , User_Model} = require('./db')



const authorization = (req , res , next)=>{
    const token = req.headers.authorization.split(" ")[1];
    console.log(token)
    jwt.verify(token , "narsimma" ,async function(err , decode){
        console.log("user ID"+decode.userID);
        const user_ID = await User_Model.findOne({_id:decode.userID})
        req.u_ID = user_ID;
        if(err){
            console.log(err)
            res.send('you are not allowed to visit this page')
        }else{
           next();
        }
    })
}
app.get("/" , async(req , res)=>{
    try{
        const data = await User_Model.find();
        res.send(data)
        console.log('from home page');
    }catch(error){
        console.log('error in get fucntion   ' + error);
    }
})

app.post("/login" , async (req,res)=>{
        const {email , password} = req.body;
        const users = await User_Model.findOne({email});
        const hashing = users.password;
        console.log(hashing)
        bcrypt.compare(password, hashing, function(err, result) {
            if(result == true){
                console.log(result)
            const token = jwt.sign({ userID : users._id } , "narsimma"); 
                res.send({message:'user found' , token: token})
            }else{
                res.send("User not found");
            }
        });
})

app.post("/register" , async (req,res)=>{
    try{
        const {name , email , password , role} = req.body;
        const user = await User_Model.find({email});
        if(user.length != 0){
            res.send({message:'user alredy exist' , email:user.email})
        }else{
            bcrypt.hash(password, 5,async function(err, hash) {
                if(err){
                    console.log(err)
                }else{
                    console.log(hash)
                    await User_Model.create({name:name , email:email , password:hash , role:role});
                    console.log(req.body);
                    res.status(200).send(req.body);
                }
            });
        }

    }catch(err){
        res.send('Please Follow Proper structure {name , email , password}   '+err)
        console.log("Please Follow Proper stuture {name , email , password}  "+err)
    }
})

app.get("/reports"  ,authorization, (req ,res)=>{
    const user_ID = req.u_ID;
    try {
        const role = user_ID.role;
            if(role != 'teacher'){
                // console.log(req.role)
                res.send('you are done')
            }else{
                res.send('you can not access this page');
            }
          } catch (error) {
            console.log(err)
          }
        })

        app.get("/students" , authorization ,(req ,res)=>{
            try {
              res.send('you are a student')
            } catch (error) {
                res.send('you are not a student')
              console.log(err)
            }
          })

          
        app.get("/teacher" , authorization ,(req ,res)=>{
            try {
              res.send('you are a teacher')
            } catch (error) {
              console.log(err)
            }
          })


app.listen(8080 , ()=>{
    try{
        console.log('connection started')
    }catch(error){
        console.log(error);
    }
})