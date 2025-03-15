import React from "react";
import { useTheme } from "@rneui/themed";
import { useLocalSearchParams } from "expo-router";
import PersonDetails from "@/components/PersonDetails";

function PersonDetailsScreen() {
  const { theme } = useTheme();
  const { personId, profilePath } = useLocalSearchParams();

  return (
    <PersonDetails
      theme={theme}
      personId={personId as string}
      profilePath={profilePath as string}
      tab={"(generate)"}
    />
  );
}

export default PersonDetailsScreen;
