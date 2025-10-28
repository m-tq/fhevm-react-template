import { FhevmRelayerSDKType, FhevmWindowType } from "./fhevmTypes";
import { SDK_CDN_URL } from "./constants";

type TraceType = (message?: unknown, ...optionalParams: unknown[]) => void;

export class RelayerSDKLoader {
  private _trace?: TraceType;

  constructor(options: { trace?: TraceType }) {
    this._trace = options.trace;
  }

  public isLoaded() {
    if (typeof window === "undefined") {
      throw new Error("RelayerSDKLoader: can only be used in the browser.");
    }
    return isFhevmWindowType(window, this._trace);
  }

  public load(): Promise<void> {
    console.log("[RelayerSDKLoader] load...");
    // Ensure this only runs in the browser
    if (typeof window === "undefined") {
      console.log("[RelayerSDKLoader] window === undefined");
      return Promise.reject(
        new Error("RelayerSDKLoader: can only be used in the browser.")
      );
    }

    if ("relayerSDK" in window) {
      if (!isFhevmRelayerSDKType(window.relayerSDK, this._trace)) {
        console.log("[RelayerSDKLoader] window.relayerSDK is invalid, clearing and reloading...");
        // Clear invalid relayerSDK and try to reload
        delete (window as any).relayerSDK;
      } else {
        return Promise.resolve();
      }
    }

    return this.loadWithRetry(3);
  }

  private loadWithRetry(maxRetries: number): Promise<void> {
    return new Promise((resolve, reject) => {
      let retryCount = 0;

      const attemptLoad = () => {
        console.log(`[RelayerSDKLoader] Attempt ${retryCount + 1}/${maxRetries}`);
        
        const existingScript = document.querySelector(
          `script[src="${SDK_CDN_URL}"]`
        );
        if (existingScript) {
          existingScript.remove();
          console.log("[RelayerSDKLoader] Removed existing script");
        }

        const script = document.createElement("script");
        script.src = SDK_CDN_URL;
        script.type = "text/javascript";
        script.async = true;

        // Add timeout for script loading
        const timeout = setTimeout(() => {
          console.log("[RelayerSDKLoader] Script loading timeout");
          script.remove();
          if (retryCount < maxRetries - 1) {
            retryCount++;
            setTimeout(attemptLoad, 1000); // Wait 1 second before retry
          } else {
            reject(
              new Error(
                `RelayerSDKLoader: Failed to load Relayer SDK from ${SDK_CDN_URL} after ${maxRetries} attempts (timeout)`
              )
            );
          }
        }, 10000); // 10 second timeout

        script.onload = () => {
          clearTimeout(timeout);
          console.log("[RelayerSDKLoader] Script loaded successfully");
          
          // Wait a bit for the SDK to initialize
          setTimeout(() => {
            if (!isFhevmWindowType(window, this._trace)) {
              console.log("[RelayerSDKLoader] window.relayerSDK not available after script load");
              if (retryCount < maxRetries - 1) {
                retryCount++;
                setTimeout(attemptLoad, 1000);
              } else {
                reject(
                  new Error(
                    `RelayerSDKLoader: Relayer SDK script loaded from ${SDK_CDN_URL}, but window.relayerSDK is invalid after ${maxRetries} attempts`
                  )
                );
              }
            } else {
              console.log("[RelayerSDKLoader] SDK loaded and validated successfully");
              resolve();
            }
          }, 500); // Wait 500ms for SDK initialization
        };

        script.onerror = () => {
          clearTimeout(timeout);
          console.log(`[RelayerSDKLoader] Script loading error on attempt ${retryCount + 1}`);
          if (retryCount < maxRetries - 1) {
            retryCount++;
            setTimeout(attemptLoad, 1000);
          } else {
            reject(
              new Error(
                `RelayerSDKLoader: Failed to load Relayer SDK from ${SDK_CDN_URL} after ${maxRetries} attempts`
              )
            );
          }
        };

        console.log("[RelayerSDKLoader] Adding script to DOM...");
        document.head.appendChild(script);
        console.log("[RelayerSDKLoader] Script added!");
      };

      attemptLoad();
    });
  }


}

function isFhevmRelayerSDKType(
  o: unknown,
  trace?: TraceType
): o is FhevmRelayerSDKType {
  if (typeof o === "undefined") {
    trace?.("RelayerSDKLoader: relayerSDK is undefined");
    return false;
  }
  if (o === null) {
    trace?.("RelayerSDKLoader: relayerSDK is null");
    return false;
  }
  if (typeof o !== "object") {
    trace?.("RelayerSDKLoader: relayerSDK is not an object");
    return false;
  }
  if (!objHasProperty(o, "initSDK", "function", trace)) {
    trace?.("RelayerSDKLoader: relayerSDK.initSDK is invalid");
    return false;
  }
  if (!objHasProperty(o, "createInstance", "function", trace)) {
    trace?.("RelayerSDKLoader: relayerSDK.createInstance is invalid");
    return false;
  }
  if (!objHasProperty(o, "SepoliaConfig", "object", trace)) {
    trace?.("RelayerSDKLoader: relayerSDK.SepoliaConfig is invalid");
    return false;
  }
  if ("__initialized__" in o) {
    if (o.__initialized__ !== true && o.__initialized__ !== false) {
      trace?.("RelayerSDKLoader: relayerSDK.__initialized__ is invalid");
      return false;
    }
  }
  return true;
}

export function isFhevmWindowType(
  win: unknown,
  trace?: TraceType
): win is FhevmWindowType {
  if (typeof win === "undefined") {
    trace?.("RelayerSDKLoader: window object is undefined");
    return false;
  }
  if (win === null) {
    trace?.("RelayerSDKLoader: window object is null");
    return false;
  }
  if (typeof win !== "object") {
    trace?.("RelayerSDKLoader: window is not an object");
    return false;
  }
  if (!("relayerSDK" in win)) {
    trace?.("RelayerSDKLoader: window does not contain 'relayerSDK' property");
    return false;
  }
  return isFhevmRelayerSDKType(win.relayerSDK);
}

function objHasProperty<
  T extends object,
  K extends PropertyKey,
  V extends string // "string", "number", etc.
>(
  obj: T,
  propertyName: K,
  propertyType: V,
  trace?: TraceType
): obj is T &
  Record<
    K,
    V extends "string"
      ? string
      : V extends "number"
      ? number
      : V extends "object"
      ? object
      : V extends "boolean"
      ? boolean
      : V extends "function"
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (...args: any[]) => any
      : unknown
  > {
  if (!obj || typeof obj !== "object") {
    return false;
  }

  if (!(propertyName in obj)) {
    trace?.(`RelayerSDKLoader: missing ${String(propertyName)}.`);
    return false;
  }

  const value = (obj as Record<K, unknown>)[propertyName];

  if (value === null || value === undefined) {
    trace?.(`RelayerSDKLoader: ${String(propertyName)} is null or undefined.`);
    return false;
  }

  if (typeof value !== propertyType) {
    trace?.(
      `RelayerSDKLoader: ${String(propertyName)} is not a ${propertyType}.`
    );
    return false;
  }

  return true;
}
