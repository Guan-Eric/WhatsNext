import { Button, Rating } from "@rneui/base";
import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

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
  const [rating, setRating] = useState(0);
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: "#1f1f1f" }]}>
          <Text style={[styles.modalText, { color: "#f8f9fa" }]}>
            Password must:
          </Text>
          <Rating
            showRating
            imageSize={20}
            startingValue={0}
            onFinishRating={(value: number) => setRating(value)}
          />
          ;
          <View style={styles.buttonContainer}>
            <Button
              onPress={() => save(rating)}
              buttonStyle={[
                styles.newStreakButton,
                { backgroundColor: "#3490de" },
              ]}
            >
              <Text style={[styles.buttonText, { color: "#f8f9fa" }]}>
                Save
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
    backgroundColor: "#e74c3c",
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
