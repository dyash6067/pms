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


const userSchema=new mongoose.Schema({
    username:{
        type:String,
        require:true,
        index:{
            unique:true
        }
    },

    email:{
        type:String,
        require:true,
        index:{
            unique:true
        }
    },

    password:{
        type:String,
        require:true,
       
    }, date:{
        type:Date,
        default:Date.now
    }
})

const userModel=mongoose.model('users',userSchema)

module.exports=userModel