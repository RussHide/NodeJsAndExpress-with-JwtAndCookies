import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom"
import { apiClient } from "../../Helpers";

const Home = () => {
    const navigate = useNavigate()
    const logOut = () => {
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


    return (
        <div className="flex flex-col justify-center items-center gap-3">
            <Link to='/social' className=" text-sm text-right hover:underline w-fit text-blue-500">Ir a social</Link>
            <button onClick={logOut} className="font-semibold text-sm  w-full rounded-lg bg-white px-6 py-1.5 ">Salir</button>
        </div>
    )
}

export default Home