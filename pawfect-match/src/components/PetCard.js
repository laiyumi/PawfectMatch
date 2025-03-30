import { useState } from "react";
import FadeMessage from "./FadeMessage";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";

export default function PetCard({ pet, onStatusChange, onPriorityChange, onDelete }) {
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState(null);
    const [messageKey, setMessageKey] = useState(0);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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

    const handleStatusChange = async (newStatus) => {
        try {
            await onStatusChange(pet.id, newStatus);
            setMessageKey(prev => prev + 1);
            setMessage({ text: "Status updated successfully!", type: "success" });
        } catch (error) {
            setMessageKey(prev => prev + 1);
            setMessage({ text: "Failed to update status", type: "error" });
        }
    };

    const handlePriorityChange = async (newPriority) => {
        try {
            await onPriorityChange(pet.id, newPriority);
            setMessageKey(prev => prev + 1);
            setMessage({ text: "Priority updated successfully!", type: "success" });
        } catch (error) {
            setMessageKey(prev => prev + 1);
            setMessage({ text: "Failed to update priority", type: "error" });
        }
    };

    const handleDeleteClick = () => {
        setShowDeleteDialog(true);
    };

    const handleDeleteConfirm = async () => {
        setShowDeleteDialog(false);
        try {
            setMessageKey(prev => prev + 1);
            setMessage({ text: "Pet deleted successfully!", type: "success" });
            // Simple timeout without nested try-catch
            setTimeout(() => {
                onDelete(pet.id);
            }, 1000);
        } catch (error) {
            setMessageKey(prev => prev + 1);
            setMessage({ text: "Failed to delete pet", type: "error" });
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteDialog(false);
    };

    return (
        <div className="card bg-base-100 shadow-xl">
            <DeleteConfirmationDialog
                isOpen={showDeleteDialog}
                onConfirm={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
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
                            onChange={(e) => handleStatusChange(e.target.value)}
                            className="select select-bordered w-full"
                        >
                            <option value="AVAILABLE">Available</option>
                            <option value="ADOPTED">Adopted</option>
                            <option value="IN_CARE">In Care</option>
                        </select>

                        <select
                            value={pet.priority}
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
                    <button
                        className="btn btn-sm btn-outline"
                        onClick={() => setIsEditing(!isEditing)}
                    >
                        {isEditing ? "Done" : "Edit"}
                    </button>
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