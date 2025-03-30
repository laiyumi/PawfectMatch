import { useState } from "react";
import FadeMessage from "./FadeMessage";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import { animalIcons } from "../lib/animalIcons";

export default function PetCard({ pet, onStatusChange, onPriorityChange, onDelete }) {
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState(null);
    const [messageKey, setMessageKey] = useState(0);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [editValues, setEditValues] = useState({
        status: pet.status,
        priority: pet.priority
    });

    const statusLabels = {
        AVAILABLE: "Available",
        ADOPTED: "Adopted",
        IN_CARE: "In Care",
    };

    const priorityLabels = {
        LOW: "Low",
        MEDIUM: "Medium",
        HIGH: "High",
    };

    const statusColors = {
        AVAILABLE: "status-success",
        ADOPTED: "status-info",
        IN_CARE: "status-warning"
    };

    const priorityColors = {
        LOW: "badge badge-accent",
        MEDIUM: "badge badge-warning",
        HIGH: "badge badge-error"
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
        <div className="card bg-base-100 shadow-xl rounded-3xl">

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
                <div className="flex justify-between align-middle">
                    <span className="text-xl">{pet.name}</span>
                    {/* <span className="text-sm text-gray-500">{pet.animalType.name}</span> */}
                    {/* <span className="text-3xl ">{animalIcons[pet.animalType.name] || animalIcons.Unknown}</span> */}
                    <img
                        src={animalIcons[pet.animalType.name] || animalIcons.Unknown}
                        alt={pet.animalType.name}
                        className="w-8 h-8"
                    />
                </div>
                <div className="flex gap-2 my-2">
                    <div className="flex gap-2 place-items-center">
                        <div className="inline-grid *:[grid-area:1/1]">
                            <div className={`status ${statusColors[editValues.status]} animate-ping`}></div>
                            <div className={`status ${statusColors[editValues.status]}`}></div>
                        </div>
                        <span>{statusLabels[editValues.status]}</span>
                    </div>

                    <span className={`badge ${priorityColors[editValues.priority]}`}>
                        {priorityLabels[editValues.priority]}
                    </span>
                </div>

                {isEditing ? (
                    <div className="flex flex-col gap-2">
                        <div className="flex">
                            <label className="label w-22">
                                <span className="label-text">Status</span>
                            </label>
                            <select
                                value={editValues.status}
                                onChange={(e) => handleStatusChange(e.target.value)}
                                className="select select-bordered w-full"
                            >
                                <option value="AVAILABLE">Available</option>
                                <option value="ADOPTED">Adopted</option>
                                <option value="IN_CARE">In Care</option>
                            </select>
                        </div>
                        <div className="flex">
                            <label className="label w-22">
                                <span className="label-text">Priority</span>
                            </label>
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
                    </div>
                ) : null}

                <div className="card-actions justify-end mt-4">
                    {isEditing ? (
                        <>
                            <button
                                className="btn btn-sm btn-primary"
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
                        <>
                            <button
                                className="btn btn-sm btn-primary btn-soft"
                                onClick={() => setIsEditing(true)}
                            >
                                Update
                            </button>
                            <button
                                className="btn btn-sm"
                                onClick={handleDeleteClick}
                            >
                                Delete
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
} 