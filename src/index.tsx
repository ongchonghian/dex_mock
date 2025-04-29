import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { DexSgOurDexes } from "./screens/DexSgOurDexes";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <DexSgOurDexes />
  </StrictMode>,
);
