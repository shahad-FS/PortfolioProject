import { useEffect, useState } from "react";
import api from "../api/axios";

export default function useProfile() {
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");
  const [profile, setProfile] = useState({});
  const [needsCompletion, setNeedsCompletion] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("accounts/profile/");

      console.log("Raw API Response:", res.data);
      setRole(res.data.role);

      const userProfile = {
        id: res.data.id,
        email: res.data.email,

        full_name: res.data.profile?.full_name || "",
        phone: res.data.profile?.phone || "",

        license_number: res.data.vet?.license_number || "",
        specialization: res.data.vet?.specialization || "",
        bio: res.data.vet?.bio || "",
        is_approved: res.data.vet?.is_approved ?? null,
        session_price: res.data.vet?.session_price || "100.00",
      };
      console.log("Raw API Response:", res.data.vet);
      setProfile(userProfile);

      // حساب هل يحتاج يكمل بياناته
      let needs = false;

      if (res.data.role === "pet_owner") {
        needs = !userProfile.full_name || !userProfile.phone;
      }

      if (res.data.role === "vet") {
        needs =
          !userProfile.full_name ||
          !userProfile.phone ||
          !userProfile.license_number ||
          !userProfile.specialization ||
          !userProfile.session_price;
      }

      setNeedsCompletion(needs);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const completeProfile = async (nestedData) => {
    console.log("Data being sent to API directly from Modal:", nestedData);
    setLoading(true);
    try {
      await api.patch("accounts/profile/", nestedData);
      await fetchProfile();
    } catch (err) {
      console.error("Error updating profile:", err.response?.data || err);
      setLoading(false);
    }
  };

  return { loading, role, profile, needsCompletion, completeProfile };
}
