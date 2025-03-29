import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    // Create initial animal types
    const animalTypes = ["Dog", "Cat", "Rabbit", "Bird", "Fish"];

    for (const type of animalTypes) {
        await prisma.animalType.upsert({
            where: { name: type },
            update: {},
            create: { name: type },
        });
    }

    // Get created animal types for reference
    const dogType = await prisma.animalType.findUnique({
        where: { name: "Dog" },
    });
    const catType = await prisma.animalType.findUnique({
        where: { name: "Cat" },
    });
    const rabbitType = await prisma.animalType.findUnique({
        where: { name: "Rabbit" },
    });

    // Create mock pets
    const mockPets = [
        {
            name: "Max",
            status: "AVAILABLE",
            priority: "HIGH",
            animalTypeId: dogType.id,
        },
        {
            name: "Luna",
            status: "AVAILABLE",
            priority: "MEDIUM",
            animalTypeId: catType.id,
        },
        {
            name: "Buddy",
            status: "ADOPTED",
            priority: "LOW",
            animalTypeId: dogType.id,
        },
        {
            name: "Whiskers",
            status: "IN_CARE",
            priority: "HIGH",
            animalTypeId: catType.id,
        },
        {
            name: "Hoppy",
            status: "AVAILABLE",
            priority: "MEDIUM",
            animalTypeId: rabbitType.id,
        },
    ];

    // Insert mock pets
    for (const pet of mockPets) {
        await prisma.pet.create({
            data: pet,
        });
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    }); 