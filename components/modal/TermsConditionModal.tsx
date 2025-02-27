import React from "react";
import {
  Modal,
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import { Button, CheckBox } from "@rneui/themed";

interface TermsConditionModalProps {
  modalVisible: boolean;
  onClose: () => void;
  theme: any;
}

const TermsConditionModal: React.FC<TermsConditionModalProps> = ({
  modalVisible,
  onClose,
  theme,
}) => {
  const [isCheck, setIsCheck] = useState<boolean>(false);

  return (
    <Modal
      visible={modalVisible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={{
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          justifyContent: "center",
          alignItems: "center",
        }}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContainer,
              { backgroundColor: theme.colors.grey0 },
            ]}
          >
            <ScrollView contentContainerStyle={styles.scrollContent}>
              <Text style={[styles.title, { color: theme.colors.black }]}>
                End User License Agreement (EULA) and Terms of Service
              </Text>

              <Text
                style={[styles.sectionTitle, { color: theme.colors.black }]}
              >
                1. Acceptance of Terms
              </Text>
              <Text style={[styles.paragraph, { color: theme.colors.black }]}>
                By downloading, accessing, or using the App, you agree to these
                Terms and our Privacy Policy. If you don’t agree, please don’t
                use the App.
              </Text>

              <Text
                style={[styles.sectionTitle, { color: theme.colors.black }]}
              >
                2. Prohibited Activities
              </Text>
              <Text style={[styles.paragraph, { color: theme.colors.black }]}>
                The following activities are strictly prohibited within the App:
                - Posting, sharing, or transmitting any content that is abusive,
                defamatory, hateful, obscene, or otherwise objectionable. -
                Harassing, threatening, or impersonating other users.
              </Text>

              <Text
                style={[styles.sectionTitle, { color: theme.colors.black }]}
              >
                3. Content Moderation
              </Text>
              <Text style={[styles.paragraph, { color: theme.colors.black }]}>
                All user-generated content ("UGC") will be monitored for
                compliance with this Agreement. The Company reserves the right
                to review, edit, or remove any UGC that violates these terms
                without prior notice.
              </Text>

              <Text
                style={[styles.sectionTitle, { color: theme.colors.black }]}
              >
                4. User Responsibility
              </Text>
              <Text style={[styles.paragraph, { color: theme.colors.black }]}>
                Users are solely responsible for the content they post, share,
                or interact with on the App. Users agree not to misuse any
                reporting mechanisms or falsely flag content.
              </Text>

              <Text
                style={[styles.sectionTitle, { color: theme.colors.black }]}
              >
                5. Flagging Objectionable Content
              </Text>
              <Text style={[styles.paragraph, { color: theme.colors.black }]}>
                The App provides a mechanism for users to report objectionable
                content. All reports will be reviewed by the Company within 48
                hours, and appropriate actions will be taken.
              </Text>

              <Text
                style={[styles.sectionTitle, { color: theme.colors.black }]}
              >
                6. Blocking Abusive Users
              </Text>
              <Text style={[styles.paragraph, { color: theme.colors.black }]}>
                Users can block other users within the App, preventing further
                interactions or content viewing.
              </Text>

              <Text
                style={[styles.sectionTitle, { color: theme.colors.black }]}
              >
                7. Termination
              </Text>
              <Text style={[styles.paragraph, { color: theme.colors.black }]}>
                The Company reserves the right to suspend or terminate your
                access to the App if you violate this Agreement or engage in
                prohibited activities.
              </Text>

              <Text
                style={[styles.sectionTitle, { color: theme.colors.black }]}
              >
                8. Privacy Policy
              </Text>
              <Text style={[styles.paragraph, { color: theme.colors.black }]}>
                Your use of the App is subject to the Company's Privacy Policy,
                which is incorporated into this Agreement.
              </Text>

              <Text
                style={[styles.sectionTitle, { color: theme.colors.black }]}
              >
                9. Disclaimer of Warranties
              </Text>
              <Text style={[styles.paragraph, { color: theme.colors.black }]}>
                The App is provided "as is" without any warranties of any kind,
                whether express or implied.
              </Text>

              <Text
                style={[styles.sectionTitle, { color: theme.colors.black }]}
              >
                10. Limitation of Liability
              </Text>
              <Text style={[styles.paragraph, { color: theme.colors.black }]}>
                The Company shall not be liable for any damages arising from
                your use of the App.
              </Text>

              <Text
                style={[styles.sectionTitle, { color: theme.colors.black }]}
              >
                11. Governing Law
              </Text>
              <Text style={[styles.paragraph, { color: theme.colors.black }]}>
                This Agreement shall be governed by and construed in accordance
                with the laws of Canada.
              </Text>

              <Text
                style={[styles.sectionTitle, { color: theme.colors.black }]}
              >
                12. Contact Information
              </Text>
              <Text style={[styles.paragraph, { color: theme.colors.black }]}>
                If you have any questions, please contact us at:
                gympulsecontact@gmail.com
              </Text>
              <CheckBox
                checked={isCheck}
                textStyle={{ color: theme.colors.black }}
                containerStyle={[
                  styles.checkboxContainer,
                  { backgroundColor: theme.colors.grey0 },
                ]}
                onPress={() => setIsCheck(!isCheck)}
                title="I declare that I have read the EULA and Terms of Service"
              />
              <Button
                disabled={!isCheck}
                buttonStyle={styles.closeButton}
                onPress={onClose}
                title={"Agree"}
              ></Button>
            </ScrollView>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "86%",
    height: "80%",
    borderRadius: 20,
    padding: 20,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 5,
  },
  checkboxContainer: {
    marginTop: 10,
  },
  closeButton: {
    marginTop: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default TermsConditionModal;
