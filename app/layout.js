import { ReduxProvider } from "./providers";
import "./globals.css";

// Deliberately NOT using next/font/google here: this is an internal ops
// tool that floor staff load on airport wifi, and enterprise networks
// frequently block third-party font CDNs on CSP grounds. A system font
// stack removes an external network dependency entirely (one less thing
// that can fail on a spotty connection) while still keeping a distinct
// UI/data type pairing via CSS variables in globals.css.

export const metadata = {
  title: "Frequent Flyer Portal",
  description: "Internal frequent flyer member management portal for floor staff.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
