import jwt from 'jsonwebtoken';

const getToken = async (userId)=>{

    let token = jwt.sign({userId},process.env.JWT_SECRET,{expiresIn:'7d'})
    return token;
  
}

export default getToken;