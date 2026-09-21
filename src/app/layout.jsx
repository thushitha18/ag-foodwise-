import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { LocationProvider } from "@/lib/location-context";
import { CartProvider } from "@/lib/cart-context";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "FoodWise — Free Food Surplus & Redistribution Network",
  description:
    "Intelligent food surplus claim & redistribution platform. Claim free surplus, donate excess food, rescue what remains, and eliminate food waste.",
  keywords: [
    "free food",
    "food surplus",
    "food rescue",
    "zero waste",
    "claim food",
    "donate food",
    "sustainable food",
    "Coimbatore food",
    "Chennai food rescue",
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans" style={{ backgroundColor: 'var(--fw-bg)', color: 'var(--fw-text)' }}>
        <AuthProvider>
          <LocationProvider>
            <CartProvider>
              <Navbar />
              <main className="flex-1 flex flex-col">{children}</main>
              <Footer />
            </CartProvider>
          </LocationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
