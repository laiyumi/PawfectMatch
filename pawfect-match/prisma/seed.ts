import { PrismaClient, Priority, Status } from "@prisma/client";

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
      status: Status.AVAILABLE,
      priority: Priority.HIGH,
      animalTypeId: dogType!.id,
    },
    {
      name: "Luna",
      status: Status.AVAILABLE,
      priority: Priority.MEDIUM,
      animalTypeId: catType!.id,
    },
    {
      name: "Buddy",
      status: Status.ADOPTED,
      priority: Priority.LOW,
      animalTypeId: dogType!.id,
    },
    {
      name: "Whiskers",
      status: Status.IN_CARE,
      priority: Priority.HIGH,
      animalTypeId: catType!.id,
    },
    {
      name: "Hoppy",
      status: Status.AVAILABLE,
      priority: Priority.MEDIUM,
      animalTypeId: rabbitType!.id,
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
