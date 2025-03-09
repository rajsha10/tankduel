"use client";

import { useEffect, useRef } from "react";
import './tank.css';

export default function TankGame() {
  const unityContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Load UnityProgress.js first
      const progressScript = document.createElement("script");
      progressScript.src = "/TemplateData/UnityProgress.js"; // Ensure this file exists
      progressScript.onload = () => {
        console.log("UnityProgress.js loaded");
        
        // Load UnityLoader.js after UnityProgress.js is ready
        const unityScript = document.createElement("script");
        unityScript.src = "/Build/UnityLoader.js"; // Ensure this path is correct
        unityScript.onload = () => {
          console.log("UnityLoader.js loaded");

          if ((window as any).UnityLoader) {
            (window as any).unityInstance = (window as any).UnityLoader.instantiate(
              "unityContainer",
              "/Build/webglbuild.json",
              {
                onProgress: (window as any).UnityProgress || (() => {}), // Use default function if undefined
              }
            );
          } else {
            console.error("UnityLoader is not available");
          }
        };
        document.body.appendChild(unityScript);
      };

      document.body.appendChild(progressScript);
    }
  }, []);

  return (
    <div className="webgl-content">
      <div
        id="unityContainer"
        ref={unityContainerRef}
        style={{ width: "1280px", height: "720px" }}
      ></div>
      <div className="footer">
        <div className="webgl-logo"></div>
        <div
          className="fullscreen"
          onClick={() => (window as any).unityInstance?.SetFullscreen(1)}
        ></div>
        <div className="title">Tank Game</div>
      </div>
    </div>
  );
}
 