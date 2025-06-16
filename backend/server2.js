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

// TON Client setup
const client = new TonClient({
    endpoint: "https://toncenter.com/api/v2/jsonRPC",
    apiKey: "de9e37712497d8b9db86c1f868524bb28d19eaf8d1b3fe6056216e57434172b3",
});

// Wallet setup
const mnemonic =
    "lab accident arrow dawn cream naive mean tiny call ahead hurt warm vehicle snake milk audit silly gate net green mean novel senior digital".split(
        " "
    );

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Utility: Check balance
async function checkBalance() {
    try {
        console.log("💰 Hamyon balansini tekshirish...");
        const key = await mnemonicToWalletKey(mnemonic);
        const wallet = WalletContractV4.create({
            publicKey: key.publicKey,
            workchain: 0,
        });
        const contract = client.open(wallet);

        const balance = await contract.getBalance();
        const walletAddress = wallet.address.toString();
        const balanceInTon = fromNano(balance);

        console.log(
            "💰 Hamyon balansi:",
            parseFloat(balanceInTon).toFixed(4),
            "TON"
        );
        console.log("📍 Hamyon manzili:", walletAddress);

        return {
            balance: balanceInTon,
            address: walletAddress,
        };
    } catch (error) {
        console.error("❌ Balans tekshirishda xato:", error);
        throw error;
    }
}

// Get expected amount out for USDT to TON swap
async function getExpectedAmount(amountIn) {
    try {
        const router = client.open(new DEX.v1.Router());
        const usdtJettonAddress =
            "EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs"; // To'g'ri USDT manzili

        const expectedAmountOut = await router.getExpectedOutputs({
            offerJettonAddress: usdtJettonAddress,
            askJettonAddress: pTON.v1.address,
            offerAmount: toNano(amountIn),
        });

        return expectedAmountOut;
    } catch (error) {
        console.error("❌ Kutilgan miqdorni olishda xato:", error);
        throw error;
    }
}

// Swap USDT to TON with proper error handling
async function swapUsdtToTon(amount = "0.001") {
    try {
        console.log(
            `\n🔄 ${amount} USDT ni TON ga almashtirish boshlanmoqda...`
        );

        const key = await mnemonicToWalletKey(mnemonic);
        const wallet = WalletContractV4.create({
            publicKey: key.publicKey,
            workchain: 0,
        });
        const contract = client.open(wallet);

        // Check balance first
        const balance = await contract.getBalance();
        const balanceInTon = parseFloat(fromNano(balance));
        console.log("💰 Joriy balans:", balanceInTon.toFixed(4), "TON");

        // Validate minimum required balance for fees
        const requiredForFees = 0.05; // 0.05 TON for fees
        if (balanceInTon < requiredForFees) {
            throw new Error(
                `Yetarli balans yo'q. Komissiya uchun kamida ${requiredForFees} TON kerak, mavjud: ${balanceInTon} TON`
            );
        }

        console.log("📍 Hamyon manzili:", wallet.address.toString());

        // API cheklovlari uchun kutish
        console.log("⏳ API cheklovi uchun kutish...");
        await sleep(3000);

        // Get expected output
        console.log("🔍 Kutilgan natija miqdorini olish...");
        let expectedOutput;
        try {
            expectedOutput = await getExpectedAmount(amount);
            console.log("📊 Kutilgan TON miqdori:", fromNano(expectedOutput));
        } catch (error) {
            console.log(
                "⚠️ Kutilgan natijani olishda xato, taxminiy hisoblash ishlatiladi"
            );
            // Fallback: estimate based on typical rate
            expectedOutput = toNano((parseFloat(amount) * 0.4).toString()); // Rough estimate
        }

        const router = client.open(new DEX.v1.Router());
        const usdtJettonAddress =
            "EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs"; // To'g'ri USDT manzili

        // Calculate minimum amount with 5% slippage
        const slippagePercent = 5;
        const minAskAmount =
            (expectedOutput * BigInt(100 - slippagePercent)) / BigInt(100);

        console.log("📋 Almashtirish parametrlari:");
        console.log("- Taklif miqdori:", amount, "USDT");
        console.log("- Kutilgan natija:", fromNano(expectedOutput), "TON");
        console.log(
            "- Minimal natija (5% slippage):",
            fromNano(minAskAmount),
            "TON"
        );

        // Get swap transaction parameters
        const txParams = await router.getSwapJettonToTonTxParams({
            userWalletAddress: wallet.address.toString({ bounceable: false }), // Non-bounceable format
            offerJettonAddress: usdtJettonAddress,
            proxyTon: new pTON.v1(),
            offerAmount: toNano(amount), // USDT miqdori
            minAskAmount: toNano("0.000000001"), // Minimal TON miqdori
            queryId: Date.now(),
        });

        console.log("💸 Tranzaksiya tafsilotlari:");
        console.log("- Asosiy qiymat:", fromNano(txParams.value), "TON");
        console.log("📋 Tranzaksiya parametrlari:", txParams);

        // Send transaction
        console.log("📤 Tranzaksiya yuborilmoqda...");
        await sleep(2000);
        const seqno = await contract.getSeqno();
        console.log("🔢 Joriy seqno:", seqno);

        await contract.sendTransfer({
            secretKey: key.secretKey,
            seqno: seqno,
            messages: [
                internal({
                    to: txParams.to,
                    value: txParams.value,
                    body: txParams.body,
                    bounce: false, // Important: set to false for jetton swaps
                }),
            ],
        });

        console.log("✅ Tranzaksiya yuborildi! Tasdiqlanishini kutish...");
        console.log(
            "🔍 Explorer:",
            `https://tonviewer.com/${wallet.address.toString()}`
        );

        // Wait for transaction confirmation
        let currentSeqno = seqno;
        let attempts = 0;
        const maxAttempts = 30; // 1.5 minutes timeout

        while (currentSeqno === seqno && attempts < maxAttempts) {
            console.log(
                `⏳ Tranzaksiya tasdiqlanishini kutmoqda... (${
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
                console.log("⚠️ Seqno tekshirishda xato, qayta urinish...");
                await sleep(5000);
            }
            attempts++;
        }

        if (attempts >= maxAttempts) {
            console.log("⚠️ Timeout: Tranzaksiya juda uzoq davom etdi");
            throw new Error(
                "Tranzaksiya tasdiqlanishi timeout. Explorer orqali holatni tekshiring."
            );
        } else {
            console.log(
                "🎉 Tranzaksiya tasdiqlandi! Yangi seqno:",
                currentSeqno
            );
        }

        // Wait a bit more before checking balance
        await sleep(2000);

        // Get new balance
        console.log("\n📊 Yangi balansni tekshirish...");
        const newBalance = await checkBalance();

        return {
            success: true,
            swapAmount: amount,
            expectedOutput: fromNano(expectedOutput),
            minOutput: fromNano(minAskAmount),
            newBalance: newBalance.balance,
            transactionExplorer: `https://tonviewer.com/${wallet.address.toString()}`,
            seqno: currentSeqno,
        };
    } catch (error) {
        console.error("❌ USDT to TON almashtirish xatosi:", error);

        // Handle specific errors
        if (error.message.includes("429")) {
            console.error(
                "❌ API cheklovi: 1-2 daqiqa kutib, qayta urinib ko'ring"
            );
            console.log(
                "💡 Yoki TonCenter'dan API kaliti oling: https://toncenter.com/api/v2/"
            );
            throw new Error(
                "API cheklovi. 1-2 daqiqa kutib, qayta urinib ko'ring."
            );
        }
        if (
            error.message.includes("yetarli") ||
            error.message.includes("insufficient")
        ) {
            throw new Error(
                "Almashtirish + komissiya uchun yetarli balans yo'q."
            );
        }
        if (error.message.includes("timeout")) {
            throw new Error(
                "Tranzaksiya timeout. Explorer orqali tranzaksiya holatini tekshiring."
            );
        }

        throw error;
    }
}

// Test connection and balance
async function testConnection() {
    try {
        console.log("🔌 Ulanishni tekshirish...");
        const balance = await checkBalance();
        console.log("✅ Ulanish muvaffaqiyatli!");
        return balance;
    } catch (error) {
        console.error("❌ Ulanish xato:", error);
        throw error;
    }
}

// API Endpoints
app.get("/balance", async (req, res) => {
    try {
        console.log("📊 Balans so'rovi qabul qilindi");
        const balance = await checkBalance();
        res.json(balance);
    } catch (error) {
        console.error("❌ /balance endpoint xatosi:", error);
        res.status(500).json({
            error: error.message,
            details: "Batafsil ma'lumot uchun server loglarini tekshiring",
        });
    }
});

app.post("/swap-usdt-to-ton", async (req, res) => {
    try {
        console.log(
            "🔄 USDT to TON almashtirish so'rovi qabul qilindi:",
            req.body
        );
        const { amount = "0.001" } = req.body;

        // Validate amount
        const swapAmount = parseFloat(amount);
        if (isNaN(swapAmount) || swapAmount <= 0) {
            return res.status(400).json({ error: "Noto'g'ri miqdor" });
        }

        const result = await swapUsdtToTon(amount);
        res.json(result);
    } catch (error) {
        console.error("❌ /swap-usdt-to-ton endpoint xatosi:", error);
        res.status(500).json({
            error: error.message,
            details: "Batafsil ma'lumot uchun server loglarini tekshiring",
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

// Manual test endpoint (like your original standalone code)
app.post("/manual-test", async (req, res) => {
    try {
        console.log("🚀 Manual test boshlash...");
        const balance = await checkBalance();
        const result = await swapUsdtToTon("0.001");
        res.json({
            initialBalance: balance,
            swapResult: result,
        });
    } catch (error) {
        console.error("❌ Manual test xatosi:", error);
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    console.log(`🚀 Server ${PORT} portda ishlamoqda`);

    // Test connection on startup
    try {
        await testConnection();
    } catch (error) {
        console.error("⚠️ Boshlang'ich ulanish testi muvaffaqiyatsiz");
    }
});
