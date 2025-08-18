import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { UserProvider } from './context/UserContext';
import App from './App';

// css
import './assets/css/homepage.css';
import './assets/css/fonts.css';
import './assets/css/calendar.css';
import './assets/css/styles.css';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 0,            // Data is always considered stale (fetches every time)
            gcTime: 4 * 60 * 1000,       // 4 min: cache stays in memory for less time
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
