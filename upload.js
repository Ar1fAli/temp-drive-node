const { TelegramClient, sessions } = require("telegram");
const input = require("input");
const fs = require("fs");
const axios = require("axios");
const path = require("path");

// --- CONFIGURATION ---
const SESSION_FILE_PATH = "./string.session";
const TEMP_DIR = "./temp"; // A directory to store files temporarily

// The URL of the file you want to upload.
const fileUrlToUpload = "https://www.thinkbroadband.com/download/100MB.zip";

// Read your secret credentials from environment variables.
const apiId = Number(process.env.API_ID);
const apiHash = process.env.API_HASH;

// Main function to run the application
async function main() {
    // Create temp directory if it doesn't exist
    if (!fs.existsSync(TEMP_DIR)) {
        fs.mkdirSync(TEMP_DIR);
    }

    let tempFilePath = null; // To store the path of the downloaded file

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

        // --- STEP 1: DOWNLOAD THE FILE TO OUR SERVER ---
        console.log(`\nDownloading file from URL: ${fileUrlToUpload}`);
        const fileName = path.basename(fileUrlToUpload);
        tempFilePath = path.join(TEMP_DIR, fileName);
        const writer = fs.createWriteStream(tempFilePath);

        const response = await axios({
            url: fileUrlToUpload,
            method: 'GET',
            responseType: 'stream'
        });

        response.data.pipe(writer);

        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
        console.log(`File downloaded successfully to: ${tempFilePath}`);


        // --- STEP 2: UPLOAD THE LOCAL FILE TO TELEGRAM ---
        console.log("\nUploading file to Telegram...");
        console.log("This may take some time depending on the file size...");

        const uploadedFile = await client.sendFile("me", {
            file: tempFilePath, // <-- We now use the local file path
            caption: `File uploaded via Node.js at ${new Date().toLocaleString()}`,
            forceDocument: true,
        });

        console.log("\nFile uploaded successfully to your Saved Messages!");
        console.log("File ID:", uploadedFile.id.toString());

    } catch (err) {
        console.error("\nAn error occurred during the process:");
        console.error(err.message);
    } finally {
        console.log("\nDisconnecting client...");
        await client.disconnect();

        // --- STEP 3: CLEAN UP THE TEMPORARY FILE ---
        if (tempFilePath && fs.existsSync(tempFilePath)) {
            fs.unlinkSync(tempFilePath);
            console.log(`Temporary file deleted: ${tempFilePath}`);
        }
    }
}

// Check if credentials are provided before running
if (!apiId || !apiHash) {
    console.error("ERROR: API_ID and API_HASH environment variables must be set before running.");
    process.exit(1);
}

// Run the main application function
main();

