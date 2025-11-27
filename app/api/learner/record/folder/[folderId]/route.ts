import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ folderId: string }> }
) {
    const accessToken = request.cookies.get("accessToken")?.value;
    const { folderId } = await params;
    if (!folderId) {
        return NextResponse.json({ message: "Folder ID is required" }, { status: 400 });
    }
    const apiUrl = process.env.BE_API_URL;
    if (!apiUrl) {
        return NextResponse.json(
            { message: "API URL is not configured" },
            { status: 500 }
        );
    }
    try {
        const response = await fetch(`${apiUrl}/Record/${folderId}/mine`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            credentials: "include",
        });
        const data = await response.json();
        if (!response.ok) {
            return NextResponse.json({ message: data.message }, { status: response.status });
        }
        return NextResponse.json(data, { status: 200 });
    }
    catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ message: error.message }, { status: 500 });
        }
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ folderId: string }> }
) {
    const accessToken = request.cookies.get("accessToken")?.value;
    const { folderId } = await params;
    const body = await request.json();
    if (!folderId) {
        return NextResponse.json({ message: "Folder ID is required" }, { status: 400 });
    }
    const apiUrl = process.env.BE_API_URL;
    if (!apiUrl) {
        return NextResponse.json(
            { message: "API URL is not configured" },
            { status: 500 }
        );
    }
    try {
            const response = await fetch(`${apiUrl}/Record/${folderId}/create-content-only`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(body),
            credentials: "include",
        });
        const data = await response.json();
        if (!response.ok) {
            return NextResponse.json({ message: data.message }, { status: response.status });
        }
        return NextResponse.json(data, { status: 200 });
    }
    catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ message: error.message }, { status: 500 });
        }
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

