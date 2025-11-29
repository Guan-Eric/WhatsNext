import React from "react";
import { useLocalSearchParams } from "expo-router";
import PersonDetails from "@/components/PersonDetails";

function PersonDetailsScreen() {
  const { personId, profilePath } = useLocalSearchParams();

  return (
    <PersonDetails
      personId={Number(personId)}
      profilePath={profilePath as string}
      tab={"(home)"}
    />
  );
}

export default PersonDetailsScreen;
