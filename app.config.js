export default ({ config }) => {
  const app = process.env.EXPO_APP || "customer";

  return {
    ...config,
    name:
      app === "delivery"
        ? "Delivery App"
        : app === "consulting"
        ? "Consulting App"
        : "Customer App",
    slug:
      app === "delivery"
        ? "delivery-app"
        : app === "consulting"
        ? "consulting-app"
        : "customer-app",
    entryPoint: `./apps/${app}/index.ts`,
    extra: {
      appRole: app,
    },
  };
};
