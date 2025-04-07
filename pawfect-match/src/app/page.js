"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LoadingAnimation from "../components/LoadingAnimation";
import PetList from "../components/PetList";
import Hero from "../components/Hero";

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
      // For testing: ensure loading shows for at least 1 second
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
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="p-0 flex-1 flex flex-col text-base-content bg-base-200">
        <Hero onPetCreated={fetchPets} />
        <div className="min-h-100px flex-1">
          <PetList
            pets={pets}
            onStatusChange={handleStatusChange}
            onPriorityChange={handlePriorityChange}
            onDelete={handleDelete}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}


