// Imports
import { createBrowserRouter } from 'react-router-dom';

// Importing pages
import Layout from './pages/templates/Layout';
import NotFoundPage from './pages/NotFoundPage';
import Home from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import UsersPage from './pages/UsersPage';

// Route configuration
const router = createBrowserRouter([

    {
        path: '/',
        element: <Layout/>,
        errorElement: <NotFoundPage/>,
        children: 
        [
            {   
                index: true,
                element: <Home/>,
            },
            {
                path: 'about',
                element: <AboutPage/>,
            },
            {
                path: 'users',
                element: <UsersPage/>
            }
        ],
    }

]);

export default router;