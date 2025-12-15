import { Redirect } from "expo-router";

export default function Index() {
  // Use the Redirect component which is safe during initial mount
  return <Redirect href="/(tabs)/home" />;
}
