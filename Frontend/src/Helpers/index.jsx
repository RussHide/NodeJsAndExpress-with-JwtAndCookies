import axios from 'axios';

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
        console.log(response);
        return response;
    },
    async error => {
        console.log('mamo1');

        console.log(error);
        const originalRequest = error.config;
        console.log('mamo2');


        // Si el error es 401, intentamos renovar el token
        if (error.response.status === 401 && !originalRequest._retry) {

            console.log('Tiene un 401');

            originalRequest._retry = true;

            try {
                // Llamada al endpoint de renovación de token
                console.log('pero aqui manda a hacer un refresh');
                await apiClient.post('/auth/renewToken');

                // Reintentamos la solicitud original con el nuevo token
                return apiClient(originalRequest);
            } catch (renewError) {
                // Si la renovación falla, redirigimos al login o manejamos el error
                console.error('Failed to renew token:', renewError.response.data);
                // Puedes redirigir al usuario a la página de login aquí
            }
        }

        // Si el error no es 401, o si la renovación falla, lo lanzamos de nuevo
        return Promise.reject(error);
    }
);

