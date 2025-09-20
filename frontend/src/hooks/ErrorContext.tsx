import { createContext, useContext, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface ErrorContextType {
  throwError: (message: string, code?: number) => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const ErrorProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();

  const throwError = (message: string, code = 404) => {
    navigate("/error", { state: { message, code } });
  };

  return (
    <ErrorContext.Provider value={{ throwError }}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = () => {
  const context = useContext(ErrorContext);
  if (!context) throw new Error("useError must be used within ErrorProvider");
  return context;
};

export default ErrorProvider;