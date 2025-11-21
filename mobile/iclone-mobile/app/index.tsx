import { useRouter } from "expo-router";
import { useState } from "react";

export default function Index() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(false);

  if(isAuthenticated){
    router.replace(
      "/home"
    );
  }else if(isAuthenticated != null && isAuthenticated == false){
    router.replace('/signUp')
  }
}