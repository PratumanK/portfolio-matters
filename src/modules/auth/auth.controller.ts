import { User} from "../../models/user.js";
import bcrypt from "bcrypt";
import type { Request,Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import type { RegisterBody } from "../../types/auth.types.js";

export const registerUser = async (
  req: Request<{}, {}, RegisterBody>,
  res: Response
) => {

  try{
    const{userName,email,password}=req.body;
    
    
    
    if (!userName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const checkExistingUser=await User.findOne({email});
    if(checkExistingUser){
      return res.status(409).json({
        success: false,
        message: 'User already exists with this username or email'
      })
    }
    const salt=await bcrypt.genSalt(10);
    const hashedPassword= await bcrypt.hash(password,salt);
    const newUser= new User({
      userName,
      email,
      password:hashedPassword
    }) 
    await newUser.save();
    if(newUser){
        return res.status(201).json({
          success: true,
          message: 'User Registered Succesfully'
        });
      }
      else{
        return res.status(400).json({
          success: true,
          message: 'Could not Register User'
        });

      }
  }catch(e){
    console.log(e);
    res.status(500).json({
      success:false,
      message:'Some Error Ocurred!'
    })
  }
}

export const loginUser = async (
  req: Request<{}, {},RegisterBody >,
  res: Response
) => {
  try{

     const{userName,email,password}=req.body;

   const checkExisitingUser = await User.findOne({
       $or: [{ email }, { userName }]
     }); 
    if(!checkExisitingUser){
      return res.status(401).json({
        success: false,
        message: 'User does not exist. Please Signup with this Email'
      });
    }
    const matchedPassword = await bcrypt.compare(password, checkExisitingUser.password);
    
    if (!matchedPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }
     const accessToken=jwt.sign(
      { userId: checkExisitingUser._id,userName:checkExisitingUser.userName},
      process.env.JWT_SECRET_KEY as string,
      {expiresIn:'24h'}
    )  
     return res.status(201).json({
          success: true,
          message: 'User Logged In Succesfully',
          token: accessToken,
          user: {
            userId: checkExisitingUser._id,
            userName: checkExisitingUser.userName,
            email: checkExisitingUser.email
          }
        });
}
catch(e){
    console.log(e);
    res.status(500).json({
      success:false,
      message:'Some Error Ocurred!'
    })
  }
}
