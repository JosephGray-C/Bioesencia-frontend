import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { UserProvider } from './context/UserContext';
import App from './App';

// css
import './assets/css/Fonts.css';
import './assets/css/Styles.css';
import './assets/css/Blog.css';
import './assets/css/Agendar.css';
import './assets/css/Taller.css';
import './assets/css/Calendario.css';
import './assets/css/Producto.css';
import './assets/css/Header.css';
import './assets/css/Carrito.css';
import './assets/css/AdminLayout.css';
import './assets/css/Title.css';
import './assets/css/List.css';
import './assets/css/Card.css';
import './assets/css/BlogPreview.css';
import './assets/css/BlogForm.css';
import './assets/css/ProductoModal.css';
import './assets/css/TallerModal.css';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 0,
            gcTime: 4 * 60 * 1000,
            refetchOnWindowFocus: true,
            retry: 1,
        },
        mutations: {
            retry: 0,
        },
    },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <UserProvider>
                <App />
            </UserProvider>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    </React.StrictMode>
);
