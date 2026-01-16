import AppRoutes from "./AppRoutes";
import { WalletProvider } from "./context/WalletContext";
import { ThemeProvider } from "./context/ThemeContext";
import { PrivyProvider } from "@privy-io/react-auth";
import { ENABLE_WALLET, PRIVY_APP_ID } from "./config";

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
				loginMethods: ENABLE_WALLET
					? ["email", "google", "twitter", "discord"]
					: ["email", "google"],
				appearance: {
					theme: "dark",
					accentColor: "#2563eb",
				},
				legal: {
					termsAndConditionsUrl: `${window.location.origin}/terms`,
					privacyPolicyUrl: `${window.location.origin}/privacy`,
				},
				// Identity-only beta: do not prompt for embedded wallets.
				embeddedWallets: {
					ethereum: {
						createOnLogin: "off",
					},
					solana: {
						createOnLogin: "off",
					},
					// Force-hide wallet UIs unless we explicitly turn wallet mode on.
					showWalletUIs: ENABLE_WALLET,
				},
			}}
		>
			{app}
		</PrivyProvider>
	);
}