import connectDB from "@/lib/db";
import Category from "@/models/Category";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { errorResponse, json } from "@/lib/api-response";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function DELETE(req, context) {

    try {

        await connectDB();

        const { id } = await context.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid category id"
                },
                { status: 400 }
            );
        }

        const deletedCategory = await Category.findByIdAndDelete(id);

        if (!deletedCategory) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Category not found"
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            deletedCategory
        });

    } catch (error) {

        return NextResponse.json(
            {
                success: false,
                message: error.message
            },
            { status: 500 }
        );

    }

}


export async function PUT(request, context) {

    try {

        await connectDB();

        const { id } = await context.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return json({
                success: false,
                message: "Invalid category id"
            }, 400);
        }

        const body = await request.json();
        const name = body.name?.trim();

        if (!name) {
            return json({
                success: false,
                message: "Category name is required"
            }, 400);
        }

        const updatedCategory =
            await Category.findByIdAndUpdate(
                id,
                {
                    name
                },
                {
                    new: true
                }
            );

        if (!updatedCategory) {
            return json({
                success: false,
                message: "Category not found"
            }, 404);
        }

        return json({
            success: true,
            data: updatedCategory
        });

    } catch (error) {

        return errorResponse(error);

    }

}
