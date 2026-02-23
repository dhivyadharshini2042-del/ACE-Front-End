import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ClientLayout from "../components/ClientLayout";
import Providers from "../components/Providers";
import { LoadingProvider } from "../context/LoadingContext";
import { GoogleAnalytics } from "@next/third-parties/google";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <GoogleOAuthProvider
          clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
        >
          <LoadingProvider>
            <Providers>
              <ClientLayout>{children}</ClientLayout>
            </Providers>
          </LoadingProvider>
        </GoogleOAuthProvider>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
      </body>
    </html>
  );
}
