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
