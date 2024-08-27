import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import authRouter from './Routes/authRouter.js'
import userRouter from './Routes/userRouter.js'
import socialRouter from './Routes/socialRouter.js'
import { authenticateToken } from './Middleware/authenticateToken.js'


const corsOptions = { origin: 'http://localhost:5174', credentials: true };
const app = express()
app.use(express.json())
app.use(cors(corsOptions));
app.use(cookieParser());

app.use('/api/users', userRouter)
app.use('/api/auth', authRouter)
app.use('/api/social', socialRouter)
app.post('/api/suma', authenticateToken, (req, res) => {
    const { one, two } = req.body;
    console.log(req.body);
    const sum = one + two;
    console.log(sum);
    console.log(`The sum of ${one} and ${two} is ${sum}`);
    return res.status(200).json({ sum });
});




app.listen(3000, () => console.log('Server running on port 3000'))