import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";
import { handleError } from "../../../lib/api-utils";

// Get all animal types
export async function GET() {
    try {
        const animalTypes = await prisma.animalType.findMany({
            include: {
                _count: {
                    select: { pets: true },
                },
            },
        });

        return NextResponse.json({ success: true, data: animalTypes });
    } catch (error) {
        return NextResponse.json(handleError(error), { status: 500 });
    }
}

// Create a new custom animal type
export async function POST(request) {
    try {
        const body = await request.json();
        const { name } = body;

        if (!name) {
            return NextResponse.json(
                { success: false, error: "Name is required" },
                { status: 400 }
            );
        }

        const animalType = await prisma.animalType.create({
            data: { name },
        });

        return NextResponse.json({ success: true, data: animalType }, { status: 201 });
    } catch (error) {
        const handled = handleError(error);
        return NextResponse.json(
            {
                success: false,
                error: handled.error || "Internal Server Error",
            },
            {
                status: handled.status || 500,
            }
        );
    }
} 