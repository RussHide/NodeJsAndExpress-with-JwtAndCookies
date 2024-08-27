import axios from 'axios';
import { useState } from 'react';

// Crear una instancia de Axios
export const apiClient = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true // Asegura que las cookies se envíen con cada solicitud
});

// Interceptor de respuesta para manejar la renovación del token
apiClient.interceptors.response.use(
    response => {
        // Si la respuesta es exitosa, simplemente la retornamos
      /*   console.log(response); */
        return response;
    },
    async error => {
        const originalRequest = error.config;

        // Verificar si el error es 401 y la solicitud no es para /auth/login
        if (error.response.data.shouldRenewToken && !originalRequest._retry) {
            // Evitar la renovación de token si la solicitud es para /auth/login
           /*  if (originalRequest.url === '/auth/login') {
                // Rechazamos el error sin intentar renovar el token
                console.log('Aqui se rechaza antes' + error);
                return
            } */

            // Si no es la solicitud de login, intentamos renovar el token
            originalRequest._retry = true;
            try {
                // Llamada al endpoint de renovación de token
                await apiClient.post('/auth/renewToken');

                // Reintentamos la solicitud original con el nuevo token
                return apiClient(originalRequest);
            } catch (renewError) {
                // Si la renovación falla, redirigimos al login o manejamos el error
                console.error('Failed to renew token:', renewError.response.data);
                // Puedes redirigir al usuario a la página de login aquí, o lanzar el error
                return Promise.reject(renewError);
            }
        }

        // Si el error no es 401, o si la renovación falla, lo lanzamos de nuevo
        return Promise.reject(error);
    }
);
export const useRequestStatus = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    const makeRequest = async (url, options) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios(url, options);
            setData(response.data);
            return response.data;
        } catch (err) {
            setError(err.message || 'Something went wrong');
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    return { isLoading, error, data, makeRequest };
};

