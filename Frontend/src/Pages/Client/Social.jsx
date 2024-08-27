import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react";
import { apiClient } from "../../Helpers";

const Social = () => {
  const [socialLinks, setSocialLinks] = useState({ facebook: '', instagram: '', youtube: '', userId: '' })
  const [action, setAction] = useState('add')
  const navigate = useNavigate()

  const getSocial = () => {

  }

  const addSocial = () => {
    toast.promise(
      (async () => {
        try {
          await apiClient.post('/auth/logout');
          navigate('/login')
        } catch (error) {
          throw error.response?.data || 'An unexpected error occurred'
        }
      })(),
      { loading: 'Logging out', success: 'Log out successful', error: (error) => error.message },
      { position: 'top-right', duration: 2500 }
    );
  }


  const editSocial = () => {

  }


  const deleteSocial = () => {

  }


  return (
    <div className="flex flex-col justify-center items-center gap-3">
      <div className="flex flex-col justify-center items-center gap-3">
        <input type="text" onChange={(e) => setSocialLinks({ ...socialLinks, facebook: e.target.value })} className="rounded-md px-3 py-1 ring-0 outline-none focus:outline-none focus:ring-0" placeholder="Facebook" />
        <input type="text" onChange={(e) => setSocialLinks({ ...socialLinks, youtube: e.target.value })} className="rounded-md px-3 py-1 ring-0 outline-none focus:outline-none focus:ring-0" placeholder="Youtube" />
        <input type="text" onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value })} className="rounded-md px-3 py-1 ring-0 outline-none focus:outline-none focus:ring-0" placeholder="Instagram" />
      </div>
      <Link to='/home' className=" text-sm text-right hover:underline w-fit text-blue-500">Ir a home</Link>
      <div className="w-full flex justify-center items-center gap-5">
      <button onClick={addSocial} className="w-[90%] font-semibold text-sm rounded-lg bg-white px-6 py-1.5 ">Crear redes </button>
      <button onClick={addSocial} className="w-[10%] font-semibold text-center text-sm rounded-lg bg-white px-6 py-1.5 ">X</button>

      </div>
    </div>
  )
}

export default Social