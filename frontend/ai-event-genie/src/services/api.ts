export async function generateEventPlan(data: {
  event_type: string;
  guests: number;
  budget: number;
}) {
  try {
    const response = await fetch("http://127.0.0.1:5000/generate-plan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}