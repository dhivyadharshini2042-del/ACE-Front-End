"use client";

import "./role-select.css";
import { useRouter } from "next/navigation";
import { useLoading } from "../../../context/LoadingContext";
import { toast } from "react-hot-toast";
import { saveUserRoleApi } from "../../../lib/api/auth.api";

export default function RoleSelectPage() {
  const router = useRouter();
  const { setLoading } = useLoading();

  const onSelect = async (value) => {
    try {
      setLoading(true);

      const res = await saveUserRoleApi({ userType: value });
      if (!res?.status) {
        toast.error("Role save failed");
        return;
      }

      router.push("/");
    } catch (e) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vibe-shell">
      {/* HEADER */}
      <div className="vibe-header">
        <h1 className="vibe-title">
          <span>Select your vibe!</span> Start your journey!
        </h1>
        <p className="vibe-sub">Click & enjoy your events vibe!</p>
      </div>

      {/* BODY */}
      <div className="vibe-body">
        {/* LEFT IMAGE */}
        <div className="vibe-left">
          <img src="/images/Firstscreen.png" alt="Select your vibe" />
        </div>

        {/* RIGHT OPTIONS */}
        <div className="vibe-right">
          <div
            className="vibe-btn student"
            onClick={() => onSelect("student")}
          >
            <span className="icon">🎓</span>
            Student
          </div>

          <div
            className="vibe-btn faculty"
            onClick={() => onSelect("faculty")}
          >
            <span className="icon">👨‍🏫</span>
            Faculty
          </div>

          <div
            className="vibe-btn professional"
            onClick={() => onSelect("professional")}
          >
            <span className="icon">💼</span>
            Professional
          </div>

          <div
            className="vibe-btn general"
            onClick={() => onSelect("general")}
          >
            <span className="icon">👤</span>
            General User
          </div>
        </div>
      </div>
    </div>
  );
}
