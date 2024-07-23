import { replica, HttpAgent } from 'ic0';
import fetch from 'isomorphic-fetch';
import { Secp256k1KeyIdentity } from "@dfinity/identity-secp256k1";
import dotenv from 'dotenv';

dotenv.config();

function createHostAgentAndIdentityFromSeed(
    seedPhrase,
    host = "https://ic0.app", // this points to mainnet
) {
    // Note: You'll need to implement getIdentityFromSeed function
    const identity = getIdentityFromSeed(seedPhrase);
    
    console.log("Identity: ", identity.getPrincipal().toText());

    return new HttpAgent({
        host,
        identity,
        fetch,
        verifyQuerySignatures: false,
    });
}

(async () => {
    const ckBTC_canister_id = "mxzaz-hqaaa-aaaar-qaada-cai"; // ckBTC canister ID on mainnet
    const custodian_seed = process.env.CUSTODIAN_SEED;
    const agent = createHostAgentAndIdentityFromSeed(custodian_seed);
    const ic = replica(agent, { local: false });
    const ckBTC = ic(ckBTC_canister_id);

    // 1. icrc1_balance_of
    const balanceOfArgs = {
        owner: 'rrkah-fqaaa-aaaaa-aaaaq-cai', // Replace with actual principal
        subaccount: [] // Optional: Add subaccount if needed
    };

    console.log("Calling icrc1_balance_of:");
    const balance = await ckBTC.call('icrc1_balance_of', balanceOfArgs);
    console.log("Balance:", balance);

    // 2. icrc1_transfer
    const transferArgs = {
        to: {
            owner: 'ryjl3-tyaaa-aaaaa-aaaba-cai', // Replace with actual recipient principal
            subaccount: [] // Optional: Add subaccount if needed
        },
        fee: [10000], // Optional: Fee in e8s (0.0001 ckBTC)
        memo: [], // Optional: Add memo if needed
        from_subaccount: [], // Optional: Add from_subaccount if needed
        created_at_time: [], // Optional: Add timestamp if needed
        amount: 100000000 // Amount in e8s (1 ckBTC)
    };

    console.log("Calling icrc1_transfer:");
    const transferResult = await ckBTC.call('icrc1_transfer', transferArgs);
    console.log("Transfer result:", transferResult);
})();