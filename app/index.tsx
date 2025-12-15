import { useEffect } from "react";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the home tab when the app starts
    router.replace("/(tabs)/home");
  }, []);
  return null;
}
