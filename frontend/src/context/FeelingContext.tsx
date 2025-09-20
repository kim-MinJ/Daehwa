import { createContext, useContext, useState } from "react";

interface FeelingContextType {
  selectedFeeling: string | null;
  setSelectedFeeling: (f: string | null) => void;
  triggerModal: boolean;
  setTriggerModal: (v: boolean) => void;
}

const FeelingContext = createContext<FeelingContextType | undefined>(undefined);

export const FeelingProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedFeeling, setSelectedFeeling] = useState<string | null>(null);
  const [triggerModal, setTriggerModal] = useState(false);

  return (
    <FeelingContext.Provider
      value={{ selectedFeeling, setSelectedFeeling, triggerModal, setTriggerModal }}
    >
      {children}
    </FeelingContext.Provider>
  );
};

export const useFeeling = () => {
  const ctx = useContext(FeelingContext);
  if (!ctx) throw new Error("useFeeling must be used within FeelingProvider");
  return ctx;
};