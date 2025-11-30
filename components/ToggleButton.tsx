import React from "react";
import { View, Text, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface ToggleOption {
  value: string;
  label: string;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
}

interface ToggleButtonProps {
  options: ToggleOption[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  size?: "sm" | "md" | "lg";
}

const ToggleButton: React.FC<ToggleButtonProps> = ({
  options,
  selectedValue,
  onValueChange,
  size = "md",
}) => {
  const sizeClasses = {
    sm: "p-2 rounded-lg",
    md: "p-3 rounded-xl",
    lg: "p-4 rounded-2xl",
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  return (
    <View className="flex-row gap-4 ">
      {options.map((option) => {
        const isSelected = selectedValue === option.value;
        return (
          <Pressable
            key={option.value}
            className={`border-2 ${sizeClasses[size]} ${
              isSelected
                ? "border-primary bg-primary/20"
                : "border-grey-dark-2 bg-grey-dark-0"
            }`}
            onPress={() => onValueChange(option.value)}
          >
            <View className="flex-row items-center justify-center">
              {option.icon && (
                <MaterialCommunityIcons
                  name={option.icon}
                  size={iconSizes[size]}
                  color={isSelected ? "#ffb400" : "#6c757d"}
                />
              )}
              <Text
                className={`${option.icon ? "ml-2" : ""} font-bold ${
                  isSelected ? "text-primary" : "text-grey-dark-5"
                }`}
              >
                {option.label}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
};

export default ToggleButton;
