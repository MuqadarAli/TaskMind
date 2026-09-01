import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CopilotKit } from "@copilotkit/react-core/v2";
import { ThemeProvider } from "@/components/providers/theme-provider";
import "@copilotkit/react-core/v2/styles.css";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TaskMind",
  description: "A focused, animated todo workspace for modern task planning.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body
        suppressHydrationWarning
        className="min-h-full bg-background text-foreground"
      >
        <CopilotKit
          runtimeUrl="/api/copilotkit"
          useSingleEndpoint={false}
          enableInspector={false}
          publicLicenseKey={process.env.NEXT_PUBLIC_COPILOTKIT_LICENSE_KEY}
        >
          <ThemeProvider>{children}</ThemeProvider>
        </CopilotKit>
      </body>
    </html>
  );
}
