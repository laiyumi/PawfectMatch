import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";
import { handleError } from "../../../../lib/api-utils";

// Get the animal type by its ID
export async function GET(request, { params }) {

    const { id } = await params;

    try {
        const animalType = await prisma.animalType.findUnique({
            where: { id: id },
        });

        if (!animalType) {
            return NextResponse.json({ success: false, error: "Animal type not found." }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: animalType });
    } catch (error) {
        return NextResponse.json(handleError(error), { status: 500 });
    }
}

// Delete a pet by its ID
export async function DELETE(request, { params }) {

    const { id } = await params;

    try {
        await prisma.animalType.delete({
            where: { id: id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(handleError(error), { status: 500 });
    }
} 