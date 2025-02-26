import { Button } from "@rneui/themed";
import React, { useState } from "react";
import { Modal, View, Text, StyleSheet } from "react-native";
import { Rating } from "react-native-ratings";

interface StreakModalProps {
  modalVisible: boolean;
  onClose: () => void;
  save: (rating: number) => void;
  theme: any;
}

const RatingModal: React.FC<StreakModalProps> = ({
  modalVisible,
  onClose,
  save,
  theme,
}) => {
  const [rating, setRating] = useState(2.5);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View
          style={[styles.modalContent, { backgroundColor: theme.colors.grey1 }]}
        >
          <Rating
            type="custom"
            style={{ paddingVertical: 10, backgroundColor: theme.colors.grey1 }}
            imageSize={40}
            ratingBackgroundColor={theme.colors.grey1}
            onFinishRating={(value: number) => {
              setRating(value);
            }}
            ratingCount={5}
            showRating
            fractions={1}
            jumpValue={0.5}
          />
          <View style={styles.buttonContainer}>
            <Button
              onPress={() => save(rating)}
              buttonStyle={[styles.newStreakButton]}
            >
              <Text style={[styles.buttonText, { color: "#f8f9fa" }]}>
                Save
              </Text>
            </Button>
            <Button
              onPress={() => onClose()}
              buttonStyle={[
                styles.newStreakButton,
                { backgroundColor: theme.colors.grey2 },
              ]}
            >
              <Text style={[styles.buttonText, { color: "#f8f9fa" }]}>
                Close
              </Text>
            </Button>
          </View>
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
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  modalContent: {
    width: 300,
    padding: 20,

    borderRadius: 20,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    fontWeight: "bold",

    textAlign: "left",
  },
  modalSubText: {
    fontSize: 14,
    marginBottom: 10,
    textAlign: "left",
  },
  buttonContainer: {
    flexDirection: "column",
    width: "100%",
  },
  continueButton: {
    backgroundColor: "#27ae60",
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  newStreakButton: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
  },
});

export default RatingModal;
