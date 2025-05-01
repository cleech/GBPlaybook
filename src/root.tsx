import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import { SettingsProvider } from "./models/settings";
import { DataProvider } from "./components/DataContext";

import "./index.css";
import { registerSW } from "virtual:pwa-register";
registerSW({ immediate: true });
import "./utils/i18next";

export function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon-180x180.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#000000" />
        <title>Guild Ball Playbook</title>
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="preconnect" crossOrigin="anonymous" href="https://fonts.googleapis.com" />
        <link rel="preconnect" crossOrigin="anonymous" href="https://fonts.gstatic.com" />
        <link rel="stylesheet" crossOrigin="anonymous" href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@700&family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&family=IM+Fell+Great+Primer+SC&family=IM+Fell+Great+Primer:ital@0;1&family=Noto+Sans+Symbols+2&display=swap" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function Root() {
  // <React.StrictMode> // Uncomment if needed
  <SettingsProvider>
    <DataProvider>
      <Outlet />
    </DataProvider>
  </SettingsProvider>
  // </React.StrictMode>
}

