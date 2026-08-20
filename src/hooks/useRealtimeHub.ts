import { HubConnectionBuilder, HubConnectionState, LogLevel } from "@microsoft/signalr";
import { useEffect, useMemo, useRef, useState } from "react";
import tokenStorage from "../services/tokenStorage";

type RealtimeHandler = (...args: unknown[]) => void;

type RealtimeHandlerMap = Record<string, RealtimeHandler>;

type UseRealtimeHubOptions = {
  enabled?: boolean;
  hubPath?: string;
};

function resolveHubUrl(hubPath: string) {
  const baseUrl = (import.meta.env.VITE_API_BASE_URL ?? window.location.origin).replace(/\/+$/, "");
  const normalizedPath = hubPath.startsWith("/") ? hubPath : `/${hubPath}`;
  return `${baseUrl}${normalizedPath}`;
}

export function useRealtimeHub(handlers: RealtimeHandlerMap, options?: UseRealtimeHubOptions) {
  const enabled = options?.enabled ?? true;
  const hubPath = options?.hubPath ?? "/hubs/updates";
  const handlersRef = useRef(handlers);
  const [state, setState] = useState<HubConnectionState>(HubConnectionState.Disconnected);

  const eventSignature = useMemo(() => Object.keys(handlers).sort().join("|"), [handlers]);

  useEffect(() => {
    handlersRef.current = handlers;
  }, [handlers, eventSignature]);

  useEffect(() => {
    if (!enabled) {
      setState(HubConnectionState.Disconnected);
      return;
    }

    const token = tokenStorage.getToken();
    if (!token) {
      setState(HubConnectionState.Disconnected);
      return;
    }

    const connection = new HubConnectionBuilder()
      .withUrl(resolveHubUrl(hubPath), {
        accessTokenFactory: () => tokenStorage.getToken() ?? "",
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Warning)
      .build();

    const subscriptions = Object.keys(handlersRef.current).map((eventName) => {
      const wrapper = (...args: unknown[]) => {
        handlersRef.current[eventName]?.(...args);
      };

      connection.on(eventName, wrapper);
      return { eventName, wrapper };
    });

    let isMounted = true;

    const syncState = () => {
      if (isMounted) {
        setState(connection.state);
      }
    };

    connection.onreconnecting(syncState);
    connection.onreconnected(syncState);
    connection.onclose(syncState);

    void connection
      .start()
      .then(syncState)
      .catch((error) => {
        console.error("Realtime connection failed", error);
        syncState();
      });

    return () => {
      isMounted = false;

      for (const { eventName, wrapper } of subscriptions) {
        connection.off(eventName, wrapper);
      }

      void connection.stop();
    };
  }, [enabled, hubPath, eventSignature]);

  return state;
}
