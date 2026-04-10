import { createContext, useContext, useState, useEffect } from 'react';

const HostContext = createContext(null);

export const HostProvider = ({ children }) => {
    const [online, setOnline] = useState(true);
    const [isCharging, setIsCharging] = useState(true);
    const [rate, setRate] = useState(7.5);
    const [parkingFee, setParkingFee] = useState(20);
    const [sessionTime, setSessionTime] = useState(0);
    const [unitsDelivered, setUnitsDelivered] = useState(0);

    // Live session simulation
    useEffect(() => {
        if (!online || !isCharging) return;
        const t = setInterval(() => {
            setSessionTime(p => p + 1);
            setUnitsDelivered(p => parseFloat((p + 0.003).toFixed(3)));
        }, 1000);
        return () => clearInterval(t);
    }, [online, isCharging]);

    // Auto-start new mock session when online but not charging
    useEffect(() => {
        if (online && !isCharging) {
            const t = setTimeout(() => {
                setIsCharging(true);
            }, 5000);
            return () => clearTimeout(t);
        }
    }, [online, isCharging]);

    const sessionEarning = (unitsDelivered * rate).toFixed(2);

    const handleEndSession = () => {
        const finalEarning = parseFloat(sessionEarning);
        alert(`Charging Complete! ₹${finalEarning} has been added to your ChargeKaro Wallet.`);
        
        // Reset for the next demo driver
        setSessionTime(0);
        setUnitsDelivered(0);
        setIsCharging(false);
    };

    return (
        <HostContext.Provider value={{
            online, setOnline,
            isCharging, setIsCharging,
            rate, setRate,
            parkingFee, setParkingFee,
            sessionTime, setSessionTime,
            unitsDelivered, setUnitsDelivered,
            sessionEarning, handleEndSession
        }}>
            {children}
        </HostContext.Provider>
    );
};

export const useHostSession = () => useContext(HostContext);
