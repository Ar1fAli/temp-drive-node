const { TelegramClient } = require("gramjs");
const { StringSession } = require("gramjs/sessions");
const input = require("input");
const fs = require("fs");

// --- CONFIGURATION ---
// The path where the session string will be saved. Keep this file secure.
const SESSION_FILE_PATH = "./string.session";

// The URL of the file you want to upload. You can change this.
const fileUrlToUpload = "https://archive.org/download/26-Design-Review-Pres-Vol-1-1972/26-Design-Review-Pres-Vol-1-1972.pdf"; // The 45.4 MB file that previously failed with the Bot API.

// Read your secret credentials from environment variables.
const apiId = Number(process.env.API_ID);
const apiHash = process.env.API_HASH;

// Main function to run the application
async function main() {
    // Read the session string from the file if it exists
    let sessionString = "";
    if (fs.existsSync(SESSION_FILE_PATH)) {
        sessionString = fs.readFileSync(SESSION_FILE_PATH, "utf8");
    }

    const client = new TelegramClient(new StringSession(sessionString), apiId, apiHash, {
        connectionRetries: 5,
    });

    try {
        console.log("Connecting to Telegram...");
        await client.start({
            phoneNumber: async () => await input.text("Please enter your phone number: "),
            password: async () => await input.text("Please enter your password (if any): "),
            phoneCode: async () => await input.text("Please enter the code you received: "),
            onError: (err) => console.log(err.message),
        });

        console.log("Successfully connected to Telegram.");

        // Save the new session string to the file for all future runs
        const newSessionString = client.session.save();
        fs.writeFileSync(SESSION_FILE_PATH, newSessionString);
        console.log(`Session saved to '${SESSION_FILE_PATH}'. Future runs will be automatic.`);

        console.log(`\nUploading file from URL: ${fileUrlToUpload}`);
        console.log("This may take some time depending on the file size...");

        // 'me' is a shortcut to send the file to your own "Saved Messages"
        const uploadedFile = await client.sendFile("me", {
            file: fileUrlToUpload,
            caption: `File uploaded via Node.js at ${new Date().toLocaleString()}`,
            workers: 1, // Use a single worker for URL downloads to be safe
        });

        console.log("\nFile uploaded successfully to your Saved Messages!");
        console.log("File ID:", uploadedFile.id.toString());

    } catch (err) {
        console.error("\nAn error occurred during the process:");
        console.error(err.message);
    } finally {
        // Ensure the client is always disconnected gracefully
        console.log("\nDisconnecting client...");
        await client.disconnect();
    }
}

// Check if credentials are provided before running
if (!apiId || !apiHash) {
    console.error("ERROR: API_ID and API_HASH environment variables must be set before running.");
    console.error("Example: export API_ID=1234567 && export API_HASH='your_hash'");
    process.exit(1);
}

// Run the main application function
main();
