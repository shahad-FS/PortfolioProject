import { useState } from "react";

export default function PetModal({ editing, setOpen, createPet, updatePet }) {
  const [form, setForm] = useState({
    name: editing?.name || "",
    type: editing?.type || "",
    breed: editing?.breed || "",
    birth_year: editing?.birth_year || "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const save = async () => {
    const payload = {
      ...form,
      birth_year: form.birth_year ? Number(form.birth_year) : null,
    };

    if (editing) {
      await updatePet(editing.id, payload);
    } else {
      await createPet(payload);
    }

    setOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-5 w-[400px] rounded-lg space-y-3">
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="input input-bordered w-full"
        />

        <input
          name="type"
          placeholder="Type"
          value={form.type}
          onChange={handleChange}
          className="input input-bordered w-full"
        />

        <input
          name="breed"
          placeholder="Breed"
          value={form.breed}
          onChange={handleChange}
          className="input input-bordered w-full"
        />

        <input
          name="birth_year"
          type="number"
          placeholder="Birth Year"
          value={form.birth_year}
          onChange={handleChange}
          className="input input-bordered w-full"
        />

        <button onClick={save} className="btn btn-primary w-full">
          {editing ? "Update Pet" : "Add Pet"}
        </button>

        <button onClick={() => setOpen(false)} className="btn btn-ghost w-full">
          Cancel
        </button>
      </div>
    </div>
  );
}
