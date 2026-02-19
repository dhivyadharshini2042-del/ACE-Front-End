"use client";

import styles from "./EventSearchBar.module.css";
import { SEARCH_ICON } from "../../../const-value/config-icons/page";

export default function EventSearchBar({
  whatIcon,
  whereIcon,
  whenIcon,
  onWhatClick,
  onWhereClick,
  onWhenClick,
}) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.row}>
          <div className={styles.col} onClick={onWhatClick}>
            <div className={styles.icon}>{whatIcon}</div>
            <div>
              <div className={styles.title}>What</div>
              <div className={styles.sub}>Event Type</div>
            </div>
          </div>

          <div className={styles.col} onClick={onWhereClick}>
            <div className={styles.icon}>{whereIcon}</div>
            <div>
              <div className={styles.title}>Event Mode</div>
              <div className={styles.sub}>Select mode</div>
            </div>
          </div>

          <div className={styles.col} onClick={onWhenClick}>
            <div className={styles.icon}>{whenIcon}</div>
            <div>
              <div className={styles.title}>When</div>
              <div className={styles.sub}>Date</div>
            </div>
          </div>
          <button className={styles.searchBtn}>
            <span className={styles.searchIcon}>{SEARCH_ICON}</span>
            <span>Search</span>
          </button>

        </div>
      </div>
    </div>
  );
}
