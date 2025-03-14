export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const hour = searchParams.get("hour");
  
    if (!hour || isNaN(hour) || hour < 0 || hour > 23) {
      return new Response(JSON.stringify({ error: "Invalid hour input." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
  
    try {
      const backendResponse = await fetch(`http://localhost:8000/predict?hour=${hour}`);
      if (!backendResponse.ok) {
        return new Response(JSON.stringify({ error: "No doctors available at this time." }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }
  
      const blob = await backendResponse.blob();
      return new Response(blob, {
        status: 200,
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": "attachment; filename=predicted_doctors.csv",
        },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: "Server error." }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }
  