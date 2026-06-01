/// <reference types="react" />

// Ensure the JSX namespace is available to TypeScript. Some environments
// (depending on installed @types/react and tsconfig) can still report
// "Cannot find namespace JSX" (TS2503). This file makes the connection
// explicit and provides a forgiving IntrinsicElements definition so JSX
// expressions resolve correctly.

import * as React from "react";

declare global {
  namespace JSX {
    // Element type used by React's JSX runtime
    type Element = React.ReactElement;

    // Allow any intrinsic element. This is permissive but avoids TS2503
    // errors in small projects. If you want stricter checking, replace the
    // index signature with a precise mapping of allowed tags.
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

export {};
