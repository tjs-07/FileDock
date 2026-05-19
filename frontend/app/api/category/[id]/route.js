import connectDB from "@/lib/db";
import Category from "@/models/Category";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function DELETE(req, context) {

    try {

        await connectDB();

        const id = context.params.id;

        console.log("DELETE ID:", id);

        const deletedCategory = await Category.findByIdAndDelete(id);

        console.log("DELETED:", deletedCategory);

        return NextResponse.json({
            success: true,
            deletedCategory
        });

    } catch (error) {

        console.log(error);

        return NextResponse.json({
            success: false,
            message: error.message
        });

    }

}