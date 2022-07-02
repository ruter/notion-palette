chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === "install") {
        chrome.storage.sync.get(["commands"], (result) => {
            if (result.commands === undefined) {
                chrome.storage.sync.set({ commands: [] });
            }
        });
        chrome.storage.sync.get(["commandEnv"], (result) => {
            if (result.commandEnv === undefined) {
                chrome.storage.sync.set({ commandEnv: {} });
            }
        });
        chrome.tabs.create({ url: "" });
    } else if (details.reason === "update") {
        chrome.storage.sync.get(["commands"], (result) => {
            if (result.commands === undefined) {
                chrome.storage.sync.set({ commands: [] });
            }
        });
        chrome.storage.sync.get(["commandEnv"], (result) => {
            if (result.commandEnv === undefined) {
                chrome.storage.sync.set({ commandEnv: {} });
            }
        });
    }
});

chrome.commands.onCommand.addListener(async (command) => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab.url.startsWith("https://www.notion.so")) {
        if (command === 'show_command_palette') {
            chrome.scripting.executeScript({
                target: {tabId: tab.id},
                files: ["palette.js"]
            }, (results) => {
                chrome.tabs.sendMessage(tab.id, {command: command});
            });
        }
    }
});
