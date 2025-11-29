import React from "react";
import { Modal, View, Text, ScrollView, Pressable } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

interface TermsConditionModalProps {
  modalVisible: boolean;
  onClose: () => void;
}

const TermsConditionModal: React.FC<TermsConditionModalProps> = ({
  modalVisible,
  onClose,
}) => {
  const [isCheck, setIsCheck] = useState<boolean>(false);

  return (
    <Modal
      visible={modalVisible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="w-[86%] h-[80%] rounded-2xl p-5 bg-grey-dark-0">
          <ScrollView className="pb-5">
            <Text className="text-lg font-bold text-center mb-2.5 text-black dark:text-white">
              End User License Agreement (EULA) and Terms of Service
            </Text>

            <Text className="text-base font-bold mt-2.5 text-black dark:text-white">
              1. Acceptance of Terms
            </Text>
            <Text className="text-sm leading-5 mt-1 text-black dark:text-white">
              By downloading, accessing, or using the App, you agree to these
              Terms and our Privacy Policy. If you don't agree, please don't use
              the App.
            </Text>

            <Text className="text-base font-bold mt-2.5 text-black dark:text-white">
              2. Prohibited Activities
            </Text>
            <Text className="text-sm leading-5 mt-1 text-black dark:text-white">
              The following activities are strictly prohibited within the App: -
              Posting, sharing, or transmitting any content that is abusive,
              defamatory, hateful, obscene, or otherwise objectionable. -
              Harassing, threatening, or impersonating other users.
            </Text>

            <Text className="text-base font-bold mt-2.5 text-black dark:text-white">
              3. Content Moderation
            </Text>
            <Text className="text-sm leading-5 mt-1 text-black dark:text-white">
              All user-generated content ("UGC") will be monitored for
              compliance with this Agreement. The Company reserves the right to
              review, edit, or remove any UGC that violates these terms without
              prior notice.
            </Text>

            <Text className="text-base font-bold mt-2.5 text-black dark:text-white">
              4. User Responsibility
            </Text>
            <Text className="text-sm leading-5 mt-1 text-black dark:text-white">
              Users are solely responsible for the content they post, share, or
              interact with on the App. Users agree not to misuse any reporting
              mechanisms or falsely flag content.
            </Text>

            <Text className="text-base font-bold mt-2.5 text-black dark:text-white">
              5. Flagging Objectionable Content
            </Text>
            <Text className="text-sm leading-5 mt-1 text-black dark:text-white">
              The App provides a mechanism for users to report objectionable
              content. All reports will be reviewed by the Company within 48
              hours, and appropriate actions will be taken.
            </Text>

            <Text className="text-base font-bold mt-2.5 text-black dark:text-white">
              6. Termination
            </Text>
            <Text className="text-sm leading-5 mt-1 text-black dark:text-white">
              The Company reserves the right to suspend or terminate your access
              to the App if you violate this Agreement or engage in prohibited
              activities.
            </Text>

            <Text className="text-base font-bold mt-2.5 text-black dark:text-white">
              7. Privacy Policy
            </Text>
            <Text className="text-sm leading-5 mt-1 text-black dark:text-white">
              Your use of the App is subject to the Company's Privacy Policy,
              which is incorporated into this Agreement.
            </Text>

            <Text className="text-base font-bold mt-2.5 text-black dark:text-white">
              8. Disclaimer of Warranties
            </Text>
            <Text className="text-sm leading-5 mt-1 text-black dark:text-white">
              The App is provided "as is" without any warranties of any kind,
              whether express or implied.
            </Text>

            <Text className="text-base font-bold mt-2.5 text-black dark:text-white">
              9. Limitation of Liability
            </Text>
            <Text className="text-sm leading-5 mt-1 text-black dark:text-white">
              The Company shall not be liable for any damages arising from your
              use of the App.
            </Text>

            <Text className="text-base font-bold mt-2.5 text-black dark:text-white">
              10. Governing Law
            </Text>
            <Text className="text-sm leading-5 mt-1 text-black dark:text-white">
              This Agreement shall be governed by and construed in accordance
              with the laws of Canada.
            </Text>

            <Text className="text-base font-bold mt-2.5 text-black dark:text-white">
              11. Contact Information
            </Text>
            <Text className="text-sm leading-5 mt-1 text-black dark:text-white">
              If you have any questions, please contact us at:
              gympulsecontact@gmail.com
            </Text>

            <Pressable
              onPress={() => setIsCheck(!isCheck)}
              className="flex-row items-center mt-2.5 p-2 bg-grey-dark-0"
            >
              <View
                className={`w-6 h-6 rounded mr-2 items-center justify-center border-2 ${
                  isCheck
                    ? "bg-primary-dark border-primary dark:border-primary-dark"
                    : "border-primary dark:border-primary-dark bg-transparent"
                }`}
              >
                {isCheck && (
                  <Ionicons name="checkmark" size={16} color="white" />
                )}
              </View>
              <Text className="flex-1 text-black dark:text-white">
                I declare that I have read the EULA and Terms of Service
              </Text>
            </Pressable>

            <Pressable
              disabled={!isCheck}
              onPress={onClose}
              className={`mt-2.5 rounded-lg items-center p-3 bg-primary-dark ${
                !isCheck ? "opacity-50" : ""
              }`}
            >
              <Text className="text-base font-bold text-white">Agree</Text>
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default TermsConditionModal;
