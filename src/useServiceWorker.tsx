import {
  useState,
  useCallback,
  useEffect,
  createContext,
  ReactNode,
  useContext,
} from "react";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

const useServiceWorker = () => {
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(
    null
  );
  const [showReload, setShowReload] = useState<boolean>(false);
  // called when a service worker
  // updates. this function is a callback
  // to the actual service worker
  // registration onUpdate.
  const onSWUpdate = useCallback((registration: ServiceWorkerRegistration) => {
    setShowReload(true);
    setWaitingWorker(registration.waiting);
  }, []);
  // simply put, this tells the service
  // worker to skip the waiting phase and then reloads the page
  const reloadPage = useCallback(() => {
    waitingWorker?.postMessage({ type: "SKIP_WAITING" });
    setShowReload(false);
    window.location.reload();
  }, [waitingWorker]);
  // register the service worker
  useEffect(() => {
    // If you want your app to work offline and load faster, you can change
    // unregister() to register() below. Note this comes with some pitfalls.
    // Learn more about service workers: https://cra.link/PWA
    serviceWorkerRegistration.register({
      onUpdate: onSWUpdate,
    });
  }, [onSWUpdate]);
  return { showReload, waitingWorker, reloadPage };
};

const ServiceWorkerContext = createContext<any>(null);

export const ServiceWorker = (props: { children?: ReactNode }) => {
  const { showReload, waitingWorker, reloadPage } = useServiceWorker();
  return (
    <ServiceWorkerContext.Provider
      value={{ showReload, waitingWorker, reloadPage }}
    >
      {props.children}
    </ServiceWorkerContext.Provider>
  );
};

export const useServiceWorkerCtx = () => useContext(ServiceWorkerContext);
