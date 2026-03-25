export async function generateEventPlan(data: {
  event_type: string;
  guests: number;
  budget: number;
  user_query?: string;
}) {
  try {
    const response = await fetch("http://127.0.0.1:5000/generate-plan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

console.log("API RESPONSE:", result); // 🔥 VERY IMPORTANT

if (result.status !== "success") {
  throw new Error(result.message || "Backend error");
}

return result;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}