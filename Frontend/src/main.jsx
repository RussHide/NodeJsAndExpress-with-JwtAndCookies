import { StrictMode, useEffect } from 'react'
import './index.css'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter, useLocation, useNavigate } from 'react-router-dom'
import { Layout, Login, Register, Social, Home } from './Pages/Client'
import { apiClient } from './Helpers'


const IsLoggedIn = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    (async () => {
      try {
        const { data: { status } } = await apiClient.post('/auth/verifySession', {});
        if (!status) {
          navigate('/login');
        } else {
          // Redirige a /home solo si la sesión está activa y estás en /login o /register
          (status && (location.pathname === '/login' || location.pathname === '/register')) && navigate('/home');
        }
      } catch (error) {
        console.log(error);
        navigate('/login')
      }
    })()
  }, [])

  return children
}

const router = createBrowserRouter([
  { path: 'login', element: <IsLoggedIn><Login /></IsLoggedIn> },
  { path: 'register', element: <IsLoggedIn><Register /></IsLoggedIn> },
  {
    path: '/',
    element: <IsLoggedIn><Layout /></IsLoggedIn>,
    children: [
      { path: 'home', element: <Home /> },
      { path: 'social', element: <Social /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)


