import connectDB from "@/lib/db";
import { errorResponse, json } from "@/lib/api-response";
import { serializeCategory } from "@/lib/serialize";
import Category from "@/models/Category";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// CREATE CATEGORY
export async function POST(request) {

    try {

        await connectDB();

        const body = await request.json();
        const name = body.name?.trim();

        if (!name) {
            return json({
                success: false,
                message: "Category name is required"
            }, 400);
        }

        const category = await Category.create({ name });

        return json({
            success: true,
            message: "Category Added",
            data: serializeCategory(category)
        });

    } catch (error) {
        return errorResponse(error);
    }
}

// GET CATEGORIES
export async function GET() {

    try {

        await connectDB();

        const categories = await Category.find()
            .sort({ createdAt: -1 })
            .lean();

        return json({
            success: true,
            data: categories.map(serializeCategory)
        });

    } catch (error) {
        return errorResponse(error);
    }
}
