import { NextResponse } from "next/server";

export function json(data, status = 200) {
    return NextResponse.json(data, { status });
}

export function errorResponse(error) {
    return json({
        success: false,
        message: error.message
    }, 500);
}
