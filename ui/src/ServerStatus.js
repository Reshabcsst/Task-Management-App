import React, { useState, useEffect } from 'react';
import Host from './Utils/Utils';

const ServerStatus = ({ children }) => {
    const [isServerConnected, setIsServerConnected] = useState(null);

    useEffect(() => {
        const checkServerConnection = async () => {
            try {
                const response = await fetch(`${Host}/api/check`);
                if (response.ok) {
                    setIsServerConnected(true);
                } else {
                    setIsServerConnected(false);
                }
            } catch (error) {
                setIsServerConnected(false);
            }
        };

        checkServerConnection();
    }, []);

    if (isServerConnected === null) {
        return <div className='loading'>Loading...</div>;
    }

    if (!isServerConnected) {
        return <div className='server-error'>Server connection failed. Please try again later.</div>;
    }

    return <>{children}</>;
};

export default ServerStatus;
