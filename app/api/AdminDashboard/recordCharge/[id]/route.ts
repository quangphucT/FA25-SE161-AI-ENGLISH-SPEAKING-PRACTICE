import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const accessToken = request.cookies.get("accessToken")?.value;
    const { id } = await params;
    try {
        const backendResponse = await fetch(`${process.env.BE_API_URL}/RecordCharge/detail/${id}`, {
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
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {  
    const accessToken = request.cookies.get("accessToken")?.value;
    const { id } = await params;
    const body = await request.json();
    try {
        const backendResponse = await fetch(`${process.env.BE_API_URL}/RecordCharge/update/${id}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
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
        return NextResponse.json({ message: "Failed to update record charge" }, { status: 500 });
    }
}
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const accessToken = request.cookies.get("accessToken")?.value;
    const { id } = await params;
    try {
        const backendResponse = await fetch(`${process.env.BE_API_URL}/RecordCharge/delete/${id}`, {
            method: "DELETE",
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
        return NextResponse.json({ message: "Failed to delete record charge" }, { status: 500 });
    }
}
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const accessToken = request.cookies.get("accessToken")?.value;
    const { id } = await params;
    try {
        const backendResponse = await fetch(`${process.env.BE_API_URL}/RecordCharge/status/${id}`, {
            method: "PATCH",
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
        return NextResponse.json({ message: "Failed to patch record charge" }, { status: 500 });
    }
}