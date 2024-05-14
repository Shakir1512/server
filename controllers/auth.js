import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

import users from '../models/users.js'

export const signup = async(req,res) => {
    const { name, email, password } = req.body;
    try{
        const existinguser = await users.findOne({ email });
        if(existinguser){
            return res.status(409).json({ message: 'User already exist'});
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = await users.create({ name, email, password: hashedPassword })
        const token = jwt.sign({ email: newUser.email, id:newUser._id }, process.env.JWT_SECRET, {expiresIn: '1h'});
        return res.status(201).json({ data: newUser, token, message: 'User created successfully' });
    }catch(error){
        return res.status(500).json({ message: 'Internal server error'});
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await users.findOne({ email , deleted: 0  });
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        return res.status(200).json({ token, message: "Login successful" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteUser = async (req, res) => {
    const _id = req.body;  
    try {
        const deletedUser = await users.findByIdAndUpdate(_id, { deleted: 1 }, { new: true });    
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};