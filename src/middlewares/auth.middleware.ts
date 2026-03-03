import type { Request,Response,NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";



  export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  const authHeader= req.headers["authorization"];
  console.log(authHeader);
  const token= authHeader && authHeader.split(" ")[1];
  if(!token){
     return res.status(401).json({
      success:false,
      message:"You are Unauthorized.Please Login"
    })
  }
  try {
    const decodedTokenInfo = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string,
    ) as JwtPayload;
// if (typeof decodedTokenInfo === "string") {
//   return res.status(401).json({ message: "Invalid token" });
// }
    req.user = {id: decodedTokenInfo.userId as string};

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Error occurred while extracting token"
    });
  }
};
