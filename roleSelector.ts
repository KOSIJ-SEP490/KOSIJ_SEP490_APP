import Constants from "expo-constants";

const appRole = Constants.expoConfig?.extra?.appRole || "customer";

export default function getAppByRole() {
  switch (appRole) {
    case "delivery":
      return require("./apps/delivery/index.ts").default;
    case "consulting":
      return require("./apps/consulting/index.ts").default;
    default:
      return require("./apps/customer/index.ts").default;
  }
}
