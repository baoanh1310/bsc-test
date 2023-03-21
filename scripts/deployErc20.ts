const { ethers, upgrades } = require("hardhat");

async function main() {
  const E20 = await ethers.getContractFactory("MockERC20");
  const e20 = await E20.deploy();
  await e20.deployed();
  console.log("Contract deployed to:", e20.address);
}
main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});

/*
npx hardhat run scripts/deployErc20.ts --network bscTestnet
*/