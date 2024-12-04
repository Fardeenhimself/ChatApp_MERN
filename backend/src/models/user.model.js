const mongoose=require('mongoose');
const validator=require('validator');
const bcrypt=require('bcryptjs');
require('dotenv').config();

const UserSchema=new mongoose.Schema({

    email:{
        type:String,
        required:[true,"Please provide your email"],
        unique:[true,"This email is already registered"],
        validate:{
            validator: (value) => validator.isEmail(value),
            message: (props) => props.value + " is not a valid email. " +"Please Enter a valid Email.",
        }
    },
    fullName:{
        type:String,
        required:[true,"Please provide your fullname"],
    },
    password:{
        type:String,
        required:[true,"Please provide a password"],
        minlength:[6,"Password must be atleast length 6"]
    },
    profilePic:{
        type:String,
        default:"",
    }

},
{
    timestamps:true,
});


UserSchema.pre('save',async function (){

    if(!this.isModified('password'))
        return;

    const SALT_ROUNDS=Number(process.env.SALT_ROUNDS);

    const salt=bcrypt.genSaltSync(SALT_ROUNDS);

    const password=bcrypt.hashSync(this.password,salt);

    this.password=password;

});

UserSchema.methods.comparePassword= function (password){
    

    return bcrypt.compareSync(password,this.password);

}





const User=mongoose.model("Users",UserSchema);

module.exports=User;