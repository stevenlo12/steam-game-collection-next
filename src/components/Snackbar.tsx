import React, { useEffect, useState } from 'react';
import * as Icons from "heroicons-react";

export interface SnackbarProps {
    message: string;
    type?: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
    onClose?: () => void;
    show: boolean;
}

export const Snackbar: React.FC<SnackbarProps> = ({
    message,
    type = 'info',
    duration = 3000,
    onClose,
    show
}) => {
    const [isVisible, setIsVisible] = useState(show);

    useEffect(() => {
        setIsVisible(show);

        if (show && duration > 0) {
            const timer = setTimeout(() => {
                setIsVisible(false);
                onClose?.();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [show, duration, onClose]);

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <Icons.CheckCircle size={20} className="text-green-500" />;
            case 'error':
                return <Icons.XCircle size={20} className="text-red-500" />;
            case 'warning':
                return <Icons.Exclamation size={20} className="text-yellow-500" />;
            default:
                return <Icons.InformationCircle size={20} className="text-blue-500" />;
        }
    };

    const getBackgroundColor = () => {
        switch (type) {
            case 'success':
                return 'bg-green-50 border-green-200';
            case 'error':
                return 'bg-red-50 border-red-200';
            case 'warning':
                return 'bg-yellow-50 border-yellow-200';
            default:
                return 'bg-blue-50 border-blue-200';
        }
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
            <div className={`flex items-center space-x-3 px-4 py-3 rounded-lg shadow-lg border ${getBackgroundColor()} max-w-sm`}>
                {getIcon()}
                <span className="text-gray-800 font-medium">{message}</span>
                <button
                    onClick={() => {
                        setIsVisible(false);
                        onClose?.();
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <Icons.X size={16} />
                </button>
            </div>
        </div>
    );
};

export default Snackbar;
