import { useEffect, useState } from "react"
import { apiClient } from "./Helpers";
import cookie from 'js-cookie'

const App = () => {
  const [isSessionActive, setIsSessionActive] = useState(cookie.get('accessToken'))
  const [user, setUser] = useState({ name: '', password: '', user: '' })
  const [socialLinks, setSocialLinks] = useState({ facebook: '', instagram: '', youtube: '', userId: '' })
  const [action, setAction] = useState(true) //True = Iniciar sesión | False = Registrar
  const [sumResult, setSumResult] = useState(0)

  const authProcess = async () => {
    try {
      const response = await apiClient.post(!action ? '/auth/register' : '/auth/login', user);
      console.log('va response');
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

  
  const errorTest = async () => {
    try {
      const response = await apiClient.post('/suma', { one: 10, two: 23 });
      console.log('va response de suma');
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <div className='relative'>
      <div className="flex flex-col justify-center items-center absolute top-10 left-10 ">
        <button onClick={errorTest} className="font-semibold bg-white rounded-md px-5 py-1.5 mb-3 w-fit">Sumar</button>
        <p className="font-semibold">La suma es: {sumResult}</p>
      </div>
      {
        isSessionActive === undefined ? (
          <div className="h-screen bg-purple-300 flex justify-center items-center">
            <div className="bg-white rounded-2xl flex flex-col gap-3 p-5">
              <p className="font-semibold text-center">{action ? 'Iniciar sesión' : 'Registrarse'}</p>
              {!action && (<input type="text" placeholder="Nombre" onChange={(e) => setUser({ ...user, name: e.target.value })} className="ring-0 outline-none focus:outline-none focus:ring-0 border border-gray-300 px-4 py-1 rounded-md" />)}
              <input type="text" placeholder="Usuario" onChange={(e) => setUser({ ...user, user: e.target.value })} className="ring-0 outline-none focus:outline-none focus:ring-0 border border-gray-300 px-4 py-1 rounded-md" />
              <input type="password" placeholder="Contraseña" onChange={(e) => setUser({ ...user, password: e.target.value })} className="ring-0 outline-none focus:outline-none focus:ring-0 border border-gray-300 px-4 py-1 rounded-md" />
              <button onClick={authProcess} className="bg-green-400 hover:bg-green-500 transition-colors duration-300 w-full py-1 rounded-lg font-semibold text-white">{action ? 'Iniciar sesión' : 'Registrarse'}</button>
              <div className="flex justify-end items-end">
                <button onClick={() => setAction(!action)} className=" text-sm text-right hover:underline w-fit text-blue-500">{action ? 'Crear cuenta' : '¿Ya tienes una cuenta?'}</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-screen bg-blue-300 flex justify-center items-center">
            <div className="bg-white rounded-2xl flex flex-col gap-3 p-5">
              <input type="text" placeholder="Facebook" onChange={(e) => setUser({ ...user, facebook: e.target.value })} className="ring-0 outline-none focus:outline-none focus:ring-0 border border-gray-300 px-4 py-1 rounded-md" />
              <input type="text" placeholder="Instagram" onChange={(e) => setUser({ ...user, instagram: e.target.value })} className="ring-0 outline-none focus:outline-none focus:ring-0 border border-gray-300 px-4 py-1 rounded-md" />
              <input type="text" placeholder="YouTube" onChange={(e) => setUser({ ...user, youtube: e.target.value })} className="ring-0 outline-none focus:outline-none focus:ring-0 border border-gray-300 px-4 py-1 rounded-md" />
              <input type="text" placeholder="Usuario" disabled onChange={(e) => setUser({ ...user, youtube: e.target.value })} className="ring-0 outline-none focus:outline-none focus:ring-0 border border-gray-300 px-4 py-1 rounded-md" />
              <button className="bg-green-300 w-full py-1 rounded-lg font-semibold text-white">Crear</button>
            </div>
          </div>
        )
      }
    </div>
  )
}

export default App