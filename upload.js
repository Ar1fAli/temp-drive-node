const { TelegramClient, sessions } = require("telegram");
const input = require("input");
const fs = require("fs");

// --- CONFIGURATION ---
const SESSION_FILE_PATH = "./string.session";

// A NEW, RELIABLE URL FOR A LARGE FILE
const fileUrlToUpload = "https://www.thinkbroadband.com/download/100MB.zip"; // 100 MB test file

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

    const client = new TelegramClient(new sessions.StringSession(sessionString), apiId, apiHash, {
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

        if (!sessionString) {
            const newSessionString = client.session.save();
            fs.writeFileSync(SESSION_FILE_PATH, newSessionString);
            console.log(`Session saved to '${SESSION_FILE_PATH}'. Future runs will be automatic.`);
        }

        console.log(`\nUploading file from URL: ${fileUrlToUpload}`);
        console.log("This may take some time depending on the file size...");

        const uploadedFile = await client.sendFile("me", {
            file: fileUrlToUpload,
            caption: `File uploaded via Node.js at ${new Date().toLocaleString()}`,
            workers: 1,
            forceDocument: true, // This flag is confirmed to be here.
        });

        console.log("\nFile uploaded successfully to your Saved Messages!");
        console.log("File ID:", uploadedFile.id.toString());

    } catch (err) {
        console.error("\nAn error occurred during the process:");
        console.error(err.message);
    } finally {
        console.log("\nDisconnecting client...");
        await client.disconnect();
    }
}

// Check if credentials are provided before running
if (!apiId || !apiHash) {
    console.error("ERROR: API_ID and API_HASH environment variables must be set before running.");
    process.exit(1);
}

// Run the main application function
main();

