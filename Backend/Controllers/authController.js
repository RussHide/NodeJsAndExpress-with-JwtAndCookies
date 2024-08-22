import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt';

import { pool } from "../db.js"

const accessTokenSecret = 'your_access_token_secret';
const refreshTokenSecret = 'your_refresh_token_secret';

export const login = async (req, res) => {
    /*  const { username, password } = req.body;
 
     const user = users.find(u => u.username === username && u.password === password);
     if (!user) {
         return res.status(401).send('Invalid credentials');
     }
 
     // Generación del Access Token y el Refresh Token
     const accessToken = jwt.sign({ id: user.id, username: user.username }, accessTokenSecret, { expiresIn: '15m' });
     const refreshToken = jwt.sign({ id: user.id, username: user.username }, refreshTokenSecret, { expiresIn: '7d' });
 
     // Configuración de las cookies
     res.cookie('accessToken', accessToken, {
         httpOnly: true,
         secure: true,
         sameSite: 'strict',
         maxAge: 15 * 60 * 1000 // 15 minutos
     });
 
     res.cookie('refreshToken', refreshToken, {
         httpOnly: true,
         secure: true,
         sameSite: 'strict',
         maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días
     });
 
     res.status(200).send('Logged in successfully'); */
}

export const register = async (req, res) => {
    const { user, password, name } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword);
        const [{ insertId }] = await pool.query('INSERT INTO users (user, password, name) VALUES (?,?,?)', [user, hashedPassword, name]);
        const accessToken = jwt.sign({ id: insertId, name, user }, accessTokenSecret, { expiresIn: '1m' });
        const refreshToken = jwt.sign({ id: insertId, name, user }, refreshTokenSecret, { expiresIn: '7d' });

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000 // 15 minutos
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días
        });
        return res.status(201).json({ message: 'User registered successfully', status: true });
    } catch (error) {
        return res.status(500).json({ message: 'There was a problema registering the user', status: true });
    }
}



export const renewToken = async (req, res) => {
    console.log('entreo a refresh token');
    const refreshToken = req.cookies.refreshToken;
    console.log(refreshToken);
    return
    if (!refreshToken) {
        return res.status(403).send('Access denied');
    }

    try {
        const decoded = jwt.verify(refreshToken, refreshTokenSecret);
        console.log(decoded);

        // Generar un nuevo Access Token
        const newAccessToken = jwt.sign({ id: decoded.id, username: decoded.username }, accessTokenSecret, { expiresIn: '15m' });

        // Actualizar la cookie del Access Token
        res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000 // 15 minutos
        });

        res.status(200).send('Token renewed');
    } catch (err) {
        return res.status(400).send('Invalid refresh token');
    }
}


const ex = (req, res) => {

}
