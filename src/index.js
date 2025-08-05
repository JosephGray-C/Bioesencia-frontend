import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { UserProvider } from './context/UserContext';

import App from './App';

// css
import "./assets/css/homepage.css"; 
import './assets/css/fonts.css';
import './assets/css/agendar.css';
import './assets/css/calendar.css';
import './assets/css/fonts.css';
import './assets/css/styles.css';

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      {/* El UserProvider DEBE envolver App para que todo tenga acceso al contexto */}
      <UserProvider>
        <App />
      </UserProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);
