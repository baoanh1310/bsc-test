import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
const dotenvConfigPath: string = process.env.DOTENV_CONFIG_PATH || "./.env";
dotenvConfig({ path: resolve(__dirname, dotenvConfigPath) });

const { ethers } = require("hardhat");

const main = async () => {
    let rpc = "https://data-seed-prebsc-1-s1.binance.org:8545/";
    let chainId = 97;

    const provider = new ethers.providers.JsonRpcProvider(rpc, chainId);
    const signer = new ethers.Wallet(process.env.ADMIN_PRIVATE_KEY, provider);

    // change this address
    const recipientAddress = "0x68268FCE7F152c9D7ac556B177dA14089c82439B";

    let signerBalance = await provider.getBalance(signer.address);
    let recipientBalance = await provider.getBalance(recipientAddress);
    console.log(`BNB balance of ${signer.address} before: ${ethers.utils.formatUnits(signerBalance.toString(), "ether")} BNB`);
    console.log(`BNB balance of ${recipientAddress} before: ${ethers.utils.formatUnits(recipientBalance.toString(), "ether")} BNB`);

    let tx = {
        to: recipientAddress,
        // Convert currency unit from BNB to wei
        value: ethers.utils.parseEther("0.01")
    }

    await signer.sendTransaction(tx);

    signerBalance = await provider.getBalance(signer.address);
    recipientBalance = await provider.getBalance(recipientAddress);
    console.log(`BNB balance of ${signer.address} before: ${ethers.utils.formatUnits(signerBalance.toString(), "ether")} BNB`);
    console.log(`BNB balance of ${recipientAddress} before: ${ethers.utils.formatUnits(recipientBalance.toString(), "ether")} BNB`);
}

main().catch(error => {
    console.error(error);
    process.exitCode = 1;
});

/*
npx hardhat run scripts/sendBNB.ts --network bscTestnet
*/