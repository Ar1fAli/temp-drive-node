# Node.js Telegram Uploader (GramJS)

A robust script to upload large files (up to 2GB/4GB) to your Telegram account's "Saved Messages" from a URL. It uses the powerful Telegram Core API (MTProto) via the GramJS library.

### Features
- Bypasses the 50 MB file limit of the standard Bot API.
- Uploads files directly from a public URL without saving them permanently to disk.
- Securely handles credentials using environment variables.
- Saves your login session to a file for automatic, non-interactive runs after the first login.

### Prerequisites
1.  **Node.js** (LTS version recommended).
2.  A **Telegram Account** (the account you will log in as).
3.  Your **API ID** and **API Hash** from [my.telegram.org](https://my.telegram.org).

### How to Run

1.  **Create Project Files:**
    Create the three files (`package.json`, `.gitignore`, `upload.js`) in a new directory and paste the code for each.

2.  **Install Dependencies:**
    Open your terminal in the project directory and run:
    ```bash
    npm install
    ```

3.  **Set Environment Variables:**
    In your terminal, set your secret credentials. This is for the current session only.
    ```bash
    export API_ID=1234567
    export API_HASH='YOUR_API_HASH_HERE'
    ```
    *(For a permanent setup, add these lines to your `~/.bashrc` or `~/.zshrc` file and restart your shell.)*

4.  **First Run (Interactive Login):**
    Execute the script. It will read your credentials and start the interactive login process.
    ```bash
    node upload.js
    ```
    Follow the prompts for your phone number, password (if any), and the code Telegram sends you.

5.  **Subsequent Runs:**
    After the first successful run, a `string.session` file will be created. From now on, you can simply run `node upload.js`, and it will log in and upload automatically.

### Security
- **Never** share your `API_ID`, `API_HASH`, or the `string.session` file. They grant full access to your Telegram account.
- The `.gitignore` file is included to prevent you from accidentally committing these secrets to a Git repository.
