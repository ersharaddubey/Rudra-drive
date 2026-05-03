import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { CarContextProvider } from "./Context/context.jsx";
import { MotionConfig } from "motion/react";
createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <CarContextProvider>
      <MotionConfig viewport={{ once: true }}>
        <App />
      </MotionConfig>
    </CarContextProvider>
  </BrowserRouter>
);
