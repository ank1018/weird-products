import { Brain } from "lucide-react";

// Doodle style elements
export const DoodleArrow = () => (
  <svg width="40" height="20" viewBox="0 0 40 20" className="ml-1">
    <path
      d="M0,10 C10,5 20,0 30,10 L25,5 M30,10 L25,15"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ strokeDasharray: "1, 0" }}
    />
  </svg>
);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const DoodleBox = ({ children }: any) => (
  <div className="relative border-2 border-indigo-500 rounded-xl p-6 bg-white">
    <div className="absolute -top-3 -left-3 w-6 h-6 bg-purple-200 rounded-full border-2 border-indigo-500"></div>
    <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-yellow-200 rounded-full border-2 border-indigo-500"></div>
    <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-green-200 rounded-full border-2 border-indigo-500"></div>
    <div className="absolute -top-3 -right-3 w-6 h-6 bg-pink-200 rounded-full border-2 border-indigo-500"></div>
    {children}
  </div>
);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const DoodleButton = ({ children, onClick, className }: any) => (
  <button
    onClick={onClick}
    className={`relative overflow-hidden font-medium rounded-xl border-2 border-indigo-500 bg-white hover:bg-indigo-50 transition-all text-indigo-600 ${className}`}
  >
    <div className="relative z-10 p-3">{children}</div>
    <svg
      className="absolute bottom-0 left-0 w-full"
      height="6"
      viewBox="0 0 100 6"
    >
      <path
        d="M 0 3 Q 10 6 20 3 Q 30 0 40 3 Q 50 6 60 3 Q 70 0 80 3 Q 90 6 100 3"
        fill="none"
        stroke="#6366f1"
        strokeWidth="2"
      />
    </svg>
  </button>
);

export const BrainAnimation = () => (
  <div className="relative w-24 h-24 mx-auto mb-4">
    <Brain className="w-20 h-20 mx-auto text-indigo-500" />
    <div className="absolute top-0 left-0 w-full h-full">
      <div className="absolute top-1 left-6 w-3 h-3 bg-yellow-300 rounded-full animate-ping opacity-75"></div>
      <div
        className="absolute top-3 right-6 w-2 h-2 bg-pink-400 rounded-full animate-ping opacity-75"
        style={{ animationDelay: "0.5s" }}
      ></div>
      <div
        className="absolute bottom-4 left-4 w-2 h-2 bg-green-400 rounded-full animate-ping opacity-75"
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className="absolute bottom-6 right-4 w-3 h-3 bg-blue-400 rounded-full animate-ping opacity-75"
        style={{ animationDelay: "1.5s" }}
      ></div>
    </div>
  </div>
);
