import { createContext, useContext, useState } from "react";

type OnboardingContext = {
  name: string,
  birthdate: Date;
  illness?: string,

  setName : (name: string) => void
  setBirthDate : (date: Date) => void
  setIllness: (illness?: string) => void
}

const OnboardingContext = createContext<OnboardingContext | undefined>(undefined);

export const OnboardingProvider = ({children} : {children: React.ReactNode}) => {
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState<Date>(new Date())
  const [illness, setIllnesss] = useState<string|undefined>();
  return <OnboardingContext.Provider value={{
    name : name,
    birthdate: birthDate,
    illness: illness,
    setName: setName,
    setBirthDate: setBirthDate,
    setIllness: setIllnesss,
  }} >
    {children}
  </OnboardingContext.Provider>
}


export const useOnboardingContext = (): OnboardingContext => {
  const context = useContext(OnboardingContext);
  if(!context){
    throw new Error(`useOnboardingContext must be used inside the OnboardingProvider`);
  }
  return context;
}