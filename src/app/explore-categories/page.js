"use client";

import "./explore-categories.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getExploreEventTypes } from "../../lib/api/event.api";
import { useLoading } from "../../context/LoadingContext";

export default function ExploreCategoriesPage() {
  const router = useRouter();
  const { setLoading } = useLoading();

  const [categories, setCategories] = useState([]);

  /* ================= FETCH FROM BACKEND ================= */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);

        const res = await getExploreEventTypes();

        if (res?.status && Array.isArray(res.data)) {
          setCategories(res.data);
        } else {
          setCategories([]);
        }
      } catch (err) {
        console.error("Explore categories error:", err);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  /* ================= NAVIGATION ================= */
  // const handleBack = () => {
  //   try {
  //     setLoading(true);
  //     router.push("/");
  //   } catch (err) {
  //     console.error(err);
  //     setLoading(false);
  //   }
  // };

  const handleCardClick = (category) => {
    if (!category) return;

    try {
      setLoading(true);
      router.push(`/events?category=${category.identity || category.name}`);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };
  
  /* ================= UI ================= */
  return (
    <div className="explore-page">
      {/* <div className="text-start m-4" style={{ cursor: "pointer" }}>
        <p onClick={handleBack}> 🔙 Back</p>
      </div> */}

      {/* HEADER */}
      <div className="explore-header mt-5">
        <h2>Choose Your Event Type</h2>
      </div>

      {/* EMPTY STATE */}
      {categories.length === 0 && (
        <p className="text-center mt-5">No categories available</p>
      )}

      {/* GRID */}
      {categories.length > 0 && (
        <div className="explore-grid">
          {categories
            .filter((item) => item.name !== "Explore More")
            .map((item) => (
              <div
                key={item.identity}
                className="explore-card"
                style={{ "--card-color": item.color || "#F5F5F5" }}
                onClick={() => handleCardClick(item)}
              >
                <div className="icon-box">
                  <img src={item.imageUrl || ""} alt={item.name} />
                </div>
                <p>{item.name}</p>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
