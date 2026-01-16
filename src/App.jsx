import AppRoutes from "./AppRoutes";
import { WalletProvider } from "./context/WalletContext";
import { ThemeProvider } from "./context/ThemeContext";
import { PrivyProvider } from "@privy-io/react-auth";
import { PRIVY_APP_ID } from "./config";

export default function App() {
	const app = (
		<WalletProvider>
			<ThemeProvider>
				<AppRoutes />
			</ThemeProvider>
		</WalletProvider>
	);

	if (!PRIVY_APP_ID) return app;

	return (
		<PrivyProvider
			appId={PRIVY_APP_ID}
			config={{
				loginMethods: ["email", "google", "twitter", "discord"],
				appearance: {
					theme: "dark",
					accentColor: "#2563eb",
				},
				// Identity-only beta: do not prompt for embedded wallets.
				embeddedWallets: {
					createOnLogin: "off",
				},
			}}
		>
			{app}
		</PrivyProvider>
	);
}