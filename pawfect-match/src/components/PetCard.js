import { useState } from "react";
import FadeMessage from "./FadeMessage";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";

export default function PetCard({ pet, onStatusChange, onPriorityChange, onDelete }) {
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState(null);
    const [messageKey, setMessageKey] = useState(0);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [editValues, setEditValues] = useState({
        status: pet.status,
        priority: pet.priority
    });

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

    const handleStatusChange = (newStatus) => {
        setEditValues(prev => ({ ...prev, status: newStatus }));
    };

    const handlePriorityChange = (newPriority) => {
        setEditValues(prev => ({ ...prev, priority: newPriority }));
    };

    const handleSave = async () => {
        try {
            if (editValues.status !== pet.status) {
                await onStatusChange(pet.id, editValues.status);
            }
            if (editValues.priority !== pet.priority) {
                await onPriorityChange(pet.id, editValues.priority);
            }
            setMessageKey(prev => prev + 1);
            setMessage({ text: "Changes saved successfully!", type: "success" });
            setIsEditing(false);
        } catch (error) {
            setMessageKey(prev => prev + 1);
            setMessage({ text: "Failed to save changes", type: "error" });
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditValues({
            status: pet.status,
            priority: pet.priority
        });
    };

    const handleDeleteClick = () => {
        setShowDeleteDialog(true);
    };

    const handleDeleteConfirm = async () => {
        setShowDeleteDialog(false);
        try {
            setMessageKey(prev => prev + 1);
            setMessage({ text: "Pet deleted successfully!", type: "success" });
            setTimeout(() => {
                onDelete(pet.id);
            }, 1000);
        } catch (error) {
            setMessageKey(prev => prev + 1);
            setMessage({ text: "Failed to delete pet", type: "error" });
        }
    };

    return (
        <div className="card bg-base-100 shadow-xl">
            <DeleteConfirmationDialog
                isOpen={showDeleteDialog}
                onConfirm={handleDeleteConfirm}
                onCancel={() => setShowDeleteDialog(false)}
                petName={pet.name}
            />
            {message && (
                <FadeMessage
                    key={messageKey}
                    message={message.text}
                    type={message.type}
                />
            )}
            <div className="card-body">
                <h2 className="card-title">{pet.name}</h2>
                <p className="text-sm text-gray-500">{pet.animalType.name}</p>

                <div className="flex gap-2 my-2">
                    <span className={`badge ${statusColors[editValues.status]}`}>
                        {editValues.status}
                    </span>
                    <span className={`badge ${priorityColors[editValues.priority]}`}>
                        {editValues.priority}
                    </span>
                </div>

                {isEditing ? (
                    <div className="flex flex-col gap-2">
                        <select
                            value={editValues.status}
                            onChange={(e) => handleStatusChange(e.target.value)}
                            className="select select-bordered w-full"
                        >
                            <option value="AVAILABLE">Available</option>
                            <option value="ADOPTED">Adopted</option>
                            <option value="IN_CARE">In Care</option>
                        </select>

                        <select
                            value={editValues.priority}
                            onChange={(e) => handlePriorityChange(e.target.value)}
                            className="select select-bordered w-full"
                        >
                            <option value="LOW">Low</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HIGH">High</option>
                        </select>
                    </div>
                ) : null}

                <div className="card-actions justify-end mt-4">
                    {isEditing ? (
                        <>
                            <button
                                className="btn btn-sm btn-success"
                                onClick={handleSave}
                            >
                                Save
                            </button>
                            <button
                                className="btn btn-sm btn-ghost"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        <button
                            className="btn btn-sm btn-info"
                            onClick={() => setIsEditing(true)}
                        >
                            Update
                        </button>
                    )}
                    <button
                        className="btn btn-sm btn-error"
                        onClick={handleDeleteClick}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
} 