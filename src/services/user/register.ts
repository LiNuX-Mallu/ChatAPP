import bcrypt from 'bcrypt';
import User from '../../models/User';

export default async (username: string, email: string, password: string) => {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({username, email, password: hashedPassword});

        return await newUser.save();
    } catch (error) {
        throw error;
    }
}