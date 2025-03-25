const express=require('express');
const mongoose=require('mongoose');
require('dotenv').config();
const Book=require('./books');

const PORT=3000
const app=express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
.then(()=>console.log("MongoDB connection successful"))
.catch(()=>console.log("Error in connecting to db"))


app.post('/add',async(req,res)=>{
    const{title,author,cost}=req.body;
    if(!title || !author || !cost){
        return res.json({message:'All fields are required'});
    }
    try{
        const NewBook=new Book({title,author,cost});
        await NewBook.save();
        res.json(NewBook);

    }
    catch(error){
        return res.json({message:error.message})
    }
});

app.get('/get',async(req,res)=>{
    try{
        const books=await Book.find({});
        return res.status(200).json(books);
    }catch(error){
        return res.status(500).json({error:error.message})
    }
});


app.get('/get/:id',async(req,res)=>{
    try{
       const book=await Book.findById(req.params.id);
    if(!book){
        return res.status(404).json({message:"Book not found"});
    }
    return res.json(book); 
    }
    
    catch(error){
        return res.status(500).json({error:error.message})
    }
});

app.put('/update/:id',async(req,res)=>{
    try{
        // const {id}=req.params;
        const UpdatedBook=await Book.findByIdAndUpdate(req.params.id,req.body,{new:true});
        if(!UpdatedBook){
            return res.status(404).json({message:"Book not found"});
        }
        return res.status(200).json({message:"Book updated!",book:UpdatedBook})
    }
    catch(error){
        return res.status(500).json({error:error.message});
    }
});

app.delete('/delete/:id',async(req,res)=>{
    try{
        const DeletedBook=await Book.findByIdAndDelete(req.params.id);
        if(!DeletedBook){
            return res.status(404).json({message:"Book not found"});
        }
        return res.status(200).json({message:"Deleted the Book",book:DeletedBook});
    }
    catch(error){
        return res.status(500).json({error:error.message});
    }
})


app.listen(PORT,()=>{
    console.log(`Your server is running on http://localhost:${PORT}`)
});