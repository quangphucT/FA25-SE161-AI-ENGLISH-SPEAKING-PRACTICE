export async function GET(req: Request) {
  const searchParams = new URL(req.url).searchParams;
  const level = searchParams.get("level");
  const accessToken = req.headers.get("cookie")?.split("accessToken=")[1]?.split(";")[0];
  if (!level) {
    return new Response(JSON.stringify({ message: "Level is required" }), {
      status: 400,
    });
  }
  if (!accessToken) {
    return new Response(JSON.stringify({ message: "Access token is required" }), {
      status: 401,
    });
  }
  try {
    const backendResponse = await fetch(
      `${process.env.BE_API_URL}/CourseLearner/level/full?level=${level}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const data = await backendResponse.json();
    if (!backendResponse.ok) {
      return new Response(JSON.stringify(data), {
        status: backendResponse.status,
      });
    }
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return new Response(
        JSON.stringify({ message: error.message || "Get courses failed" }),
        { status: 500 }
      );
    }
    return new Response(JSON.stringify({ message: "Get courses failed" }), {
      status: 500,
    });
  }
}
