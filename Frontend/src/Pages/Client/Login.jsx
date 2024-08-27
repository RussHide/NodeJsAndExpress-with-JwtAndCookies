import { useState } from 'react'
import { apiClient } from "../../Helpers";
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';


const Login = () => {
  const [user, setUser] = useState({ user: '', password: '' })
  const navigate = useNavigate()
  
  const login = async () => {
    toast.promise(
      (async () => {
        try {
          const { data: { status } } = await apiClient.post('/auth/login', user);
          status && navigate('/home')
        } catch (error) {
          throw error.response?.data || 'An unexpected error occurred'
        }
      })(),
      { loading: 'Logging in', success: 'Login successful', error: (error) => error.message },
      { position: 'top-right', duration: 2500 }
    );
  }

  return (
    <div className="h-screen bg-blue-300 flex justify-center items-center">
      <Toaster />
      <div className="bg-white rounded-2xl flex flex-col gap-3 p-5">
        <p className="font-semibold text-center">Iniciar sesión</p>
        <input type="text" placeholder="Usuario" onChange={(e) => setUser({ ...user, user: e.target.value })} className="ring-0 outline-none focus:outline-none focus:ring-0 border border-gray-300 px-4 py-1 rounded-md" />
        <input type="password" placeholder="Contraseña" onChange={(e) => setUser({ ...user, password: e.target.value })} className="ring-0 outline-none focus:outline-none focus:ring-0 border border-gray-300 px-4 py-1 rounded-md" />
        <button onClick={login} className="bg-green-400 hover:bg-green-500 transition-colors duration-300 w-full py-1 rounded-lg font-semibold text-white">Iniciar sesión</button>
        <div className="flex justify-end items-end">
          <Link to='/register' className=" text-sm text-right hover:underline w-fit text-blue-500">Crear cuenta</Link>
        </div>
      </div>
    </div>
  )
}

export default Login