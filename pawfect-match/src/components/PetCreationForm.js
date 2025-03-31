import { useState, useEffect } from "react";
import FadeMessage from "./FadeMessage";
import { getFriendlyMessage } from "../lib/friendlyMessage";

export default function PetCreationForm({ onPetCreated }) {
    const [animalTypes, setAnimalTypes] = useState([]);
    const [isAddingType, setIsAddingType] = useState(false);
    const [newTypeName, setNewTypeName] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        animalTypeId: "",
        priority: "MEDIUM",
        status: "AVAILABLE"
    });
    const [message, setMessage] = useState(null);
    const [messageKey, setMessageKey] = useState(0);

    useEffect(() => {
        fetchAnimalTypes();
    }, []);

    const fetchAnimalTypes = async () => {
        try {
            const response = await fetch("/api/animal-types");
            const data = await response.json();
            if (data.success) {
                setAnimalTypes(data.data);
            }
        } catch (error) {
            console.error("Error fetching animal types:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("/api/pets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (data.success) {
                setFormData({
                    name: "",
                    animalTypeId: "",
                    priority: "MEDIUM",
                    status: "AVAILABLE"
                });
                setMessageKey(prev => prev + 1);
                setMessage({ text: "Pet created successfully!", type: "success" });
                onPetCreated();
            } else {
                setMessageKey(prev => prev + 1);
                setMessage({ text: data.error || "Failed to create pet", type: "error" });
            }
        } catch (error) {
            setMessageKey(prev => prev + 1);
            setMessage({ text: "Failed to create pet", type: "error" });
        }
    };

    const handleCreateAnimalType = async () => {
        if (!newTypeName.trim()) return;
        try {
            const response = await fetch("/api/animal-types", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newTypeName }),
            });
            const data = await response.json();
            if (data.success) {
                await fetchAnimalTypes();
                setFormData(prev => ({ ...prev, animalTypeId: data.data.id }));
                setNewTypeName("");
                setIsAddingType(false);
                setMessageKey(prev => prev + 1);
                setMessage({ text: "Animal type created successfully!", type: "success" });
            } else {
                const userFriendlyMsg = getFriendlyMessage(data.error);
                setMessageKey(prev => prev + 1);
                setMessage({ text: userFriendlyMsg, type: "error" });
            }
        } catch (error) {
            console.error("Error creating animal type:", error);
            const userFriendlyMsg = getFriendlyMessage(error.message);
            setMessageKey(prev => prev + 1);
            setMessage({ text: userFriendlyMsg, type: "error" });
        }
    };

    return (
        <div className="card bg-base-100 shadow-xl rounded-3xl">
            {message && (
                <FadeMessage
                    key={messageKey}
                    message={message.text}
                    type={message.type}
                />
            )}
            <div className="card-body ">
                <h2 className="card-title justify-center pb-2">Add New Pet</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {/* Animal name input */}
                    <div className="form-control flex gap-2">
                        <label className="label w-22">
                            <span className="label-text">Pet Name *</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            className="input input-bordered flex-1"
                            placeholder="Enter pet name"
                        />
                    </div>
                    {/* Animal type input */}
                    <div className="form-control flex gap-2">
                        <label className="label w-22">
                            <span className="label-text">Animal Type *</span>
                        </label>
                        {!isAddingType ? (
                            <div className="flex-1 flex gap-2 flex-col sm:flex-row items-stretch">
                                <select
                                    required
                                    value={formData.animalTypeId}
                                    onChange={(e) => setFormData(prev => ({ ...prev, animalTypeId: e.target.value }))}
                                    className="select select-md select-bordered flex-1 min-h-[2.5rem]"
                                >
                                    <option value="">Select animal type</option>
                                    {animalTypes.map(type => (
                                        <option key={type.id} value={type.id}>
                                            {type.name}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    onClick={() => setIsAddingType(true)}
                                    className="btn btn-soft btn-primary"
                                >
                                    New Type
                                </button>
                            </div>
                        ) : (
                            <div className="flex-1 flex gap-2 flex-col sm:flex-row items-stretch">
                                <input
                                    type="text"
                                    value={newTypeName}
                                    onChange={(e) => setNewTypeName(e.target.value)}
                                    className="input input-bordered flex-1 input-md min-h-[2.5rem]"
                                    placeholder="Enter new type"
                                />
                                <div className="flex-1 flex justify-between gap-2 w-full">
                                    <button
                                        type="button"
                                        onClick={handleCreateAnimalType}
                                        className="btn btn-soft btn-primary flex-1"
                                    >
                                        Add
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsAddingType(false)}
                                        className="btn btn-soft"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="form-control flex gap-2">
                        <label className="label w-22">
                            <span className="label-text">Status</span>
                        </label>
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                            className="select select-bordered flex-1"
                        >
                            <option value="AVAILABLE">Available for Adoption</option>
                            <option value="ADOPTED">Adopted</option>
                            <option value="IN_CARE">In Care</option>
                        </select>
                    </div>

                    <div className="form-control flex gap-2">
                        <label className="label w-22">
                            <span className="label-text">Priority</span>
                        </label>
                        <select
                            value={formData.priority}
                            onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                            className="select select-bordered flex-1"
                        >
                            <option value="LOW">Low</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HIGH">High</option>
                        </select>
                    </div>

                    <button type="submit" className="btn btn-primary mt-4">
                        Create Pet
                    </button>
                </form>
            </div>
        </div>
    );
} 