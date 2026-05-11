import { useState, useEffect } from "react";
import api from "../api/axios";

export function usePets() {
  const [pets, setPets] = useState([]);

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      const res = await api.get("pets/");
      setPets(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const createPet = async (data) => {
    try {
      const res = await api.post("pets/", data);
      setPets((prev) => [...prev, res.data]);
    } catch (err) {
      console.log("FULL ERROR:", err.response?.data);
    }
  };
  const updatePet = async (id, data) => {
    const res = await api.patch(`pets/${id}/`, data);
    setPets((prev) => prev.map((p) => (p.id === id ? res.data : p)));
  };

  const deletePet = async (id) => {
    await api.delete(`pets/${id}/`);
    setPets((prev) => prev.filter((p) => p.id !== id));
  };

  return { pets, createPet, updatePet, deletePet };
}
