import React from "react";
import { Modal, View, Image, Text, Pressable } from "react-native";
import { WatchProvider } from "../types";

interface WatchProviderModalProps {
  modalVisible: boolean;
  onClose: () => void;
  providers: { [category: string]: WatchProvider[] };
}

const WatchProviderModal: React.FC<WatchProviderModalProps> = ({
  modalVisible,
  onClose,
  providers,
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
      <View className="flex-1 justify-center items-center bg-black/70">
        <View className="w-[90%] max-w-[400px] p-5 rounded-2xl items-center bg-[#181818]">
          <Text className="text-2xl font-bold mb-5 text-center text-black dark:text-white">
            Where to Watch
          </Text>

          {Object.keys(providers).length === 0 ? (
            <Text className="text-base text-center mb-5 text-black dark:text-white">
              No streaming providers available in your region
            </Text>
          ) : (
            Object.entries(providers).map(
              ([category, providerList]) =>
                providerList &&
                providerList.length > 0 && (
                  <View key={category} className="w-full mb-5">
                    <Text className="text-lg pl-2.5 mb-2.5 text-black dark:text-white">
                      {categoryTitles[category] || category}
                    </Text>

                    <View className="flex-row flex-wrap justify-start">
                      {providerList.map((provider: WatchProvider) => (
                        <Image
                          key={provider.provider_id}
                          source={{ uri: provider.logo_path || "" }}
                          className="w-[60px] h-[60px] rounded-lg mx-1"
                          resizeMode="contain"
                        />
                      ))}
                    </View>
                  </View>
                )
            )
          )}

          <Pressable
            onPress={onClose}
            className="bg-[#3a3a3a] rounded-full px-5 py-2"
          >
            <Text className="text-white text-base font-semibold">Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default WatchProviderModal;
