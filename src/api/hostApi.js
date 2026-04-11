const API_BASE_URL = 'http://localhost:5141/api'; // Ensure this matches your .NET project's launch settings

/**
 * Fetches all available charging hosts for the driver map [cite: 176, 211]
 */
export const fetchHosts = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/hosts`);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error("Error fetching hosts:", error);
        throw error;
    }
};

/**
 * Creates a new host entry when a user lists their spot [cite: 395, 397]
 */
export const createHost = async (hostData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/hosts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(hostData),
        });
        if (!response.ok) throw new Error('Failed to create host');
        return await response.json();
    } catch (error) {
        console.error("Error creating host:", error);
        throw error;
    }
};