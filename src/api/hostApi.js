const BASE_URL = "https://localhost:7072/api/hosts";

export async function fetchHosts() {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error("Failed to fetch hosts");
    return await res.json();
}

export async function createHost(data) {
    const res = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Failed to create host");
    return await res.json();
}