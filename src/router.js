// Imports
import { createBrowserRouter } from 'react-router-dom';

// Importing pages
import Home from './components/Home';
import Auth from './components/Auth';
import NotFound from './components/NotFound';
import About from './components/About';
import Agendar from './components/Agendar';


import Layout from './components/templates/Layout';

// Route configuration
const router = createBrowserRouter([

    {
        path: '/',
        element: <Layout/>,
        errorElement: <NotFound/>,
        children: 
        [
            {   
                index: true,
                element: <Home/>,
            },
            {
                path: 'about',
                element: <About/>,
            },
            {
                path: 'agendar',
                element: <Agendar/>
            },
            {
                path: 'login',
                element: <Auth/>,
            }
        ],
    }

]);

export default router;