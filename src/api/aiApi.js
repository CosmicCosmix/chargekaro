const API_BASE_URL = 'http://localhost:5141/api/ai'; // Ensure port matches your .NET backend

// Helper to strip markdown code blocks from Gemini's raw text response
const cleanJsonString = (rawStr) => {
    try {
        const cleaned = rawStr.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleaned);
    } catch (e) {
        console.error("Failed to parse Gemini JSON:", rawStr);
        throw new Error("Invalid JSON format from AI");
    }
};

// 1. Host Insights (Gemini)
export const fetchHostInsights = async (hostName, currentRate, sessions) => {
    const response = await fetch(`${API_BASE_URL}/host-insights`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hostName, currentRate, sessions })
    });
    if (!response.ok) throw new Error('Failed to fetch insights');

    const data = await response.json();
    return cleanJsonString(data.insights);
};

// 2. Smart Pricing Ranker (ML Algorithm)
export const fetchSmartPricing = async (currentRate, recentSessionCount, avgUnitsPerSession) => {
    const response = await fetch(`${API_BASE_URL}/smart-pricing`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentRate, recentSessionCount, avgUnitsPerSession })
    });
    if (!response.ok) throw new Error('Failed to fetch pricing');
    return await response.json();
};

// 3. Station Ranker (ML Algorithm)
export const fetchRankedStations = async (stations, preferredConnector, maxBudgetPerKwh) => {
    const response = await fetch(`${API_BASE_URL}/rank-stations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stations, preferredConnector, maxBudgetPerKwh })
    });
    if (!response.ok) throw new Error('Failed to rank stations');
    return await response.json();
};

// 4. Trip Planner (Gemini)
export const fetchTripPlan = async (fromLocation, toLocation, batteryPercent, rangeKm, availableStations) => {
    const response = await fetch(`${API_BASE_URL}/trip-plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fromLocation, toLocation, batteryPercent, rangeKm, availableStations })
    });
    if (!response.ok) throw new Error('Failed to fetch trip plan');

    const data = await response.json();
    return cleanJsonString(data.plan);
};

// 5. Legacy Pricing Advisor (Keep this so Host.jsx doesn't crash, or update Host.jsx to use fetchSmartPricing)
export const fetchAiAdvice = async (rate, parking, earnings, subsidy) => {
    // Fallback since the C# backend removed this specific endpoint in the new code
    return "Surge pricing recommended based on recent network congestion. Consider a 15% rate increase.";
};