import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import BackButton from "@/components/BackButton";
// RevenueCat imports
import Purchases, {
  PurchasesPackage,
  PurchasesOffering,
} from "react-native-purchases";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Usage comparison
const usageExamples = [
  {
    scenario: "Weekend movie night",
    free: "1 recommendation",
    premium: "Unlimited tries",
  },
  {
    scenario: "Planning watch list",
    free: "3 times total",
    premium: "As many as you want",
  },
  {
    scenario: "Finding hidden gems",
    free: "Limited filters",
    premium: "All advanced filters",
  },
];

function getPlanFeatures(planId: string): string[] {
  if (planId === "premium") {
    return [
      "Unlimited AI recommendations",
      "Advanced mood-based suggestions",
      "Multiple preference filters",
      "Release year preferences",
      "Language preferences",
      "Save generation history",
      "Priority AI processing",
    ];
  }
  if (planId === "lifetime") {
    return [
      "Everything in Premium",
      "Unlimited forever",
      "All future AI features",
      "Premium AI models",
      "Export recommendations",
      "Share custom lists",
      "VIP support",
    ];
  }
  return [
    "3 AI recommendations daily",
    "Basic genre preferences",
    "Standard recommendations",
    "Limited filters",
  ];
}

function getPlanGenerations(planId: string) {
  if (planId === "premium") return "Unlimited";
  if (planId === "lifetime") return "Unlimited Forever";
  return "3 per day";
}

function getPlanIcon(planId: string) {
  if (planId === "premium") return { icon: "lightning-bolt", color: "#ffb400" };
  if (planId === "lifetime") return { icon: "crown", color: "#f5a623" };
  return { icon: "gift", color: "#6c757d" };
}

export default function AIGenerationPaywallScreen() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [offerings, setOfferings] = useState<PurchasesOffering | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function fetchOfferings() {
      try {
        const offeringsResult = await Purchases.getOfferings();
        if (mounted && offeringsResult.current) {
          setOfferings(offeringsResult.current);
          // Set a default plan selection
          if (
            offeringsResult.current.availablePackages?.length > 0 &&
            !selectedPlan
          ) {
            setSelectedPlan(
              (offeringsResult.current.availablePackages[0]
                ?.identifier as string) || null
            );
          }
        }
      } catch (e) {
        Alert.alert(
          "Error fetching plans",
          "Couldn't load subscription options. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    }
    fetchOfferings();
    return () => {
      mounted = false;
    };
  }, []);

  const handleUpgrade = async () => {
    if (!offerings || !selectedPlan) return;
    setPurchasing(true);
    try {
      const selectedPackage = offerings.availablePackages.find(
        (pkg: PurchasesPackage) => pkg.identifier === selectedPlan
      );
      if (!selectedPackage) {
        Alert.alert(
          "Plan not found",
          "Couldn't find the selected plan. Please try again."
        );
        setPurchasing(false);
        return;
      }
      const purchaseResult = await Purchases.purchasePackage(selectedPackage);
      if (
        purchaseResult.customerInfo.entitlements.active &&
        Object.keys(purchaseResult.customerInfo.entitlements.active).length > 0
      ) {
        Alert.alert(
          "Success",
          "You are now upgraded! Enjoy unlimited AI recommendations."
        );
        router.back();
      } else {
        Alert.alert(
          "Purchase failed",
          "We couldn't activate your subscription. Please contact support."
        );
      }
    } catch (e: any) {
      if (
        e.userCancelled // RevenueCat purchase cancelled error
      ) {
        // No alert if cancelled
      } else {
        Alert.alert(
          "Purchase Error",
          e?.message || "Something went wrong. Please try again."
        );
      }
    }
    setPurchasing(false);
  };

  const handleMaybeLater = () => {
    router.back();
  };

  const renderPlans = () => {
    if (!offerings) return null;

    // Always show the "free" plan for context, then offer dynamic plans from RevenueCat
    const plansToShow = [
      {
        id: "free",
        name: "Free",
        priceString: "$0",
        period: "forever",
        popular: false,
        ...getPlanIcon("free"),
      },
      ...offerings.availablePackages.map((pkg: PurchasesPackage) => {
        const identifier = pkg.identifier;
        let popular = false;
        // e.g. you could mark the "annual" as most popular depending on identifier
        if (identifier.toLowerCase().includes("annual")) popular = true;
        if (identifier.toLowerCase().includes("lifetime")) popular = true;
        return {
          id: identifier,
          name: pkg.product.title || identifier,
          priceString: pkg.product.priceString,
          period: pkg.product.subscriptionPeriod
            ? `per ${pkg.product.subscriptionPeriod?.unit?.toLowerCase()}`
            : pkg.product.introPrice &&
              pkg.product.introPrice.paymentMode === "PAY_AS_YOU_GO"
            ? "trial"
            : pkg.identifier.toLowerCase().includes("lifetime")
            ? "one-time"
            : "",
          popular,
          ...getPlanIcon(
            identifier.toLowerCase().includes("lifetime")
              ? "lifetime"
              : "premium"
          ),
          rcPackage: pkg,
        };
      }),
    ];

    return plansToShow.map((plan, idx) => (
      <Pressable
        key={plan.id}
        className={`mb-4 rounded-2xl overflow-hidden border-2 ${
          selectedPlan === plan.id
            ? "border-primary shadow-lg"
            : "border-grey-dark-2"
        }`}
        disabled={plan.id === "free"}
        onPress={() => plan.id !== "free" && setSelectedPlan(plan.id)}
      >
        <View className="bg-grey-dark-1 p-5">
          {plan.popular && (
            <View className="absolute top-0 right-4 bg-primary rounded-b-lg px-3 py-1.5 z-10">
              <Text className="text-white text-xs font-bold">
                ⭐ BEST VALUE
              </Text>
            </View>
          )}

          {/* Plan Header */}
          <View className="flex-row items-center justify-between mb-4 mt-2">
            <View className="flex-row items-center flex-1">
              <View className="bg-grey-dark-2 rounded-full p-2 mr-3">
                <MaterialCommunityIcons
                  name={plan.icon as any}
                  size={24}
                  color={plan.color}
                />
              </View>
              <View className="flex-1">
                <Text className="text-text-dark text-xl font-bold">
                  {plan.name}
                </Text>
                <View className="flex-row items-baseline">
                  <Text
                    className="text-2xl font-bold"
                    style={{ color: plan.color }}
                  >
                    {plan.priceString}
                  </Text>
                  {plan.period && (
                    <Text className="text-grey-dark-5 text-xs ml-1">
                      /{plan.period}
                    </Text>
                  )}
                </View>
              </View>
            </View>
            <View
              className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                selectedPlan === plan.id
                  ? "border-primary bg-primary"
                  : "border-grey-dark-4"
              }`}
            >
              {selectedPlan === plan.id && (
                <View className="w-3 h-3 rounded-full bg-white" />
              )}
            </View>
          </View>

          {/* AI Generations Badge */}
          <View className="bg-grey-dark-2 rounded-lg p-2 mb-3 flex-row items-center justify-center">
            <MaterialCommunityIcons name="robot" size={16} color={plan.color} />
            <Text
              className="font-bold text-sm ml-1"
              style={{ color: plan.color }}
            >
              {getPlanGenerations(plan.id)}
            </Text>
          </View>

          {/* Features */}
          <View>
            {getPlanFeatures(plan.id).map((feature, idx2) => (
              <View key={idx2} className="flex-row items-start mb-2">
                <MaterialCommunityIcons
                  name="check-circle"
                  size={16}
                  color="#28a745"
                  style={{ marginTop: 2 }}
                />
                <Text className="text-grey-dark-5 text-sm ml-2 flex-1">
                  {feature}
                </Text>
              </View>
            ))}
          </View>

          {/* Lifetime Savings Badge Example (if RevenueCat plan is lifetime) */}
          {plan.period === "one-time" && (
            <View className="mt-3 bg-secondary/20 rounded-lg p-2 border border-secondary/30">
              <Text className="text-secondary text-xs text-center font-semibold">
                💎 Save big vs yearly plans!
              </Text>
            </View>
          )}
        </View>
      </Pressable>
    ));
  };

  return (
    <View className="flex-1 bg-background-dark">
      <SafeAreaView className="flex-1">
        <BackButton />
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <View className="px-6">
            {/* Hero Section */}
            <View className="items-center mt-4 mb-8">
              {/* AI Icon */}
              <View className="bg-gradient-to-br from-primary to-secondary rounded-full p-6 mb-4">
                <MaterialCommunityIcons
                  name="robot-excited"
                  size={64}
                  color="#fff"
                />
              </View>
              {/* Title */}
              <Text className="text-text-dark text-3xl font-bold text-center mb-2">
                Unlock AI Magic
              </Text>
              {/* Subtitle */}
              <Text className="text-grey-dark-5 text-center text-base px-4 mb-4">
                Get unlimited personalized recommendations powered by advanced
                AI
              </Text>
              {/* Daily Limit Warning */}
              <View className="bg-error/20 border border-error/40 rounded-xl p-4 w-full">
                <View className="flex-row items-center">
                  <MaterialCommunityIcons
                    name="alert-circle"
                    size={24}
                    color="#dc3545"
                  />
                  <Text className="text-error font-bold ml-2 flex-1">
                    Daily Limit Reached
                  </Text>
                </View>
                <Text className="text-grey-dark-5 text-sm mt-2">
                  You've used all 3 free AI generations today. Upgrade to get
                  unlimited access!
                </Text>
              </View>
            </View>

            {/* What You're Missing Section */}
            <View className="bg-grey-dark-1 rounded-2xl p-5 mb-6">
              <Text className="text-text-dark text-xl font-bold mb-4">
                What You're Missing
              </Text>
              {usageExamples.map((example, index) => (
                <View key={index} className="mb-4">
                  <Text className="text-text-dark font-semibold mb-2">
                    {example.scenario}
                  </Text>
                  <View className="flex-row justify-between">
                    <View className="flex-1 mr-2">
                      <View className="bg-grey-dark-2 rounded-lg p-3">
                        <Text className="text-grey-dark-5 text-xs mb-1">
                          FREE
                        </Text>
                        <Text className="text-text-dark font-semibold">
                          {example.free}
                        </Text>
                      </View>
                    </View>
                    <View className="flex-1 ml-2">
                      <View className="bg-primary/20 border border-primary rounded-lg p-3">
                        <Text className="text-primary text-xs mb-1">
                          PREMIUM
                        </Text>
                        <Text className="text-primary font-bold">
                          {example.premium}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>

            {/* Pricing Plans */}
            <Text className="text-text-dark text-2xl font-bold mb-4">
              Choose Your Plan
            </Text>
            {loading ? (
              <View className="py-12 items-center">
                <ActivityIndicator size="large" color="#ffb400" />
                <Text className="text-grey-dark-5 mt-4">Loading plans...</Text>
              </View>
            ) : (
              renderPlans()
            )}

            {/* CTA Buttons */}
            <View className="mt-4">
              {/* Upgrade Button */}
              <Pressable
                className={`bg-primary rounded-[20px] h-14 items-center justify-center mb-4 active:opacity-80 shadow-lg ${
                  purchasing ? "opacity-70" : ""
                }`}
                onPress={handleUpgrade}
                disabled={
                  !selectedPlan ||
                  selectedPlan === "free" ||
                  loading ||
                  purchasing
                }
              >
                {purchasing ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-white font-bold text-lg">Upgrade</Text>
                )}
              </Pressable>
              {/* Maybe Later Button */}
              <Pressable
                className="h-12 items-center justify-center active:opacity-60"
                onPress={handleMaybeLater}
                disabled={purchasing}
              >
                <Text className="text-grey-dark-5 font-semibold">
                  Maybe Later
                </Text>
              </Pressable>
            </View>

            {/* Social Proof */}
            <View className="mt-6 bg-grey-dark-1 rounded-xl p-4">
              <View className="flex-row items-center mb-3">
                <View className="flex-row">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <MaterialCommunityIcons
                      key={star}
                      name="star"
                      size={16}
                      color="#ffb400"
                    />
                  ))}
                </View>
                <Text className="text-grey-dark-5 text-sm ml-2">
                  4.9/5 from 10,000+ users
                </Text>
              </View>
              <Text className="text-grey-dark-5 text-sm italic">
                "The AI recommendations are incredibly accurate! I've discovered
                so many great shows I wouldn't have found otherwise."
              </Text>
              <Text className="text-grey-dark-5 text-xs mt-2">
                - Sarah M., Premium User
              </Text>
            </View>

            {/* Trust Indicators */}
            <View className="flex-row justify-center items-center mt-6 mb-4 flex-wrap">
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
              <View className="flex-row items-center mx-3 my-1">
                <MaterialCommunityIcons
                  name="currency-usd-off"
                  size={16}
                  color="#28a745"
                />
                <Text className="text-grey-dark-5 text-xs ml-1">
                  Money-back Guarantee
                </Text>
              </View>
            </View>

            {/* Terms */}
            <Text className="text-grey-dark-5 text-xs text-center leading-4 mt-2 px-4">
              Subscription automatically renews unless canceled at least 24
              hours before the end of the current period.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
