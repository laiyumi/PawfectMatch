import { useState } from "react";
import FadeMessage from "./FadeMessage";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";

export default function TableView({
    pets,
    onStatusChange,
    onPriorityChange,
    onDelete,
}) {
    const [message, setMessage] = useState(null);
    const [messageKey, setMessageKey] = useState(0);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [petToDelete, setPetToDelete] = useState(null);
    const [editingPetId, setEditingPetId] = useState(null);
    const [editingValues, setEditingValues] = useState({});
    const [sortConfig, setSortConfig] = useState({
        key: "name",
        direction: "asc",
    });

    // Sorting function
    const sortedPets = [...pets].sort((a, b) => {
        if (!sortConfig.key) return 0;

        let aValue =
            sortConfig.key === "animalType"
                ? a.animalType.name.toLowerCase()
                : a[sortConfig.key].toLowerCase();
        let bValue =
            sortConfig.key === "animalType"
                ? b.animalType.name.toLowerCase()
                : b[sortConfig.key].toLowerCase();

        if (aValue < bValue) {
            return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
            return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
    });

    const requestSort = (key) => {
        setSortConfig((current) => ({
            key,
            direction:
                current.key === key && current.direction === "asc" ? "desc" : "asc",
        }));
    };

    const getSortIcon = (key) => {
        if (sortConfig.key !== key)
            return (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="xs:w-3 xs:h-3 lg:w-4 lg:h-4"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
                    />
                </svg>
            );
        return sortConfig.direction === "asc" ? (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="w-3 h-3 lg:w-4 lg:h-4"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18"
                />
            </svg>
        ) : (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="w-3 h-3 lg:w-4 lg:h-4"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"
                />
            </svg>
        );
    };

    const handleStatusChange = (id, newStatus) => {
        setEditingValues((prev) => ({
            ...prev,
            [id]: { ...prev[id], status: newStatus },
        }));
    };

    const handlePriorityChange = (id, newPriority) => {
        setEditingValues((prev) => ({
            ...prev,
            [id]: { ...prev[id], priority: newPriority },
        }));
    };

    const handleUpdate = async (pet) => {
        if (editingPetId === pet.id) {
            // Save changes
            try {
                const changes = editingValues[pet.id] || {};
                if (changes.status) {
                    await onStatusChange(pet.id, changes.status);
                }
                if (changes.priority) {
                    await onPriorityChange(pet.id, changes.priority);
                }
                setMessageKey((prev) => prev + 1);
                setMessage({ text: "Changes saved successfully!", type: "success" });
                setEditingPetId(null);
                setEditingValues((prev) => {
                    const newValues = { ...prev };
                    delete newValues[pet.id];
                    return newValues;
                });
            } catch (error) {
                setMessageKey((prev) => prev + 1);
                setMessage({ text: "Failed to save changes", type: "error" });
            }
        } else {
            // Start editing
            setEditingPetId(pet.id);
            setEditingValues((prev) => ({
                ...prev,
                [pet.id]: {
                    status: pet.status,
                    priority: pet.priority,
                },
            }));
        }
    };

    const handleCancel = (petId) => {
        setEditingPetId(null);
        setEditingValues((prev) => {
            const newValues = { ...prev };
            delete newValues[petId];
            return newValues;
        });
    };

    const handleDeleteClick = (pet) => {
        setPetToDelete(pet);
        setShowDeleteDialog(true);
    };

    const handleDeleteConfirm = async () => {
        setShowDeleteDialog(false);
        try {
            setMessageKey((prev) => prev + 1);
            setMessage({ text: "Pet deleted successfully!", type: "success" });
            setTimeout(() => {
                onDelete(petToDelete.id);
            }, 1000);
        } catch (error) {
            setMessageKey((prev) => prev + 1);
            setMessage({ text: "Failed to delete pet", type: "error" });
        }
        setPetToDelete(null);
    };

    return (
        <div className="overflow-x-auto">
            {message && (
                <FadeMessage
                    key={messageKey}
                    message={message.text}
                    type={message.type}
                />
            )}
            {showDeleteDialog && petToDelete && (
                <DeleteConfirmationDialog
                    isOpen={showDeleteDialog}
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => {
                        setShowDeleteDialog(false);
                        setPetToDelete(null);
                    }}
                    petName={petToDelete.name}
                />
            )}

            {pets.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    No pets found matching your search criteria
                </div>
            ) : (
                <table className="table xs:table-xs sm:table-sm md:table-md">
                    <thead>
                        <tr>
                            <th
                                className="cursor-pointer hover:bg-base-200 xs:text-xs lg:text-base"
                                onClick={() => requestSort("name")}
                            >
                                <span className="inline-flex items-center gap-1">
                                    Name {getSortIcon("name")}
                                </span>                            </th>
                            <th
                                className="cursor-pointer hover:bg-base-200 xs:text-xs lg:text-base"
                                onClick={() => requestSort("animalType")}
                            >
                                <span className="inline-flex items-center gap-1">

                                    Animal Type {getSortIcon("animalType")}
                                </span>
                            </th>
                            <th
                                className="cursor-pointer hover:bg-base-200 xs:text-xs lg:text-base"
                                onClick={() => requestSort("status")}
                            >
                                <span className="inline-flex items-center gap-1">

                                    Status {getSortIcon("status")}
                                </span>
                            </th>
                            <th
                                className="cursor-pointer hover:bg-base-200 xs:text-xs lg:text-base"
                                onClick={() => requestSort("priority")}
                            >
                                <span className="inline-flex items-center gap-1">

                                    Priority {getSortIcon("priority")}
                                </span>
                            </th>
                            <th className="xs:text-xs lg:text-base">Update</th>
                            <th className="xs:text-xs lg:text-base">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="xs:text-xs lg:text-base">
                        {sortedPets.map((pet) => {
                            const editValues = editingValues[pet.id] || {};
                            return (
                                <tr key={pet.id}>
                                    <td>{pet.name}</td>
                                    <td>{pet.animalType.name}</td>
                                    <td>
                                        <select
                                            value={editValues.status || pet.status}
                                            onChange={(e) =>
                                                handleStatusChange(pet.id, e.target.value)
                                            }
                                            className="select select-bordered lg:select-sm xs:select-xs"
                                            disabled={editingPetId !== pet.id}
                                        >
                                            <option value="AVAILABLE">Available</option>
                                            <option value="ADOPTED">Adopted</option>
                                            <option value="IN_CARE">In Care</option>
                                        </select>
                                    </td>
                                    <td>
                                        <select
                                            value={editValues.priority || pet.priority}
                                            onChange={(e) =>
                                                handlePriorityChange(pet.id, e.target.value)
                                            }
                                            className="select select-bordered lg:select-sm xs:select-xs"
                                            disabled={editingPetId !== pet.id}
                                        >
                                            <option value="LOW">Low</option>
                                            <option value="MEDIUM">Medium</option>
                                            <option value="HIGH">High</option>
                                        </select>
                                    </td>
                                    <td>
                                        <div className="flex gap-2">
                                            {editingPetId === pet.id ? (
                                                <>
                                                    <button
                                                        className="btn btn-success lg:btn-sm xs:btn-xs"
                                                        onClick={() => handleUpdate(pet)}
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        className="btn btn-ghost lg:btn-sm xs:btn-xs"
                                                        onClick={() => handleCancel(pet.id)}
                                                    >
                                                        Cancel
                                                    </button>
                                                </>
                                            ) : (
                                                <button
                                                    className="btn btn-info lg:btn-sm xs:btn-xs"
                                                    onClick={() => handleUpdate(pet)}
                                                >
                                                    Update
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-error lg:btn-sm xs:btn-xs"
                                            onClick={() => handleDeleteClick(pet)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
        </div>
    );
}
