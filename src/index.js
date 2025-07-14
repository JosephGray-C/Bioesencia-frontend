import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { UserProvider } from './context/UserContext';

import { RouterProvider } from 'react-router-dom';
import router  from './router';

// css
import './assets/css/header.css';
import './assets/css/footer.css';
import './assets/css/login.css';
import './assets/css/fonts.css';
import "./assets/css/homepage.css"; 
import './assets/css/agendar.css';
import './assets/css/calendar.css';

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      {/* El UserProvider DEBE envolver App para que todo tenga acceso al contexto */}
      <UserProvider>
        <RouterProvider router={router} />
      </UserProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);
