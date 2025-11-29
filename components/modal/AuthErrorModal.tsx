import React from "react";
import { Modal, View, Text, TouchableOpacity, Pressable } from "react-native";

interface StreakModalProps {
  modalVisible: boolean;
  onClose: () => void;
  errorMessage: string;
}

const AuthErrorModal: React.FC<StreakModalProps> = ({
  modalVisible,
  onClose,
  errorMessage,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        className="flex-1 bg-black/50 justify-center items-center"
        activeOpacity={1}
        onPress={onClose}
      >
        <View className="flex-1 justify-center items-center bg-black/40">
          <View className="w-[300px] p-5 rounded-2xl items-center bg-[#1f1f1f]">
            <Text className="text-lg font-bold text-left text-[#f8f9fa]">
              {errorMessage}
            </Text>

            <View className="flex-col w-full mt-3">
              <Pressable
                onPress={onClose}
                className="bg-[#3490de] p-2.5 my-1 rounded-lg w-full items-center"
              >
                <Text className="text-base text-[#f8f9fa]">Ok</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default AuthErrorModal;
