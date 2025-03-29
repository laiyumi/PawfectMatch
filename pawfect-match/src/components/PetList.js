import { useState } from "react";
import PetCard from "./PetCard";

export default function PetList({ pets, onStatusChange, onPriorityChange, onDelete }) {
    const [currentPage, setCurrentPage] = useState(1);
    const petsPerPage = 6;

    const indexOfLastPet = currentPage * petsPerPage;
    const indexOfFirstPet = indexOfLastPet - petsPerPage;
    const currentPets = pets.slice(indexOfFirstPet, indexOfLastPet);
    const totalPages = Math.ceil(pets.length / petsPerPage);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentPets.map((pet) => (
                    <PetCard
                        key={pet.id}
                        pet={pet}
                        onStatusChange={onStatusChange}
                        onPriorityChange={onPriorityChange}
                        onDelete={onDelete}
                    />
                ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-8 gap-2">
                <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="btn btn-circle btn-outline"
                >
                    ←
                </button>
                <span className="flex items-center px-4">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="btn btn-circle btn-outline"
                >
                    →
                </button>
            </div>
        </div>
    );
} 