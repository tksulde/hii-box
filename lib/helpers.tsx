/* eslint-disable @typescript-eslint/no-explicit-any */

// "use client";
// import { ethers } from "ethers";

// export async function getContractEssentials() {
//   const provider = new ethers.BrowserProvider(window?.ethereum as any);
//   const signer = provider.getSigner();

//   return { provider, signer };
// }

// export function parse18(amount: number) {
//   return ethers.parseUnits(amount.toString(), 18);
// }

"use client";
import { ethers } from "ethers";

export async function getContractEssentials() {
  let signer = null;

  let provider;
  provider = ethers.getDefaultProvider();
  if (window.ethereum == null) {
    provider = ethers.getDefaultProvider();
  } else {
    provider = new ethers.BrowserProvider(window?.ethereum as any);

    signer = await provider.getSigner();
  }
  return { provider, signer };
}

export function parse18(amount: number) {
  return ethers.parseUnits(amount.toString(), 18);
}
