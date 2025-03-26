import React, { useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../../firebaseConfig";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme, Card, Icon, Button } from "@rneui/themed";
import { logOut } from "../../../backend/auth";
import { Href, router } from "expo-router";
import BackButton from "../../../components/BackButton";
import DeleteAccountModal from "@/components/modal/DeleteAccountModal";
import { deleteAccount } from "@/backend/user";

function ProfileScreen() {
  const { theme } = useTheme();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleDeleteAccount = async () => {
    setIsModalVisible(false);
    router.push("/(auth)/welcome");
    await deleteAccount();
    await FIREBASE_AUTH.currentUser.delete();
  };
  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <SafeAreaView>
        <View style={{ flexDirection: "row" }}>
          <BackButton />
          <Text style={[styles.title, { color: theme.colors.black }]}>
            Profile
          </Text>
        </View>

        {[
          {
            title: "My List",
            route: "/(tabs)/(watchlist)/MyListScreen",
          },
          //{ title: "App Settings", route: "/(tabs)/(profile)/notifications" },
        ].map((item, index) => (
          <Card
            key={index}
            containerStyle={[
              styles.card,
              {
                backgroundColor: theme.colors.grey0,
                borderColor: theme.colors.grey0,
              },
            ]}
          >
            <Button
              type="clear"
              title={item.title}
              onPress={() => router.push(item.route as Href)}
              containerStyle={styles.buttonContainer}
              buttonStyle={styles.buttonStyle}
              titleStyle={[styles.buttonTitle, { color: theme.colors.black }]}
              iconPosition="right"
              icon={
                <Icon
                  name="chevron-right"
                  type="material-community"
                  size={20}
                  color={theme.colors.black}
                />
              }
            />
          </Card>
        ))}
        <View>
          <Button
            style={{ padding: 20, width: 200, alignSelf: "center" }}
            buttonStyle={{
              borderRadius: 20,
              backgroundColor: theme.colors.grey2,
            }}
            titleStyle={{ fontFamily: "Lato_700Bold" }}
            onPress={() => logOut()}
            title="Log Out"
          />
        </View>
        <View style={{ marginTop: 20, marginBottom: 20 }}>
          <Button
            style={{ padding: 20, width: 200, alignSelf: "center" }}
            buttonStyle={{
              borderRadius: 20,
              backgroundColor: theme.colors.error,
            }}
            title="Delete Account"
            titleStyle={{ fontFamily: "Lato_700Bold" }}
            onPress={() => setIsModalVisible(true)}
            color={theme.colors.error}
          />
        </View>
        <DeleteAccountModal
          modalVisible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onDeleteAccount={() => handleDeleteAccount()}
          onCancel={() => setIsModalVisible(false)}
          theme={theme}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    borderRadius: 20,
  },
  buttonContainer: {
    width: "100%",
  },
  buttonStyle: {
    justifyContent: "space-between",
    paddingHorizontal: 0,
  },
  buttonTitle: {
    textAlign: "left",
    fontSize: 16,
    fontFamily: "Lato_700Bold",
  },
  title: {
    fontFamily: "Lato_700Bold",
    fontSize: 32,
  },
});

export default ProfileScreen;
