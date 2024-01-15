import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  password: {
    type: String,
    required: [true, 'Set password for user'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  subscription: {
    type: String,
    enum: ['starter', 'pro', 'business'],
    default: 'starter',
  },
  token: String,
});

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });
  
    if (!user) {
      throw new Error('Email or password is wrong');
    }
  
    const isPasswordMatch = await bcrypt.compare(password, user.password);
  
    if (!isPasswordMatch) {
      throw new Error('Email or password is wrong');
    }
  
    return user;
};

const UserModel = mongoose.model('User', userSchema);

export default UserModel;