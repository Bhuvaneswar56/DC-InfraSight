import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { store } from './redux/store.js';
import { Provider } from 'react-redux';
import { WebSocketProvider } from './contexts/WebSocketContext.jsx';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <WebSocketProvider>
                    <App />
                </WebSocketProvider>
            </BrowserRouter>
        </Provider>
    </StrictMode>
);