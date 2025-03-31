-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('AVAILABLE', 'ADOPTED', 'IN_CARE');

-- CreateTable
CREATE TABLE "Pet" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'AVAILABLE',
    "priority" "Priority" NOT NULL DEFAULT 'MEDIUM',
    "animalTypeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnimalType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AnimalType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AnimalType_name_key" ON "AnimalType"("name");

-- AddForeignKey
ALTER TABLE "Pet" ADD CONSTRAINT "Pet_animalTypeId_fkey" FOREIGN KEY ("animalTypeId") REFERENCES "AnimalType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
