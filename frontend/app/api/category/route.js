import connectDB from "@/lib/db";
import Category from "@/models/Category";
import { NextResponse } from "next/server";
import { errorResponse, json } from "@/lib/api-response";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const runtime = "nodejs";

export async function POST(request) {

    try {

        await connectDB();

        const body = await request.json();

        const category = new Category({
            name: body.name
        });

        await category.save();

        return json({
            success: true,
            message: "Category Added",
            data: category
        });

    } catch (error) {

        return errorResponse(error);

    }

}

export async function GET() {

    try {

        await connectDB();

        const categories = await Category.find().sort({ createdAt: -1 });

        return NextResponse.json(
            {
                success: true,
                data: categories
            },
            {
                status: 200,
                headers: {
                    "Cache-Control": "no-store"
                }
            }
        );

    } catch (error) {

        return NextResponse.json({
            success: false,
            message: error.message
        });

    }

}