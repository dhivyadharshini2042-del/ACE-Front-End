"use client";

import styles from "./ChooseEventCategory.module.css";
import { useRouter } from "next/navigation";

export default function ChooseEventCategory({ categories = [] }) {
  const router = useRouter();

  const handleCardClick = (category) => {
    if (category.class === "explore") {
      router.push("/explore-categories");
    } else {
      router.push(`/events`);
    }
  };

  return (
    <section className={styles.categoriesroot}>
      <h2 className={styles.title}>Choose Your Category</h2>

      <div className={styles.grid}>
        {categories.map((c, i) => (
          <div
            key={i}
            className={`${styles.card} ${styles[c.class]}`}
            onClick={() => handleCardClick(c)}
          >
            <div className={styles.left}>
              <img src={c.img} alt={c.name} />
            </div>
            <div className={styles.right}>{c.name}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
