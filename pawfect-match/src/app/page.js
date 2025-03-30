"use client";

import { useState, useEffect } from "react";
import LoadingAnimation from "../components/LoadingAnimation";
import PetList from "../components/PetList";

export default function Home() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      const response = await fetch("/api/pets");
      const data = await response.json();
      if (data.success) {
        setPets(data.data);
      }
    } catch (error) {
      console.error("Error fetching pets:", error);
    } finally {
      // Ensure loading shows for at least 1 second
      setTimeout(() => setLoading(false), 2000);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch(`/api/pets/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        fetchPets();
      }
    } catch (error) {
      console.error("Error updating pet status:", error);
    }
  };

  const handlePriorityChange = async (id, newPriority) => {
    try {
      const response = await fetch(`/api/pets/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priority: newPriority }),
      });
      if (response.ok) {
        fetchPets();
      }
    } catch (error) {
      console.error("Error updating pet priority:", error);
    }
  };

  const handleDelete = async (id) => {

    try {
      const response = await fetch(`/api/pets/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchPets();
      }
    } catch (error) {
      console.error("Error deleting pet:", error);
    }
  };

  if (loading) return <LoadingAnimation />;


  return (
    <main className="min-h-screen">
      <PetList
        pets={pets}
        onStatusChange={handleStatusChange}
        onPriorityChange={handlePriorityChange}
        onDelete={handleDelete}
      />
    </main>
  );
}
