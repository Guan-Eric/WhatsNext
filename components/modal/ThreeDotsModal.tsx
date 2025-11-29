import React, { useState } from "react";
import { Modal, View, TouchableOpacity, Pressable, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ModalOptions } from "../types";

interface ThreeDotsModalProps {
  options: ModalOptions[];
}

const ThreeDotsModal: React.FC<ThreeDotsModalProps> = ({ options }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  return (
    <View>
      <Pressable onPress={toggleModal} className="p-2">
        <MaterialCommunityIcons name="dots-vertical" size={24} color="#000" />
      </Pressable>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}
      >
        <TouchableOpacity
          className="flex-1 bg-black/50 justify-center items-center"
          activeOpacity={1}
          onPress={toggleModal}
        >
          <View className="rounded-2xl w-[300px] p-5 bg-grey-dark-0">
            {options?.map((option, index) => (
              <Pressable
                key={index}
                style={option?.containerStyle}
                className="p-2.5 my-1 rounded-lg w-full"
                onPress={() => {
                  option?.onPress?.();
                  toggleModal();
                }}
              >
                <Text className="text-base font-bold text-black dark:text-white">
                  {option?.title}
                </Text>
              </Pressable>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default ThreeDotsModal;
