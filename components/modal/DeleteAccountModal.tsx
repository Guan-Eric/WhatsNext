import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";

interface StreakModalProps {
  modalVisible: boolean;
  onClose: () => void;
  onDeleteAccount: () => void;
  onCancel: () => void;
}

const DeleteAccountModal: React.FC<StreakModalProps> = ({
  modalVisible,
  onClose,
  onDeleteAccount,
  onCancel,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/40">
        <View className="w-[300px] p-5 rounded-2xl items-center bg-grey-0 dark:bg-grey-dark-0">
          <Text className="text-lg font-bold mb-2.5 text-center text-black dark:text-white">
            Are you sure you want delete your account?
          </Text>

          <Text className="text-sm my-2.5 text-center text-black dark:text-white">
            This action cannot be undone.
          </Text>

          <View className="flex-col w-full">
            <TouchableOpacity
              onPress={onDeleteAccount}
              className="p-2.5 my-1 rounded-lg w-full items-center bg-error"
            >
              <Text className="text-base text-white">Yes</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onCancel}
              className="p-2.5 my-1 rounded-lg w-full items-center bg-grey-2 dark:bg-grey-dark-2"
            >
              <Text className="text-base text-black dark:text-white">No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DeleteAccountModal;
