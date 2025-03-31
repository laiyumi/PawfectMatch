"use client";

import { createContext, useContext, useState, useCallback } from "react";
import FadeMessage from "../components/FadeMessage";


const GlobalMessageContext = createContext();

export const useGlobalMessage = () => useContext(GlobalMessageContext);

export function GlobalMessageProvider({ children }) {
    const [message, setMessage] = useState(null);
    const [messageKey, setMessageKey] = useState(0);

    const showMessage = useCallback(({ text, type = "success", duration = 3000 }) => {
        setMessageKey((prev) => prev + 1);
        setMessage({ text, type, duration });
    }, []);

    const clearMessage = () => setMessage(null);

    return (
        <GlobalMessageContext.Provider value={{ showMessage }}>
            {children}
            {message && (
                <FadeMessage
                    key={messageKey}
                    message={message.text}
                    type={message.type}
                    duration={message.duration}
                    onClose={clearMessage}
                />
            )}
        </GlobalMessageContext.Provider>
    );
}