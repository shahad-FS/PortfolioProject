import { useEffect, useState } from "react";
import api from "../api/axios";

export default function useProfile() {
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");
  const [profile, setProfile] = useState({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("accounts/profile/");

      setRole(res.data.role);

      setProfile({
        full_name: res.data.profile?.full_name || "",
        phone: res.data.profile?.phone || "",
        specialization: res.data.vet?.specialization || "",
        license_number: res.data.vet?.license_number || "",
      });

      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return { loading, role, profile };
}
