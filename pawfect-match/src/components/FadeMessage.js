import { useEffect, useState } from 'react';

export default function FadeMessage({ message, type = 'success', duration = 3000 }) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration]);

    if (!isVisible) return null;

    const alertClass = type === 'error' ? 'alert-error' : 'alert-success';

    return (
        <div className={`alert ${alertClass} fixed top-4 right-4 w-auto max-w-sm transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <span>{message}</span>
        </div>
    );
} 