import React from "react";
import Converter from "./components/Converter";

function App() {
  return (
    <div className="min-h-screen bg-blue-900 flex flex-col items-center justify-center">
      <h1 className="text-white text-3xl font-bold mb-8">Menová kalkulačka</h1>
      <Converter />
    </div>
  );
}

export default App;
