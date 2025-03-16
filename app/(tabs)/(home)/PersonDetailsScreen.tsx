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
      personId={Number(personId)}
      profilePath={profilePath as string}
      tab={"(home)"}
    />
  );
}

export default PersonDetailsScreen;
