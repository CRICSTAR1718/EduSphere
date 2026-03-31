const dns = require("dns").promises;
const dotenv = require("dotenv");

dotenv.config();

async function main() {
    const rawUri = process.env.MONGO_URI;

    if (!rawUri) {
        console.error("❌  MONGO_URI is not set in your .env file.");
        process.exit(1);
    }

    if (!rawUri.startsWith("mongodb+srv://")) {
        console.log("ℹ️   Your MONGO_URI is already a standard connection string.");
        return;
    }

    const srvHost = rawUri.replace(/^mongodb\+srv:\/\/[^@]+@/, "").split("/")[0].split("?")[0];
    const srvName = `_mongodb._tcp.${srvHost}`;

    try {
        const srvRecords = await dns.resolveSrv(srvName);
        const hosts = srvRecords.map((r) => `${r.name}:${r.port}`).join(",");

        let replicaSet = "atlas-zvktmp-shard-0";
        try {
            const txtRecords = await dns.resolveTxt(srvHost);
            const flat = txtRecords.flat().join("&");
            const m = flat.match(/replicaSet=([^&]+)/);
            if (m) replicaSet = m[1];
        } catch (e) {}

        const credMatch = rawUri.match(/^mongodb\+srv:\/\/([^@]+)@/);
        const credentials = credMatch ? credMatch[1] : "satdev:kVnEbJ2dz9p9w33";
        
        const dbPart = rawUri.split("/")[3]?.split("?")[0] || "";
        
        const standardUri = `mongodb://${credentials}@${hosts}/${dbPart}?replicaSet=${replicaSet}&tls=true&authSource=admin&retryWrites=true&w=majority`;

        const output = [
            "\n" + "─".repeat(60),
            "✅  STANDARD CONNECTION STRING GENERATED",
            "",
            `    MONGO_URI=${standardUri}`,
            "",
            "📌  Copy the line above into your .env file.",
            "─".repeat(60) + "\n"
        ].join("\n");

        process.stdout.write(output);
        process.exit(0);

    } catch (err) {
        console.error(`❌  Error: ${err.message}`);
        process.exit(1);
    }
}

main();
