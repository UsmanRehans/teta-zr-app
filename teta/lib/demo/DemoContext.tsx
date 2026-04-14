"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

interface DemoUser {
  id: string;
  name: string;
  phone: string;
  role: "customer" | "cook";
}

interface DemoContextValue {
  isDemo: boolean;
  demoRole: "customer" | "cook" | null;
  demoUser: DemoUser | null;
  enterDemo: (role: "customer" | "cook") => void;
  exitDemo: () => void;
}

const DemoContext = createContext<DemoContextValue | null>(null);

const DEMO_CUSTOMER: DemoUser = {
  id: "demo-user",
  name: "Usman",
  phone: "+961 71 000 000",
  role: "customer",
};

const DEMO_COOK: DemoUser = {
  id: "demo-cook",
  name: "Teta Maryam",
  phone: "+961 71 111 111",
  role: "cook",
};

export function DemoProvider({ children }: { children: ReactNode }) {
  const [isDemo, setIsDemo] = useState(false);
  const [demoRole, setDemoRole] = useState<"customer" | "cook" | null>(null);
  const [demoUser, setDemoUser] = useState<DemoUser | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Load demo state from sessionStorage on mount
  useEffect(() => {
    const stored = sessionStorage.getItem("teta_demo");
    if (stored) {
      try {
        const { isDemo: isDemoStored, demoRole: roleStored } = JSON.parse(stored);
        if (isDemoStored && roleStored) {
          setIsDemo(true);
          setDemoRole(roleStored);
          setDemoUser(roleStored === "cook" ? DEMO_COOK : DEMO_CUSTOMER);
        }
      } catch (e) {
        // Ignore parse errors
      }
    }
    setHydrated(true);
  }, []);

  const enterDemo = (role: "customer" | "cook") => {
    setIsDemo(true);
    setDemoRole(role);
    const user = role === "cook" ? DEMO_COOK : DEMO_CUSTOMER;
    setDemoUser(user);
    sessionStorage.setItem(
      "teta_demo",
      JSON.stringify({ isDemo: true, demoRole: role })
    );
  };

  const exitDemo = () => {
    setIsDemo(false);
    setDemoRole(null);
    setDemoUser(null);
    sessionStorage.removeItem("teta_demo");
  };

  return (
    <DemoContext.Provider value={{ isDemo, demoRole, demoUser, enterDemo, exitDemo }}>
      {children}
    </DemoContext.Provider>
  );
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error("useDemo must be used within a DemoProvider");
  }
  return context;
}
