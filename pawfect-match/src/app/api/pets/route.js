import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";
import { handleError } from "../../../lib/api-utils";

// Get all pets
export async function GET() {
    try {
        const pets = await prisma.pet.findMany({
            include: {
                animalType: true,
            },
        });

        return NextResponse.json({ success: true, data: pets });
    } catch (error) {
        return NextResponse.json(handleError(error), { status: 500 });
    }
}

// Create a new pet
export async function POST(request) {
    try {
        const body = await request.json();
        const { name, status, animalTypeId, priority } = body;

        if (!name || !status || !animalTypeId) {
            return NextResponse.json(
                { success: false, error: "Name, status, and animal type are required" },
                { status: 400 }
            );
        }

        const pet = await prisma.pet.create({
            data: {
                name,
                status: status || "AVAILABLE",
                priority: priority || "MEDIUM",
                animalTypeId,
            },
            include: {
                animalType: true,
            },
        });

        return NextResponse.json({ success: true, data: pet }, { status: 201 });
    } catch (error) {
        return NextResponse.json(handleError(error), { status: 500 });
    }
} 