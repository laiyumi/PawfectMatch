import { useState } from "react";
import FadeMessage from "./FadeMessage";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";

export default function TableView({ pets, onStatusChange, onPriorityChange, onDelete }) {
    const [message, setMessage] = useState(null);
    const [messageKey, setMessageKey] = useState(0);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [petToDelete, setPetToDelete] = useState(null);
    const [editingPetId, setEditingPetId] = useState(null);
    const [editingValues, setEditingValues] = useState({});
    const [sortConfig, setSortConfig] = useState({
        key: 'name',
        direction: 'asc'
    });

    // Sorting function
    const sortedPets = [...pets].sort((a, b) => {
        if (!sortConfig.key) return 0;

        let aValue = sortConfig.key === 'animalType'
            ? a.animalType.name.toLowerCase()
            : a[sortConfig.key].toLowerCase();
        let bValue = sortConfig.key === 'animalType'
            ? b.animalType.name.toLowerCase()
            : b[sortConfig.key].toLowerCase();

        if (aValue < bValue) {
            return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
            return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
    });

    const requestSort = (key) => {
        setSortConfig(current => ({
            key,
            direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return '↕️';
        return sortConfig.direction === 'asc' ? '↑' : '↓';
    };

    const handleStatusChange = (id, newStatus) => {
        setEditingValues(prev => ({
            ...prev,
            [id]: { ...prev[id], status: newStatus }
        }));
    };

    const handlePriorityChange = (id, newPriority) => {
        setEditingValues(prev => ({
            ...prev,
            [id]: { ...prev[id], priority: newPriority }
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
                setMessageKey(prev => prev + 1);
                setMessage({ text: "Changes saved successfully!", type: "success" });
                setEditingPetId(null);
                setEditingValues(prev => {
                    const newValues = { ...prev };
                    delete newValues[pet.id];
                    return newValues;
                });
            } catch (error) {
                setMessageKey(prev => prev + 1);
                setMessage({ text: "Failed to save changes", type: "error" });
            }
        } else {
            // Start editing
            setEditingPetId(pet.id);
            setEditingValues(prev => ({
                ...prev,
                [pet.id]: {
                    status: pet.status,
                    priority: pet.priority
                }
            }));
        }
    };

    const handleCancel = (petId) => {
        setEditingPetId(null);
        setEditingValues(prev => {
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
            setMessageKey(prev => prev + 1);
            setMessage({ text: "Pet deleted successfully!", type: "success" });
            setTimeout(() => {
                onDelete(petToDelete.id);
            }, 1000);
        } catch (error) {
            setMessageKey(prev => prev + 1);
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
                <table className="table">
                    <thead>
                        <tr>
                            <th
                                className="cursor-pointer hover:bg-base-200"
                                onClick={() => requestSort('name')}
                            >
                                Name {getSortIcon('name')}
                            </th>
                            <th
                                className="cursor-pointer hover:bg-base-200"
                                onClick={() => requestSort('animalType')}
                            >
                                Animal Type {getSortIcon('animalType')}
                            </th>
                            <th
                                className="cursor-pointer hover:bg-base-200"
                                onClick={() => requestSort('status')}
                            >
                                Status {getSortIcon('status')}
                            </th>
                            <th
                                className="cursor-pointer hover:bg-base-200"
                                onClick={() => requestSort('priority')}
                            >
                                Priority {getSortIcon('priority')}
                            </th>
                            <th>Update</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedPets.map((pet) => {
                            const editValues = editingValues[pet.id] || {};
                            return (
                                <tr key={pet.id}>
                                    <td>{pet.name}</td>
                                    <td>{pet.animalType.name}</td>
                                    <td>
                                        <select
                                            value={editValues.status || pet.status}
                                            onChange={(e) => handleStatusChange(pet.id, e.target.value)}
                                            className="select select-bordered select-sm"
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
                                            onChange={(e) => handlePriorityChange(pet.id, e.target.value)}
                                            className="select select-bordered select-sm"
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
                                                        className="btn btn-success btn-sm"
                                                        onClick={() => handleUpdate(pet)}
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        className="btn btn-ghost btn-sm"
                                                        onClick={() => handleCancel(pet.id)}
                                                    >
                                                        Cancel
                                                    </button>
                                                </>
                                            ) : (
                                                <button
                                                    className="btn btn-info btn-sm"
                                                    onClick={() => handleUpdate(pet)}
                                                >
                                                    Update
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-error btn-sm"
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