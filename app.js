const express=require('express');
const mongoose=require('mongoose');
const multer=require('multer')
const path=require('path')
const fs=require('fs')

//storage Engine
const storage=multer.diskStorage(
   {
    destination:'./uploads/',
    filename:function(req,file,cb){
        cb(null,file.fieldname+'-'+Date.now()+path.extname(file.originalname));
    },
    
}

)

function checkFileType(file,cb){
    const filesAllowed=/jpeg|png|jpg/;
    //checking extension
    const extname=filesAllowed.test(path.extname(file.originalname).toLowerCase());
    // cheking mimetype
    const mimetype=filesAllowed.test(file.mimetype)

    if(extname && mimetype)
    {
        return cb(null,true)
    }
    else
    {
         cb("Error:Images Only ")
    }
}
const upload=multer({
    storage:storage,
    limits:{filesize:1*1024*1024*1024},
    fileFilter:function(req,file,cb){
        checkFileType(file,cb);
    }
    
    }
).single('image')


//init app
const app=express();

app.use(express.json())



app.put('/upload',(req,res)=>{


        upload(req,res,(err)=>{
            if(err)
            {
                res.send(err);
            }
            else
            {
                res.status(201).json(req.file);
            }
        })
       
        
})


app.delete('/delete',(req,res)=>{
    console.log("Entered")
    const id =req.body.id;
    const path='./uploads/'+id;
    console.log(path);
    fs.unlinkSync(path);

    res.status(201).send("File Deleted");
})


//Endpoint for Renaming file
app.post('/rename',(req,res)=>{
    
    const id =req.body.id;
    const newName=req.body.newName;
    const oldpath='./uploads/'+id;
    const newpath='./uploads/'+newName;
    fs.renameSync(oldpath,newpath,err=>{
        console.log(err);
    })
})

app.listen(3000,(req,res)=>{
    console.log("Listening on port 3000");
})