import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
const dotenvConfigPath: string = process.env.DOTENV_CONFIG_PATH || "./.env";
dotenvConfig({ path: resolve(__dirname, dotenvConfigPath) });

const { ethers } = require("hardhat");

const erc20Abi = require("./../abi/MockERC20.json");

const main = async () => {
    let rpc = "https://data-seed-prebsc-1-s1.binance.org:8545/";
    let chainId = 97;

    const erc20Address = "0xA065bf667591c28bfB9b175994905e3BC5A78A52";
    console.log("ERC20 testnet address: ", erc20Address);

    const provider = new ethers.providers.JsonRpcProvider(rpc, chainId);
    const signer = new ethers.Wallet(process.env.ADMIN_PRIVATE_KEY, provider);

    const Coin = new ethers.Contract(erc20Address, erc20Abi.abi, signer);

    // change this address
    const recipientAddress = "0x68268FCE7F152c9D7ac556B177dA14089c82439B";

    const amount = ethers.utils.parseEther("1");
    let balance = await Coin.balanceOf(recipientAddress);
    let signerBalance = await Coin.balanceOf(signer.address);
    console.log(`ERC20 balance of ${recipientAddress} before: ${balance}`);
    console.log(`ERC20 balance of ${signer.address} before: ${signerBalance}`);

    // transfer 1e18 ERC20 token from signer to recipient
    console.log(`Transfering ${amount} from ${signer.address} to ${recipientAddress}`);

    let tx = await Coin.connect(signer).transfer(recipientAddress, amount);
    await tx.wait();

    balance = await Coin.balanceOf(recipientAddress);
    signerBalance = await Coin.balanceOf(signer.address);
    console.log(`ERC20 balance of ${recipientAddress} after: ${balance}`);
    console.log(`ERC20 balance of ${signer.address} after: ${signerBalance}`);

}

main().catch(error => {
    console.error(error);
    process.exitCode = 1;
});

/*
npx hardhat run scripts/sendERC20.ts --network bscTestnet
*/