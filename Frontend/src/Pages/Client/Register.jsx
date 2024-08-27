import { useState } from 'react'
import { Link } from 'react-router-dom'
import { apiClient } from "../../Helpers";
import { Toaster } from 'react-hot-toast'

const Register = () => {
  const [user, setUser] = useState({ name: '', password: '', user: '' })

  const register = async () => {
    try {
      const response = await apiClient.post('/auth/login', user);
      console.log('va response');
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="h-screen bg-purple-300 flex justify-center items-center">
      <Toaster />
      <div className="bg-white rounded-2xl flex flex-col gap-3 p-5">
        <p className="font-semibold text-center">Registrarse</p>
        <input type="text" placeholder="Nombre" onChange={(e) => setUser({ ...user, name: e.target.value })} className="ring-0 outline-none focus:outline-none focus:ring-0 border border-gray-300 px-4 py-1 rounded-md" />
        <input type="text" placeholder="Usuario" onChange={(e) => setUser({ ...user, user: e.target.value })} className="ring-0 outline-none focus:outline-none focus:ring-0 border border-gray-300 px-4 py-1 rounded-md" />
        <input type="password" placeholder="Contraseña" onChange={(e) => setUser({ ...user, password: e.target.value })} className="ring-0 outline-none focus:outline-none focus:ring-0 border border-gray-300 px-4 py-1 rounded-md" />
        <button onClick={register} className="bg-green-400 hover:bg-green-500 transition-colors duration-300 w-full py-1 rounded-lg font-semibold text-white">Registrarse</button>
        <div className="flex justify-end items-end">
          <Link to='/login' className=" text-sm text-right hover:underline w-fit text-blue-500">¿Ya tienes una cuenta?</Link>
        </div>
      </div>
    </div>
  )
}

export default Register