import jwt from 'jsonwebtoken';
import userModel from '../models/contacts/userModels.js';

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
  
    if (!authHeader) {
      return res.status(401).json({ message: 'Not authorized' });
    }
  
    const token = authHeader.split(' ')[1];
  
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      const user = await userModel.findOne({ _id: decoded.userId, 'tokens.token': token });
  
      if (!user) {
        return res.status(401).json({ message: 'Not authorized' });
      }
  
      req.user = user;
      req.token = token;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized' });
    }
  };
  
  export default authMiddleware;