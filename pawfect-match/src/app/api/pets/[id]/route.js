import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";
import { handleError } from "../../../../lib/api-utils";

// Get the pet by its ID
export async function GET(request, { params }) {

    const { id } = await params;

    try {
        const pet = await prisma.pet.findUnique({
            where: { id: id },
        });
        return NextResponse.json({ success: true, data: pet });
    } catch (error) {
        return NextResponse.json(handleError(error), { status: 500 });
    }
}

// Updates a pet's information by its ID
export async function PUT(request, { params }) {

    const { id } = await params;

    try {
        const body = await request.json();
        const { status, priority } = body;

        const pet = await prisma.pet.update({
            where: { id: id },
            data: { status, priority },
            include: {
                animalType: true,
            },
        });

        return NextResponse.json({ success: true, data: pet });
    } catch (error) {
        return NextResponse.json(handleError(error), { status: 500 });
    }
}

// Delete a pet by its ID
export async function DELETE(request, { params }) {

    const { id } = await params;

    try {
        await prisma.pet.delete({
            where: { id: id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(handleError(error), { status: 500 });
    }
} 