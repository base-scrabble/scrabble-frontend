# **Decentralized Counter DApp: A Full-Stack Blockchain Application**

This project presents a robust and interactive Decentralized Application (DApp) that demonstrates core blockchain interaction. It features a foundational Solidity smart contract for a simple counter, coupled with a responsive React frontend for seamless user interaction. This setup provides a clear illustration of how a frontend can connect with and manage state on a blockchain, perfect for showcasing full-stack DApp development capabilities.

## **Installation**

Getting this DApp up and running locally is straightforward. Follow these steps:

### Prerequisites
Before you begin, ensure you have the following installed:
*   ✅ **Node.js & npm**: For managing frontend dependencies.
*   🛠️ **Foundry**: For compiling, testing, and deploying the Solidity smart contracts. Follow the official installation guide [here](https://book.getfoundry.sh/getting-started/installation).

### 🚀 Clone the Repository
Start by cloning the project to your local machine:
```bash
git clone <repository-url>
cd base_scrabble
```

### 📦 Install Contract Dependencies
Navigate into the `contract` directory and install the necessary Solidity dependencies using Foundry's `forge`:
```bash
cd contract
forge install
forge build
```

### 💻 Install Frontend Dependencies
Now, move into the `frontend` directory and install the React application's dependencies:
```bash
cd ../frontend
npm install
```

## **Usage**

Once the project dependencies are installed, you can interact with the DApp.

### 🌐 Deploy the Smart Contract
To deploy the `Counter` smart contract to a local blockchain (like Anvil, included with Foundry) or a testnet, use the Foundry script:
1.  **Start a local blockchain (if not already running)**:
    ```bash
    anvil
    ```
2.  **Deploy the contract**:
    Open a new terminal and run the deployment script. Replace `<YOUR_RPC_URL>` with your blockchain's RPC URL (e.g., `http://127.0.0.1:8545` for Anvil) and `<YOUR_PRIVATE_KEY>` with a private key of an account with funds (e.g., one of Anvil's default accounts).
    ```bash
    forge script script/Counter.s.sol --rpc-url <YOUR_RPC_URL> --broadcast --private-key <YOUR_PRIVATE_KEY>
    ```
    *Note: The deployment output will provide the deployed contract address. You'll need this address to connect your frontend.*

### ▶️ Run the Frontend Application
With the contract deployed, start the React development server:
```bash
cd frontend
npm run dev
```
This will typically open the application in your browser at `http://localhost:5173` (or similar).

### 🤝 Interacting with the DApp
On the frontend, you'll find an interface to:
*   **View the current counter value** from the deployed smart contract.
*   **Increment the counter**: Send a transaction to increase the counter's value on the blockchain.
*   **Set a new number**: Update the counter to a specific value via a blockchain transaction.

## **Features**

*   🔢 **Simple Counter Logic**: A Solidity smart contract that manages a single `uint256` counter variable, allowing for incrementing and setting its value.
*   🔗 **Blockchain Interaction**: Seamless integration between the React frontend and the deployed Solidity contract for reading and updating blockchain state.
*   ⚛️ **Responsive Frontend**: Built with React and Vite for a fast and modern development experience, providing an intuitive user interface.
*   🛠️ **Robust Smart Contract Development**: Utilizes Foundry for a comprehensive development toolkit, including advanced testing and scripting capabilities.
*   ⚡ **Efficient Tooling**: Leverages Vite for lightning-fast development server and build times.

## **Technologies Used**

| Category       | Technology    | Link                                        |
| :------------- | :------------ | :------------------------------------------ |
| **Blockchain** | Solidity      | [soliditylang.org](https://soliditylang.org/) |
|                | Foundry       | [book.getfoundry.sh](https://book.getfoundry.sh/) |
|                | OpenZeppelin  | [openzeppelin.com/contracts](https://docs.openzeppelin.com/contracts/5.x/) |
| **Frontend**   | React         | [react.dev](https://react.dev/)             |
|                | TypeScript    | [typescriptlang.org](https://www.typescriptlang.org/) |
|                | Vite          | [vitejs.dev](https://vitejs.dev/)           |
| **Tooling**    | ESLint        | [eslint.org](https://eslint.org/)           |
|                | npm           | [npmjs.com](https://www.npmjs.com/)         |

## **Contributing**

Contributions are always welcome! If you're looking to enhance this project, please consider the following guidelines:

*   ✨ **Fork the repository**: Start by forking the project to your GitHub account.
*   🌿 **Create a new branch**: Use a descriptive branch name (e.g., `feature/add-dark-mode`, `fix/deployment-bug`).
*   💡 **Implement your changes**: Write clear, concise code following best practices.
*   🧪 **Write tests**: Ensure your changes are well-tested, especially for smart contract logic.
*   📝 **Update documentation**: If your changes affect how the project is used or set up, please update the README or other relevant documentation.
*   ⬆️ **Create a Pull Request**: Submit your changes for review, providing a detailed description of your work.

## **License**

This project is currently unlicensed, as indicated by the `UNLICENSED` SPDX identifier in the Solidity source code. For open-source contributions, it's recommended to choose and apply a suitable license.

## **Author Info**

Connect with me and see more of my work!

[![GitHub](https://img.shields.io/badge/GitHub--___?style=for-the-badge&logo=github&logoColor=white)](https://github.com/YOUR_GITHUB_USERNAME)
[![LinkedIn](https://img.shields.io/badge/LinkedIn--___?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/YOUR_LINKEDIN_USERNAME)
[![Twitter](https://img.shields.io/badge/Twitter--___?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/YOUR_TWITTER_USERNAME)

## **Badges**

[![Solidity](https://img.shields.io/badge/Solidity-E6E6E6?style=for-the-badge&logo=solidity&logoColor=black)](https://soliditylang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Foundry](https://img.shields.io/badge/Foundry-black?style=for-the-badge&logo=ethereum&logoColor=white)](https://book.getfoundry.sh/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

[![Readme was generated by Dokugen](https://img.shields.io/badge/Readme%20was%20generated%20by-Dokugen-brightgreen)](https://www.npmjs.com/package/dokugen)