# Node.js Telegram Uploader (GramJS)

A robust script to upload large files (up to 2GB/4GB) to your Telegram account's "Saved Messages" from a URL. It uses the powerful Telegram Core API (MTProto) via the GramJS library.

### Features
- Bypasses the 50 MB file limit of the standard Bot API.
- Downloads file from URL and re-uploads, bypassing API unreliability.
- Securely handles credentials using environment variables.
- Saves your login session to a file for automatic, non-interactive runs after the first login.
- Fakes a browser User-Agent to bypass anti-bot measures on download sites.

### Prerequisites
1.  **Node.js** (LTS version recommended).
2.  A **Telegram Account**.
3.  Your **API ID** and **API Hash** from [my.telegram.org](https://my.telegram.org).

### How to Run

1.  **Create Project Files & Install:**
    Create the files from the JSON, then run `npm install`.

2.  **Set Environment Variables:**
    ```bash
    export API_ID=1234567
    export API_HASH='YOUR_API_HASH_HERE'
    ```

3.  **First Run (Interactive Login):**
    Run `npm start`. Follow the prompts for your phone number, password, and code.

4.  **Subsequent Runs:**
    After the first successful run, a `string.session` file will be created. From now on, `npm start` will log in and upload automatically.
