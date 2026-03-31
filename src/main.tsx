import { ThemeProvider } from "next-themes"
import ReactDOM from "react-dom/client"

import App from "./App.tsx"
import { I18nProvider } from "@/i18n"
import { LayoutProvider } from "@/layouts/LayoutProvider"
import "./index.css"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <I18nProvider>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <LayoutProvider>
        <App />
      </LayoutProvider>
    </ThemeProvider>
  </I18nProvider>,
)
