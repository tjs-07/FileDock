import db from "@/lib/db";

import {
    errorResponse,
    json
} from "@/lib/api-response";

import { NextResponse } from "next/server";

export const runtime = "nodejs";

export const dynamic = "force-dynamic";



export async function POST(request) {

    try {

        const body = await request.json();

        const name = body.name?.trim();

        // Validation
        if (!name) {

            return json({
                success: false,
                message: "Category name is required"
            }, 400);
        }

        // Insert category
        const [result] = await db.query(

            `INSERT INTO categories (name)
             VALUES (?)`,

            [name]
        );

        // Fetch inserted category
        const [rows] = await db.query(

            `SELECT *
             FROM categories
             WHERE id = ?`,

            [result.insertId]
        );

        return json({
            success: true,
            message: "Category Added",
            data: rows[0]
        });

    } catch (error) {

        return errorResponse(error);

    }

}




export async function GET() {

    try {

        const [categories] = await db.query(

            `SELECT *
             FROM categories
             ORDER BY created_at DESC`
        );

        return NextResponse.json(
            {
                success: true,
                data: categories
            },
            {
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