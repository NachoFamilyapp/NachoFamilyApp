"use client";

export default function TestPage() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <button
        onClick={() => {
          alert("WERKT");
        }}
        style={{
          background: "red",
          color: "white",
          padding: "50px",
          fontSize: "40px",
          border: "none",
          cursor: "pointer",
        }}
      >
        TEST KNOP
      </button>
    </div>
  );
}