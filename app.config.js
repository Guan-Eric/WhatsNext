import "dotenv/config";
export default {
  expo: {
    name: "WhatsNext",
    slug: "whats-next",
    version: "1.1.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    splash: {
      image: "./assets/icon.png",
      resizeMode: "contain",
      backgroundColor: "#181818",
    },
    scheme: "myapp",
    userInterfaceStyle: "dark",
    newArchEnabled: true,
    ios: {
      bundleIdentifier: "com.eronkgonk.whatsnext",
      supportsTablet: true,
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/icon.png",
        backgroundColor: "#181818",
      },
      package: "com.eronkgonk.whatsnext",
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/icon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
        },
      ],
    ],
    extra: {
      eas: {
        projectId: "50c62fe8-3b84-489d-9a13-b10c14dcad5f",
      },
      tmdbApiKey: process.env.TMDB_API_KEY,
      firebaseApiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET,
      messagingSenderId: process.env.MESSAGING_SENDER_ID,
      appId: process.env.APP_ID,
      measurementId: process.env.MEASUREMENT_ID,
      openaiOrganizationId: process.env.OPENAI_ORGANIZATION_ID,
      openaiProjectId: process.env.OPENAI_PROJECT_ID,
      openaiApiKey: process.env.OPENAI_API_KEY,
    },
    experiments: {
      typedRoutes: true,
    },
    owner: "guan-eric",
    updates: {
      url: "https://u.expo.dev/50c62fe8-3b84-489d-9a13-b10c14dcad5f",
    },
    runtimeVersion: {
      policy: "appVersion",
    },
  },
};
