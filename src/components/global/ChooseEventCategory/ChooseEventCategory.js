"use client";

import { useLoading } from "../../../context/LoadingContext";
import styles from "./ChooseEventCategory.module.css";
import { useRouter } from "next/navigation";

export default function ChooseEventCategory({ categories = [] }) {
  const router = useRouter();
  const { setLoading } = useLoading();

  const handleCardClick = (category) => {
    try {
      setLoading(true);

      if (category.class === "explore") {
        router.push("/explore-categories");
      } else {
        router.push(`/events?eventType=${category.identity}`);
      }
    } catch (error) {
      console.error("Navigation failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.categoriesroot}>
      <h2 className={styles.title}>Choose Your Category</h2>

      <div className={styles.grid}>
        {categories.map((c, i) => (
          <div
            key={c.identity || `category-${i}`}  
            className={`${styles.card} ${
              c.class === "explore" ? styles.explore : ""
            }`}
            style={{ "--card-color": c.color || "#e3d8ff" }}
            onClick={() => handleCardClick(c)}  
          >
            <div className={styles.left}>
              <img src={c.img || c.imageUrl} alt={c.name} />
            </div>
            <div className={styles.right}>{c.name}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
