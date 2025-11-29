import React, { useState } from "react";
import { Modal, View, Text, Pressable } from "react-native";
import { Rating } from "react-native-ratings";

interface StreakModalProps {
  modalVisible: boolean;
  onClose: () => void;
  save: (rating: number) => void;
}

const RatingModal: React.FC<StreakModalProps> = ({
  modalVisible,
  onClose,
  save,
}) => {
  const [rating, setRating] = useState(2.5);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/40">
        <View className="w-[300px] p-5 rounded-2xl items-center bg-grey-1 dark:bg-grey-dark-1">
          <Rating
            tintColor="#e9ecef"
            type="custom"
            style={{ paddingVertical: 10 }}
            imageSize={40}
            ratingBackgroundColor="#000000"
            onFinishRating={(value: number) => {
              setRating(value);
            }}
            ratingCount={5}
            showRating
            fractions={1}
            jumpValue={0.5}
          />

          <View className="flex-col w-full">
            <Pressable
              onPress={() => save(rating)}
              className="p-2.5 my-1 rounded-lg w-full items-center bg-primary dark:bg-primary-dark"
            >
              <Text className="text-base text-white">Save</Text>
            </Pressable>

            <Pressable
              onPress={() => onClose()}
              className="p-2.5 my-1 rounded-lg w-full items-center bg-grey-2 dark:bg-grey-dark-2"
            >
              <Text className="text-base text-white">Close</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default RatingModal;
