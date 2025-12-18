import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const pageNumber = searchParams.get("pageNumber");
    const pageSize = searchParams.get("pageSize");
    const accessToken = request.cookies.get("accessToken")?.value;
    try {

        const backendUrl = new URL(
          `${process.env.BE_API_URL}/RecordCharge/list`
        );
        if (pageNumber) {
          backendUrl.searchParams.set("pageNumber", pageNumber);
        }
        if (pageSize) {
          backendUrl.searchParams.set("pageSize", pageSize);
        }
        const backendResponse = await fetch(backendUrl.toString(), {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });
        const data = await backendResponse.json();
        if (!backendResponse.ok) {
            return NextResponse.json({ message: data.message }, { status: backendResponse.status });
        }
        return NextResponse.json(data, { status: 200 });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ message: error.message }, { status: 500 });
        }
        return NextResponse.json({ message: "Failed to fetch record charge" }, { status: 500 });
    }
}
export async function POST (request: NextRequest) {
    const accessToken = request.cookies.get("accessToken")?.value;
    const body = await request.json();
    try {
        const backendResponse = await fetch(
            `${process.env.BE_API_URL}/RecordCharge/create`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(body),
            }
        );
        const data = await backendResponse.json();
        if (!backendResponse.ok) {
            return NextResponse.json({ message: data.message }, { status: backendResponse.status });
        }
        return NextResponse.json(data, { status: 200 });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ message: error.message }, { status: 500 });
        }
        return NextResponse.json({ message: "Failed to create record charge" }, { status: 500 });
    }
}