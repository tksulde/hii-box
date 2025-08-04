/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ethers } from "ethers";
import { getContractEssentials } from "./helpers";
import genAddresses from "./genAddress.json";
import hiiboxABI from "../abi/HIIBOX.json";

// Type the ABI if needed (optional)
const tournamentFactory: string = genAddresses.hiibox;

export async function getHIIBOXContract(): Promise<{
  hiiboxReadContract: ethers.Contract;
  hiiboxWriteContract: any;
}> {
  const { provider, signer } = await getContractEssentials();

  const hiiboxAbi2 = hiiboxABI as any;

  const hiiboxReadContract = new ethers.Contract(
    tournamentFactory,
    hiiboxAbi2,
    provider
  );

  const hiiboxWriteContract = hiiboxReadContract.connect(await signer);

  return { hiiboxReadContract, hiiboxWriteContract };
}
