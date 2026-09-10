"use client";
import { useState, useEffect } from "react";

export default function PottedPlant() {
  const [waterCount, setWaterCount] = useState(42);
  const [isWatered, setIsWatered] = useState(false);

  useEffect(() => {
    const savedCount = localStorage.getItem("plorine_plant_waters");
    if (savedCount) {
      setWaterCount(parseInt(savedCount, 10));
    }
  }, []);

  const handleWater = () => {
    const newCount = waterCount + 1;
    setWaterCount(newCount);
    localStorage.setItem("plorine_plant_waters", newCount.toString());
    setIsWatered(true);
    setTimeout(() => setIsWatered(false), 800);
  };

  return (
    <div 
      onClick={handleWater}
      style={{
        background: "#151421",
        border: "1px solid rgba(255, 255, 255, 0.04)",
        padding: "24px",
        borderRadius: "24px",
        textAlign: "center",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
        transition: "transform 0.2s ease"
      }}
    >
      <div style={{ 
        fontSize: "2.8rem", 
        marginBottom: "12px",
        transform: isWatered ? "scale(1.25)" : "scale(1)", 
        transition: "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)" 
      }}>
        {isWatered ? "🌱💧" : "🪴"}
      </div>
      <h2 style={{ fontSize: "1.1rem", fontWeight: "700", marginBottom: "4px" }}>Potted Plant</h2>
      <p style={{ fontSize: "0.85rem", color: "#a7a9be" }}>
        Watered <b style={{ color: "#a78bfa" }}>{waterCount}</b> times today!
      </p>
    </div>
  );
}