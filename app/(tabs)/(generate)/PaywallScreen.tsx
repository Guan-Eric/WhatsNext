// app/(auth)/paywall.tsx - WITH YOUR SPECIFIC PLANS
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  StatusBar,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Purchases, {
  PurchasesPackage,
  PurchasesOffering,
} from "react-native-purchases";

const premiumFeatures = [
  {
    icon: "robot",
    title: "Unlimited AI Recommendations",
    description: "Generate as many personalized lists as you want",
  },
  {
    icon: "lightning-bolt",
    title: "Priority AI Processing",
    description: "Get your recommendations faster",
  },
  {
    icon: "history",
    title: "Save Generation History",
    description: "Access all your previous lists",
  },
  {
    icon: "star-circle",
    title: "Premium AI Models",
    description: "Most advanced algorithms",
  },
];

export default function PaywallScreen() {
  const [offering, setOffering] = useState<PurchasesOffering | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string>("annual");

  useEffect(() => {
    loadOfferings();
  }, []);

  const loadOfferings = async () => {
    try {
      const offerings = await Purchases.getOfferings();
      if (offerings.current) {
        setOffering(offerings.current);
        // Default to annual (best value)
        setSelectedPackage("annual");
      }
    } catch (error) {
      console.error("Error loading offerings:", error);
      Alert.alert("Error", "Couldn't load plans. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!offering) return;

    setPurchasing(true);
    try {
      // Get the selected package
      const pkg = offering.availablePackages.find(
        (p) => p.identifier === selectedPackage
      );

      if (!pkg) {
        Alert.alert("Error", "Selected plan not found.");
        setPurchasing(false);
        return;
      }

      const { customerInfo } = await Purchases.purchasePackage(pkg);

      // Check if user has premium entitlement
      if (customerInfo.entitlements.active["premium"]) {
        Alert.alert("Success! 🎉", "Welcome to Premium!", [
          {
            text: "Let's Go!",
            onPress: () => router.push("/(tabs)/(generate)/GenerateScreen"),
          },
        ]);
      }
    } catch (error: any) {
      if (!error.userCancelled) {
        Alert.alert("Purchase Error", error?.message || "Please try again.");
      }
    } finally {
      setPurchasing(false);
    }
  };

  const getPackageDetails = (pkg: PurchasesPackage) => {
    const isWeekly = pkg.identifier === "weekly";
    const isAnnual = pkg.identifier === "annual";

    if (isWeekly) {
      return {
        name: "Weekly",
        badge: "3-DAY FREE TRIAL",
        description: "Try free for 3 days",
        savings: null,
        perMonth: null,
      };
    }

    if (isAnnual) {
      // Calculate savings vs weekly
      // Weekly: $3.99/week × 52 weeks = $207.48/year
      // Annual: $24.99/year
      // Savings: $182.49 (88% off)
      return {
        name: "Annual",
        badge: "BEST VALUE - Save 88%",
        description: "Best value • Cancel anytime",
        savings: "Save $182 vs weekly",
        perMonth: "Just $2.08/month",
      };
    }

    return {
      name: pkg.product.title,
      badge: null,
      description: "Cancel anytime",
      savings: null,
      perMonth: null,
    };
  };

  const renderPricingCards = () => {
    if (!offering) return null;

    // Sort packages: annual first, then weekly
    const sortedPackages = [...offering.availablePackages].sort((a, b) => {
      if (a.identifier === "annual") return -1;
      if (b.identifier === "annual") return 1;
      return 0;
    });

    return sortedPackages.map((pkg) => {
      const isSelected = selectedPackage === pkg.identifier;
      const details = getPackageDetails(pkg);
      const isAnnual = pkg.identifier === "annual";

      return (
        <Pressable
          key={pkg.identifier}
          onPress={() => setSelectedPackage(pkg.identifier)}
          className={`mb-4 rounded-2xl border-2 p-5 ${
            isSelected
              ? "border-primary bg-primary/10"
              : "border-grey-dark-2 bg-grey-dark-1"
          }`}
        >
          {/* Badge */}
          {details.badge && (
            <View className="absolute -top-2 right-4 bg-success rounded-full px-3 py-1">
              <Text className="text-white text-xs font-bold">
                {details.badge}
              </Text>
            </View>
          )}

          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-1">
              {/* Plan Name */}
              <Text
                className={`text-xl font-bold mb-1 ${
                  isSelected ? "text-primary" : "text-text-dark"
                }`}
              >
                {details.name}
              </Text>

              {/* Description */}
              <Text className="text-sm text-grey-dark-5 mb-2">
                {details.description}
              </Text>

              {/* Price */}
              <View className="flex-row items-baseline mb-2">
                <Text
                  className={`text-3xl font-bold ${
                    isSelected ? "text-primary" : "text-text-dark"
                  }`}
                >
                  {pkg.product.priceString}
                </Text>
                <Text className="text-sm text-grey-dark-5 ml-2">
                  /{pkg.identifier}
                </Text>
              </View>

              {/* Per month for annual */}
              {details.perMonth && (
                <View className="bg-grey-dark-2 rounded-lg px-3 py-1.5 mb-2">
                  <Text className="text-xs text-grey-dark-5 text-center">
                    {details.perMonth}
                  </Text>
                </View>
              )}

              {/* Savings */}
              {details.savings && (
                <Text className="text-success text-sm font-semibold">
                  {details.savings}
                </Text>
              )}
            </View>

            {/* Radio Button */}
            <View
              className={`w-7 h-7 rounded-full border-2 items-center justify-center ${
                isSelected ? "border-primary bg-primary" : "border-grey-dark-4"
              }`}
            >
              {isSelected && (
                <View className="w-3.5 h-3.5 rounded-full bg-white" />
              )}
            </View>
          </View>
        </Pressable>
      );
    });
  };

  return (
    <View className="flex-1 bg-background-dark">
      <StatusBar barStyle="light-content" />
      <SafeAreaView className="flex-1">
        {/* Close Button */}
        <View className="flex-row justify-end px-6 pt-2">
          <Pressable
            onPress={() => router.replace("/(tabs)/(home)/HomeScreen")}
            className="h-10 w-10 items-center justify-center"
            disabled={purchasing}
          >
            <MaterialCommunityIcons name="close" size={24} color="#f8f9fa" />
          </Pressable>
        </View>

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 200 }}
        >
          <View className="px-6">
            {/* Hero */}
            <View className="items-center mb-8">
              <View className="bg-grey-dark-1 rounded-full p-6 mb-4">
                <MaterialCommunityIcons
                  name="robot-excited"
                  size={64}
                  color="#ffb400"
                />
              </View>
              <Text className="text-text-dark text-4xl font-bold text-center mb-3">
                Go Premium
              </Text>
              <Text className="text-grey-dark-5 text-center text-base px-4">
                Unlock unlimited AI recommendations
              </Text>
            </View>

            {/* Features */}
            <View className="mb-8">
              {premiumFeatures.map((feature, index) => (
                <View key={index} className="mb-5 flex-row items-start">
                  <View className="mr-4 h-12 w-12 items-center justify-center rounded-xl bg-primary/20">
                    <MaterialCommunityIcons
                      name={feature.icon as any}
                      size={24}
                      color="#ffb400"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="mb-1 text-base font-bold text-text-dark">
                      {feature.title}
                    </Text>
                    <Text className="text-sm text-grey-dark-5">
                      {feature.description}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Pricing */}
            <Text className="text-text-dark text-2xl font-bold mb-4">
              Choose Your Plan
            </Text>

            {loading ? (
              <View className="py-12 items-center">
                <ActivityIndicator size="large" color="#ffb400" />
                <Text className="text-grey-dark-5 mt-4">Loading plans...</Text>
              </View>
            ) : (
              renderPricingCards()
            )}

            {/* Social Proof */}
            <View className="bg-success/10 border border-success/30 rounded-2xl p-5 mb-4">
              <View className="flex-row items-center justify-center mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <MaterialCommunityIcons
                    key={star}
                    name="star"
                    size={20}
                    color="#ffb400"
                  />
                ))}
              </View>
              <Text className="text-center text-sm font-bold text-success mb-2">
                "Best $25 I've spent on an app!"
              </Text>
              <Text className="text-center text-xs text-grey-dark-5">
                Join 10,000+ premium members
              </Text>
            </View>

            {/* Trust */}
            <View className="flex-row justify-center items-center mb-4 flex-wrap">
              <View className="flex-row items-center mx-3 my-1">
                <MaterialCommunityIcons
                  name="shield-check"
                  size={16}
                  color="#28a745"
                />
                <Text className="text-grey-dark-5 text-xs ml-1">Secure</Text>
              </View>
              <View className="flex-row items-center mx-3 my-1">
                <MaterialCommunityIcons
                  name="refresh"
                  size={16}
                  color="#28a745"
                />
                <Text className="text-grey-dark-5 text-xs ml-1">
                  Cancel Anytime
                </Text>
              </View>
            </View>

            {/* Terms */}
            <Text className="text-grey-dark-5 text-xs text-center leading-4 px-4">
              Try free for 3 days, then{" "}
              {selectedPackage === "weekly" ? "$3.99/week" : "$24.99/year"}.
              Cancel anytime.
            </Text>
          </View>
        </ScrollView>

        {/* CTA */}
        <View className="absolute bottom-0 left-0 right-0 border-t border-grey-dark-2 bg-background-dark px-6 pb-8 pt-4">
          <Pressable
            onPress={handlePurchase}
            disabled={purchasing || !selectedPackage || loading}
            className={`overflow-hidden rounded-[30px] shadow-lg ${
              purchasing || !selectedPackage || loading ? "opacity-50" : ""
            }`}
          >
            <LinearGradient
              colors={["#fbbf24", "#f59e0b"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ paddingVertical: 20 }}
            >
              {purchasing ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-center text-lg font-bold text-white">
                  {selectedPackage === "weekly"
                    ? "Start Free Trial"
                    : "Start Annual Plan"}
                </Text>
              )}
            </LinearGradient>
          </Pressable>

          <Pressable
            onPress={() => router.push("/(tabs)/(generate)/GenerateScreen")}
            disabled={purchasing}
            className="items-center py-3 mt-2"
          >
            <Text className="text-grey-dark-5 font-semibold">
              Continue with Free
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}
