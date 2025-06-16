const express = require("express");
const {
    TonClient,
    WalletContractV4,
    toNano,
    internal,
    fromNano,
} = require("@ton/ton");
const { mnemonicToWalletKey } = require("@ton/crypto");
const { DEX, pTON } = require("@ston-fi/sdk");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());


const client = new TonClient({
    endpoint: "https://toncenter.com/api/v2/jsonRPC",
    apiKey: "de9e37712497d8b9db86c1f868524bb28d19eaf8d1b3fe6056216e57434172b3",
});


const mnemonic =
    "lab accident arrow dawn cream naive mean tiny call ahead hurt warm vehicle snake milk audit silly gate net green mean novel senior digital".split(
        " "
    );

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Utility: Check balance
async function checkBalance() {
    try {
        console.log("Checking balance...");
        const key = await mnemonicToWalletKey(mnemonic);
        const wallet = WalletContractV4.create({
            publicKey: key.publicKey,
            workchain: 0,
        });
        const contract = client.open(wallet);

        const balance = await contract.getBalance();
        const walletAddress = wallet.address.toString();

        console.log("Balance checked successfully:", {
            balance: fromNano(balance),
            address: walletAddress,
        });

        return {
            balance: fromNano(balance),
            address: walletAddress,
        };
    } catch (error) {
        console.error("Error in checkBalance:", error);
        throw error;
    }
}

// Get expected amount out for swap
async function getExpectedAmount(amountIn) {
    try {
        const router = client.open(new DEX.v1.Router());
        const usdtJettonAddress =
            "EQA2kCVNwVsil2EM2mB0SkXytxCqQjS4mttjDpnXmwG9T6bO";

        const expectedAmountOut = await router.getExpectedOutputs({
            offerJettonAddress: pTON.v1.address,
            askJettonAddress: usdtJettonAddress,
            offerAmount: toNano(amountIn),
        });

        return expectedAmountOut;
    } catch (error) {
        console.error("Error getting expected amount:", error);
        throw error;
    }
}

// Swap TON to USDT with proper error handling
async function swapTonToUsdt(amount = "0.01") {
    try {
        console.log(`\n🔄 Starting swap: ${amount} TON to USDT...`);

        const key = await mnemonicToWalletKey(mnemonic);
        const wallet = WalletContractV4.create({
            publicKey: key.publicKey,
            workchain: 0,
        });
        const contract = client.open(wallet);

        // Check balance first
        const balance = await contract.getBalance();
        const balanceInTon = parseFloat(fromNano(balance));
        console.log("💰 Current balance:", balanceInTon, "TON");

        // Validate balance
        const swapAmount = parseFloat(amount);
        const requiredAmount = swapAmount + 0.1; // Add 0.1 TON for fees

        if (balanceInTon < requiredAmount) {
            throw new Error(
                `Insufficient balance. Required: ${requiredAmount} TON, Available: ${balanceInTon} TON`
            );
        }

        // Validate minimum swap amount
        if (swapAmount < 0.001) {
            throw new Error("Minimum swap amount is 0.001 TON");
        }

        console.log("📍 Wallet address:", wallet.address.toString());
        await sleep(2000);

        // Get expected output
        console.log("🔍 Getting expected output amount...");
        let expectedOutput;
        try {
            expectedOutput = await getExpectedAmount(amount);
            console.log("📊 Expected USDT output:", fromNano(expectedOutput));
        } catch (error) {
            console.log(
                "⚠️ Could not get expected output, using fallback calculation"
            );
            // Fallback: estimate based on typical rate (adjust as needed)
            expectedOutput = toNano((swapAmount * 2.5).toString()); // Rough estimate
        }

        const router = client.open(new DEX.v1.Router());
        const usdtJettonAddress =
            "EQA2kCVNwVsil2EM2mB0SkXytxCqQjS4mttjDpnXmwG9T6bO";

        // Calculate minimum amount with 5% slippage
        const slippagePercent = 5;
        const minAskAmount =
            (expectedOutput * BigInt(100 - slippagePercent)) / BigInt(100);

        console.log("📋 Swap parameters:");
        console.log("- Offer amount:", amount, "TON");
        console.log("- Expected output:", fromNano(expectedOutput), "USDT");
        console.log(
            "- Min output (5% slippage):",
            fromNano(minAskAmount),
            "USDT"
        );

        // Get swap transaction parameters
        const txParams = await router.getSwapTonToJettonTxParams({
            userWalletAddress: wallet.address.toString(),
            askJettonAddress: usdtJettonAddress,
            proxyTon: new pTON.v1(),
            offerAmount: toNano(amount),
            minAskAmount: minAskAmount,
            queryId: Date.now(),
        });

        // Calculate total value with fees
        const gasFee = toNano("0.05"); // 0.05 TON for gas
        const totalValue = txParams.value + gasFee;

        console.log("💸 Transaction details:");
        console.log("- Base value:", fromNano(txParams.value), "TON");
        console.log("- Gas fee:", fromNano(gasFee), "TON");
        console.log("- Total value:", fromNano(totalValue), "TON");

        // Send transaction
        console.log("📤 Sending transaction...");
        const seqno = await contract.getSeqno();
        console.log("🔢 Current seqno:", seqno);

        await contract.sendTransfer({
            secretKey: key.secretKey,
            seqno: seqno,
            messages: [
                internal({
                    to: txParams.to,
                    value: totalValue,
                    body: txParams.body,
                    bounce: false, // Important: set to false for jetton swaps
                }),
            ],
        });

        console.log("✅ Transaction sent! Waiting for confirmation...");
        console.log(
            "🔍 Explorer:",
            `https://tonscan.org/address/${wallet.address.toString()}`
        );

        // Wait for transaction confirmation with better timeout handling
        let currentSeqno = seqno;
        let attempts = 0;
        const maxAttempts = 60; // Increase timeout to 3 minutes

        while (currentSeqno === seqno && attempts < maxAttempts) {
            console.log(
                `⏳ Waiting for confirmation... (${
                    attempts + 1
                }/${maxAttempts})`
            );
            await sleep(3000);

            try {
                currentSeqno = await contract.getSeqno();
                if (currentSeqno > seqno) {
                    break;
                }
            } catch (e) {
                console.log("⚠️ Error checking seqno, retrying...");
                await sleep(2000);
            }
            attempts++;
        }

        if (attempts >= maxAttempts) {
            throw new Error(
                "Transaction confirmation timeout. Check explorer for status."
            );
        }

        console.log("🎉 Transaction confirmed! New seqno:", currentSeqno);

        // Wait a bit more before checking balance
        await sleep(5000);

        // Get new balance
        console.log("\n📊 Checking new balance...");
        const newBalance = await checkBalance();

        return {
            success: true,
            swapAmount: amount,
            expectedOutput: fromNano(expectedOutput),
            minOutput: fromNano(minAskAmount),
            newBalance: newBalance.balance,
            transactionExplorer: `https://tonscan.org/address/${wallet.address.toString()}`,
            seqno: currentSeqno,
        };
    } catch (error) {
        console.error("❌ Error in swapTonToUsdt:", error);

        // Handle specific errors
        if (error.message.includes("429")) {
            throw new Error(
                "API rate limit exceeded. Please wait 1-2 minutes and try again."
            );
        }
        if (error.message.includes("insufficient")) {
            throw new Error("Insufficient balance for swap + fees.");
        }
        if (error.message.includes("timeout")) {
            throw new Error(
                "Transaction timeout. Check the explorer to verify if the transaction was processed."
            );
        }

        throw error;
    }
}

// Test connection and balance
async function testConnection() {
    try {
        console.log("🔌 Testing connection...");
        const balance = await checkBalance();
        console.log("✅ Connection successful!");
        return balance;
    } catch (error) {
        console.error("❌ Connection failed:", error);
        throw error;
    }
}

// API Endpoints
app.get("/balance", async (req, res) => {
    try {
        console.log("📊 Balance request received");
        const balance = await checkBalance();
        res.json(balance);
    } catch (error) {
        console.error("❌ Error in /balance endpoint:", error);
        res.status(500).json({
            error: error.message,
            details: "Check server logs for more information",
        });
    }
});

app.post("/swap", async (req, res) => {
    try {
        console.log("🔄 Swap request received:", req.body);
        const { amount = "0.01" } = req.body;

        // Validate amount
        const swapAmount = parseFloat(amount);
        if (isNaN(swapAmount) || swapAmount <= 0) {
            return res.status(400).json({ error: "Invalid amount" });
        }

        const result = await swapTonToUsdt(amount);
        res.json(result);
    } catch (error) {
        console.error("❌ Error in /swap endpoint:", error);
        res.status(500).json({
            error: error.message,
            details: "Check server logs for more information",
        });
    }
});

app.get("/test", async (req, res) => {
    try {
        const result = await testConnection();
        res.json({ status: "ok", ...result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    console.log(`🚀 Server running on port ${PORT}`);

    // Test connection on startup
    try {
        await testConnection();
    } catch (error) {
        console.error("⚠️ Initial connection test failed");
    }
});
