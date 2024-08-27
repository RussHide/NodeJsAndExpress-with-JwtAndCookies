import { useEffect } from "react"
import { Toaster } from "react-hot-toast"
import { Outlet, useNavigate } from "react-router-dom"
import { apiClient } from "../../Helpers";

const Layout = () => {
   
    return (
        <div className="h-screen bg-green-300 flex justify-center items-center">
            <Toaster />
            <Outlet />
        </div>
    )
}

export default Layout