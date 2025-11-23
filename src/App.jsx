import AppRoutes from "./AppRoutes";
import { WalletProvider } from "./context/WalletContext";
import { ThemeProvider } from "./context/ThemeContext";

export default function App() {
	return (
		<WalletProvider>
			<ThemeProvider>
				<AppRoutes />
			</ThemeProvider>
		</WalletProvider>
	);
}