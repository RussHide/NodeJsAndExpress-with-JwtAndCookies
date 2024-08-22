import jwt from 'jsonwebtoken';

const accessTokenSecret = 'your_access_token_secret';

export const authenticateToken = (req, res, next) => {
    console.log('entro al middleware');
    // Extraer la cookie 'accessToken'
    const token = req.cookies.accessToken;

    if (!token) {
        return res.status(401).json({ message: 'Token is required by middleware' });
    }

    // Verificar el token JWT
    jwt.verify(token, accessTokenSecret, (err, user) => {
        if (err) {
            return res.status(401).json({ message: 'Token is invalid or expired' });
        }

        req.user = user; // Almacenar la información del usuario en la solicitud
        next(); // Pasar al siguiente middleware o controlador
    });
};
