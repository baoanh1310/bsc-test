import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
const dotenvConfigPath: string = process.env.DOTENV_CONFIG_PATH || "./.env";
dotenvConfig({ path: resolve(__dirname, dotenvConfigPath) });

// const { ethers } = require("hardhat");
import { ethers } from "ethers";

const erc20Abi = require("./../abi/MockERC20.json");

const main = async () => {
    let rpc = "https://data-seed-prebsc-1-s1.binance.org:8545";
    let chainId = 97;

    const erc20Address = "0x16DEF81C0175a55dDf64298C769c8BE712b94DAf";
    console.log("ERC20 testnet address: ", erc20Address);

    const provider = new ethers.providers.JsonRpcProvider(rpc, chainId);
    const signer = new ethers.Wallet(<string>process.env.ADMIN_PRIVATE_KEY, provider);

    const Coin = new ethers.Contract(erc20Address, erc20Abi.abi, signer);

    // change this address
    const recipientAddress = "0x3d21C970a1C0b6223F78cc7850A746a6927A4bA8";

    const amount = ethers.utils.parseEther("1");
    let balance = await Coin.balanceOf(recipientAddress);
    let signerBalance = await Coin.balanceOf(signer.address);
    console.log(`ERC20 balance of ${recipientAddress} before: ${balance}`);
    console.log(`ERC20 balance of ${signer.address} before: ${signerBalance}`);

    console.log('Minting...');
    let tx = await Coin.connect(signer).mint("0x68268FCE7F152c9D7ac556B177dA14089c82439B", amount, {gasPrice: ethers.utils.parseUnits('100', 'gwei')});
    await tx.wait();

    // transfer 1e18 ERC20 token from signer to recipient
    console.log(`Transfering ${amount} from ${signer.address} to ${recipientAddress}`);

    tx = await Coin.connect(signer).transfer(recipientAddress, amount, {gasPrice: ethers.utils.parseUnits('100', 'gwei')});
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