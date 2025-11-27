import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const { searchParams } = new URL(request.url);

  try {
    // Build backend URL for Excel export
    const backendUrl = new URL(
      `${process.env.BE_API_URL}/AdminPurchase/export-pdf`
    );

    // Forward query parameters to backend
    searchParams.forEach((value, key) => {
      backendUrl.searchParams.set(key, value);
    });

    const backendResponse = await fetch(backendUrl.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
      credentials: "include",
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      return NextResponse.json(
        { message: errorData.message || "Failed to export Excel file" },
        { status: backendResponse.status }
      );
    }

    // Get the Excel file as buffer
    const excelBuffer = await backendResponse.arrayBuffer();

    // Get filename from Content-Disposition header or use default
    const contentDisposition = backendResponse.headers.get("content-disposition");
    let filename = `purchases-${new Date().toISOString().split("T")[0]}.xlsx`;
    
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1].replace(/['"]/g, "");
      }
    }

    // Forward the Excel file with proper headers
    return new NextResponse(excelBuffer, {
      status: 200,
      headers: {
        "Content-Type": backendResponse.headers.get("content-type") || 
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error: unknown) {
    console.error("Error exporting Excel file:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { message: error.message || "Failed to export Excel file" },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: "Failed to export Excel file" },
      { status: 500 }
    );
  }
}

