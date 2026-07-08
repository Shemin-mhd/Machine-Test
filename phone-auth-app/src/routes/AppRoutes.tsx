import { createBrowserRouter } from 'react-router-dom';
import Login from '../pages/Login/Login';
import OTP from '../pages/OTP/OTP';
import Register from '../pages/Register/Register';
import Home from '../pages/Home/Home';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/home',
    element: <Home />,
  },
  {
    path: '/Home',
    element: <Home />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/otp',
    element: <OTP />,
  },
  {
    path: '/register',
    element: <Register />,
  },
]);

export default router;
