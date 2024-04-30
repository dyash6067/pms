const mongoose=require('mongoose')
// mongoose.connect('mongodb://localhost:27017/pms',{useNewUrlParser:true,useUnifiedTopology:true}).then(()=>{
//     console.log('connect Sucessfully')
// }).catch((err)=>{
//     console.log('something went wrong',err)
// })
mongoose.connect('mongodb+srv://dyash3116:yashDubay@cluster0.8zclfp6.mongodb.net/pms?retryWrites=true&w=majority',{useNewUrlParser:true,useUnifiedTopology:true}).then(()=>{
    console.log('connect Sucessfully')
}).catch((err)=>{
    console.log('something went wrong',err)
})

const passwordSchema=new mongoose.Schema({
  
    password_category:{
        type:String,
        require:true,
    },
    date:{
        type:Date,
        default:Date.now
    }
})

const passCatModel=mongoose.model('password_categories',passwordSchema)

module.exports=passCatModel;