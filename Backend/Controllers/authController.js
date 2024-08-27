import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt';
import { pool } from "../db.js"

const accessTokenSecret = 'your_access_token_secret';
const refreshTokenSecret = 'your_refresh_token_secret';

export const verifySession = async (req, res) => {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    try {
        // Si no hay ni accessToken ni refreshToken
        if (!accessToken && !refreshToken) {
            // Aquí puedes decidir redirigir al usuario a la página de login o simplemente terminar la solicitud
            return res.status(200).json({ message: 'Session expired', status: false });
        }

        // Si no hay accessToken pero hay refreshToken, intentamos renovar el accessToken
        if (!accessToken) {
            return jwt.verify(refreshToken, refreshTokenSecret, (refreshErr, refreshUser) => {
                if (refreshErr) {
                    res.clearCookie('refreshToken');
                    return res.status(200).json({ message: 'Session expired, please log in again', status: false, redirect: '/login' });
                }

                const newAccessToken = jwt.sign({ id: refreshUser.id, name: refreshUser.name, user: refreshUser.user }, accessTokenSecret, { expiresIn: '5m' });

                res.cookie('accessToken', newAccessToken, {
                    httpOnly: false,
                    secure: true,
                    sameSite: 'strict',
                    maxAge: 5 * 60 * 1000
                });

                return res.status(200).json({ message: 'Session renewed successfully', status: true });
            });
        }
        // Verificar si el accessToken es válido
        jwt.verify(accessToken, accessTokenSecret, (err, user) => {
            //Verificando acceessToken
            if (err) {
                //Si hay un errror cualquier con el accessToken borralo
                res.clearCookie('accessToken');
                // Si el accessToken ha expirado, intentamos renovar con el refreshToken
                return jwt.verify(refreshToken, refreshTokenSecret, (refreshErr, refreshUser) => {
                    //Verificando refreshToken
                    if (refreshErr) {
                        //Si hay un errror cualquier con el refreshToken borralo
                        res.clearCookie('refreshToken');
                        //No se manda ningun error, y se tiene que iniciar sesion como normalmente
                        return res.status(200).json({ message: 'Session expired, please log in again', status: false, redirect: '/login' });
                    }
                    //Si el refreshToken es valido, crea el nuevo accessToken
                    const newAccessToken = jwt.sign({ id: refreshUser.id, name: refreshUser.name, user: refreshUser.user }, accessTokenSecret, { expiresIn: '5m' });

                    res.cookie('accessToken', newAccessToken, {
                        httpOnly: false,
                        secure: true,
                        sameSite: 'strict',
                        maxAge: 5 * 60 * 1000
                    });
                    console.log('se renovo');
                    return res.status(200).json({ message: 'Session renewed successfully', status: true });
                });
            } else {
                // Si el accessToken es válido
                console.log('si tiene la sesion activa alv');
                return res.status(200).json({ message: 'Session is active', status: true });
            }
        });
    } catch (error) {
        console.error('Error verifying session:', error);
        return res.status(500).json({ message: 'There was a problem verifying the session', status: false });
    }
};

export const login = async (req, res) => {
    const { user, password } = req.body;

    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE user = ?', [user]);

        if (rows.length === 0) return res.status(404).json({ message: 'The user does not exists', status: false, });

        const currentUser = rows[0];

        const isPasswordValid = await bcrypt.compare(password, currentUser.password);
        console.log(isPasswordValid);

        if (!isPasswordValid) {
            return res.status(404).json({ message: 'The credentials are incorrect', status: false });
        }

        const accessToken = jwt.sign({ id: currentUser.id, name: currentUser.name, user: currentUser.user }, accessTokenSecret, { expiresIn: '5m' });
        const refreshToken = jwt.sign({ id: currentUser.id, name: currentUser.name, user: currentUser.user }, refreshTokenSecret, { expiresIn: '7d' });

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 5 * 60 * 1000
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({ message: 'Login successfull', status: true });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'There was a problem logging in', status: false });
    }
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
            httpOnly: false,
            secure: true,
            sameSite: 'strict',
            maxAge: 60 * 1000 // 1 minuto
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

export const renewToken = (req, res) => {
    console.log('Entró a refresh token');
    const refreshToken = req.cookies.refreshToken;
    console.log(refreshToken);

    if (!refreshToken) {
        return res.status(403).json({ message: 'Refresh token does not exist', status: false });
    }

    // Verificar el refreshToken con callback
    jwt.verify(refreshToken, refreshTokenSecret, (err, tokenDecodedData) => {
        if (err) {
            return res.status(400).send('Invalid refresh token');
        }

        const { id, name, user } = tokenDecodedData;
        console.log(tokenDecodedData);

        // Generar un nuevo Access Token
        const newAccessToken = jwt.sign({ id, name, user }, accessTokenSecret, { expiresIn: '15m' });

        // Actualizar la cookie del Access Token
        res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000 // 15 minutos
        });

        return res.status(200).send('Token renewed');
    });
};

export const logout = (req, res) => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return res.status(200).json({ message: 'Session closed successfully', status: true });
};

