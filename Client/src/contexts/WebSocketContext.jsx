import React, { createContext, useState, useContext } from 'react';

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
    const [isServerRunning, setIsServerRunning] = useState(false);
    const [isConnected, setIsConnected] = useState(false);

    const value = {
        isServerRunning,
        setIsServerRunning,
        isConnected,
        setIsConnected
    };

    return (
        <WebSocketContext.Provider value={value}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error('useWebSocket must be used within a WebSocketProvider');
    }
    return context;
};