import { Button } from "@rneui/themed";
import React from "react";
import {
  Modal,
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Platform,
} from "react-native";

interface WatchProviderModalProps {
  modalVisible: boolean;
  onClose: () => void;
  providers: { [category: string]: WatchProvider[] };
  theme: any;
}

const WatchProviderModal: React.FC<WatchProviderModalProps> = ({
  modalVisible,
  onClose,
  providers,
  theme,
}) => {
  const categoryTitles: { [key: string]: string } = {
    flatrate: "Stream On",
    free: "Free On",
    ads: "Free with Ads On",
    rent: "Rent On",
    buy: "Buy On",
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={onClose}
    >
      <View
        style={[styles.modalOverlay, { backgroundColor: "rgba(0, 0, 0, 0.7)" }]}
      >
        <View
          style={[
            styles.modalContent,
            { backgroundColor: theme.colors.background },
          ]}
        >
          <Text style={[styles.title, { color: theme.colors.black }]}>
            Where to Watch
          </Text>
          {Object.keys(providers).length === 0 ? (
            <Text
              style={[styles.noProvidersText, { color: theme.colors.black }]}
            >
              No streaming providers available in your region
            </Text>
          ) : (
            Object.entries(providers).map(
              ([category, providerList]) =>
                providerList &&
                providerList.length > 0 && (
                  <View key={category} style={styles.categoryContainer}>
                    <Text
                      style={[
                        styles.categoryTitle,
                        { color: theme.colors.black },
                      ]}
                    >
                      {categoryTitles[category] || category}
                    </Text>
                    <View style={styles.providerContainer}>
                      {providerList.map((provider: WatchProvider) => (
                        <Image
                          source={{ uri: provider.logo_path || "" }}
                          style={styles.providerLogo}
                          resizeMode="contain"
                        />
                      ))}
                    </View>
                  </View>
                )
            )
          )}
          <Button onPress={onClose} buttonStyle={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </Button>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    maxWidth: 400,
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  categoryContainer: {
    width: "100%",
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 18,
    paddingLeft: 10,
    marginBottom: 10,
  },
  providerContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  providerLogo: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  providerName: {
    fontSize: 12,
    textAlign: "center",
    fontWeight: "500",
  },
  noProvidersText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: "#3a3a3a",
    borderRadius: 25,
    paddingHorizontal: 20,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default WatchProviderModal;
