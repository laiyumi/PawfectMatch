import { useState } from "react";

export default function PetCard({ pet, onStatusChange, onPriorityChange, onDelete }) {
    const [isEditing, setIsEditing] = useState(false);

    const statusColors = {
        AVAILABLE: "badge-success",
        ADOPTED: "badge-info",
        IN_CARE: "badge-warning"
    };

    const priorityColors = {
        LOW: "badge-ghost",
        MEDIUM: "badge-warning",
        HIGH: "badge-error"
    };

    return (
        <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
                <h2 className="card-title">{pet.name}</h2>
                <p className="text-sm text-gray-500">{pet.animalType.name}</p>

                <div className="flex gap-2 my-2">
                    <span className={`badge ${statusColors[pet.status]}`}>
                        {pet.status}
                    </span>
                    <span className={`badge ${priorityColors[pet.priority]}`}>
                        {pet.priority}
                    </span>
                </div>

                {isEditing ? (
                    <div className="flex flex-col gap-2">
                        <select
                            value={pet.status}
                            onChange={(e) => onStatusChange(pet.id, e.target.value)}
                            className="select select-bordered w-full"
                        >
                            <option value="AVAILABLE">Available</option>
                            <option value="ADOPTED">Adopted</option>
                            <option value="IN_CARE">In Care</option>
                        </select>

                        <select
                            value={pet.priority}
                            onChange={(e) => onPriorityChange(pet.id, e.target.value)}
                            className="select select-bordered w-full"
                        >
                            <option value="LOW">Low</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HIGH">High</option>
                        </select>
                    </div>
                ) : null}

                <div className="card-actions justify-end mt-4">
                    <button
                        className="btn btn-sm btn-outline"
                        onClick={() => setIsEditing(!isEditing)}
                    >
                        {isEditing ? "Done" : "Edit"}
                    </button>
                    <button
                        className="btn btn-sm btn-error"
                        onClick={() => onDelete(pet.id)}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
} 