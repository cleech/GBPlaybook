import { LoaderFunction, redirect } from "react-router-dom";
import gbdb from "../models/gbdb";
import { SettingsDoc } from "../models/settings";
import { defaultSettings } from "../models/defaultSettings";

export const path = "/";

// The redirect logic is moved to a loader
export const loader: LoaderFunction = async () => {
  const settings = await gbdb.getLocal<SettingsDoc>("settings");
  const initialScreen: string =
    settings?.get("initialScreen") ?? defaultSettings.initialScreen;

  let targetRoute = initialScreen;

  if (initialScreen === "/game") {
    targetRoute = settings?.get("gamePlayRoute") ?? initialScreen;
  } else if (initialScreen === "/library") {
    targetRoute = settings?.get("libraryRoute") ?? initialScreen;
  }

  // Use the redirect utility function
  return redirect(targetRoute);
};

// Since the loader always redirects, the element might not even render.
// You could return null or a simple loading indicator if needed,
// but often it's fine to have a minimal component or even omit the element
// if the loader guarantees a redirect. For clarity, let's add a minimal element.

const element = () => null; // Or <></> or a loading spinner
export default element;

// Alternatively, using the lazy function export style:
/*
import React from "react";
import { LoaderFunction, redirect } from "react-router-dom";
import gbdb from "../models/gbdb";
import { SettingsDoc } from "../models/settings";
import { defaultSettings } from "../models/defaultSettings";

export const loader: LoaderFunction = async () => {
  // ... same loader logic as above ...
  const settings = await gbdb.getLocal<SettingsDoc>("settings");
  const initialScreen: string =
    settings?.get("initialScreen") ?? defaultSettings.initialScreen;
  let targetRoute = initialScreen;
  if (initialScreen === "/game") {
    targetRoute = settings?.get("gamePlayRoute") ?? initialScreen;
  } else if (initialScreen === "/library") {
    targetRoute = settings?.get("libraryRoute") ?? initialScreen;
  }
  return redirect(targetRoute);
};

export function Component() {
    // This component likely won't render due to the redirect in the loader
    return React.createElement(React.Fragment);
}

Component.displayName = "RootRedirector";
*/

