## To install:
1. Open vscode and type `git clone https://github.com/tristanphan/unrot-extension.git` into the terminal.
2. In vscode: File -> Open Folder -> select the unrot-extension folder.
<br><br>Note: If you don't need the pdf->cards feature, you can skip steps 3-5. <br><br>
3. Create a Google Cloud Project: https://developers.google.com/workspace/guides/create-project#project
4. Create an API key and select the name of your Google Cloud Project: https://ai.google.dev/gemini-api/docs/api-key
5. In vscode: under popup/src, create a file called .env and type `GEMINI_API_KEY=[your api key]` without the brackets <br><br>
6. In vscode: in the terminal, run npm install, then npm run build
7. In chrome: go to chrome://extensions/, toggle Developer mode on, and click Load unpacked. Select the unrot-extension/build folder.
8. Now you should be able to use unrot. Happy undoomscrolling :D
