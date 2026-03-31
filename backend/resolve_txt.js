/**
 * resolve_txt.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Resolves the TXT record for an Atlas cluster hostname.
 * Atlas stores connection options (replicaSet, authSource, …) in a TXT record
 * on the bare cluster hostname – this script prints those options so you can
 * include them in a manually-constructed standard mongodb:// URI.
 *
 * Usage:
 *   node resolve_txt.js
 * ─────────────────────────────────────────────────────────────────────────────
 */

const dns = require("dns").promises;
const dotenv = require("dotenv");

dotenv.config();

function parseAtlasHost(uri) {
    const withoutScheme = uri.replace(/^mongodb(\+srv)?:\/\//, "");
    const withoutCreds = withoutScheme.replace(/^[^@]+@/, "");
    // For SRV URIs the host has no port; for standard URIs take the first host
    return withoutCreds.split("/")[0].split(",")[0].split(":")[0];
}

async function main() {
    const rawUri = process.env.MONGO_URI;

    if (!rawUri) {
        console.error("❌  MONGO_URI is not set in your .env file.");
        process.exit(1);
    }

    const host = parseAtlasHost(rawUri);
    console.log(`\n🔍  Resolving TXT record for: ${host}\n`);

    let txtRecords;
    try {
        txtRecords = await dns.resolveTxt(host);
    } catch (err) {
        console.error(`❌  Failed to resolve TXT record: ${err.message}`);
        process.exit(1);
    }

    if (!txtRecords.length) {
        console.log("ℹ️   No TXT records found for", host);
        return;
    }

    const flat = txtRecords.map((r) => r.join("")).join("&");
    console.log("✅  TXT record options:");
    console.log(`    ${flat}\n`);

    // Parse and display individual options
    const params = new URLSearchParams(flat);
    params.forEach((value, key) => {
        console.log(`     ${key.padEnd(20)} = ${value}`);
    });

    console.log(
        "\n📌  Include these options in the query string of your standard " +
        "mongodb:// URI,\n    and also add: tls=true\n"
    );
}

main();
