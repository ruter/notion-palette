const CREATE_CMD = "CREATE-NEW-COMMAND";
const ENV_CMD = "ENV-CMD";

const DEFAULT_COMMANDS = [CREATE_CMD, ENV_CMD];
const DEFAULT_COMMANDS_DEFINE = [{
    id: CREATE_CMD,
    name: "Create New Command",
    icon: chrome.runtime.getURL("assets/command.png"),
    desc: "Use this command to create your own command.",
}, {
    id: ENV_CMD,
    name: "Command Secrets",
    icon: chrome.runtime.getURL("assets/lock.png"),
    desc: "Store your command secrets or environment variables here, and they will be available to all commands, use getEnv('key') to retrieve.",
}];

let inputTimeout = null;

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        removeCommandPalette();
    }
});

document.addEventListener("click", (e) => {
    removeCommandPalette();
});

function removeCommandPalette() {
    let commandPaletteEl = document.querySelector("#notion-command-palette");
    if (commandPaletteEl) {
        commandPaletteEl.remove();
    }
}

function getSiblingCommandItem(commandItem, direction) {
    let siblingItem = null;
    if (direction === "previous") {
        siblingItem = commandItem.previousElementSibling;
        while (siblingItem && siblingItem.classList.contains("hidden")) {
            siblingItem = siblingItem.previousElementSibling;
        }
    } else {
        siblingItem = commandItem.nextElementSibling;
        while (siblingItem && siblingItem.classList.contains("hidden")) {
            siblingItem = siblingItem.previousElementSibling;
        }
    }
    return siblingItem;
}

function showAllCommands() {
    let commandList = document.createElement("div");
    commandList.id = "notion-command-palette-list";
    commandList.style = "padding-top: 0px; padding-bottom: 8px;";
    commandList.innerHTML = `<div style="display: flex; padding: 2px 14px 0px; margin: 0px; color: rgba(55, 53, 47, 0.65); font-size: 11px; font-weight: 500; line-height: 120%; user-select: none; height: 32px; align-items: center; text-transform: uppercase;">
        <div id="command-palette-title" style="align-self: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">All Commands</div></div>
        <ul style="list-style-type: none; padding: 0px; margin: 0px;"></ul>`;
    document.querySelector("#notion-command-palette main div").appendChild(commandList);

    let commandItemEl = document.createElement("div");
    commandItemEl.className = "notranslate notion-focusable command-palette-item";
    commandItemEl.setAttribute("tabindex", "0");
    commandItemEl.setAttribute("role", "button");
    commandItemEl.dataset.id = CREATE_CMD;
    commandItemEl.style = "user-select: none; transition: none 0s ease 0s; cursor: pointer; width: calc(100% - 8px); margin-left: 4px; margin-right: 4px; border-radius: 3px;";
    commandItemEl.innerHTML = `<div style="display: flex; align-items: center; line-height: 120%; width: 100%; user-select: none; min-height: 36px; font-size: 14px; padding-top: 8px; padding-bottom: 8px;">
        <div style="display: flex; align-items: center; justify-content: center; margin-left: 10px; margin-right: 4px; margin-top: 1px; align-self: center;">
            <div class="command-palette-item-icon notranslate notion-focusable" role="button" aria-disabled="true" tabindex="-1"
                style="user-select: none; transition: background 20ms ease-in 0s; display: flex; align-items: center; justify-content: center; height: 19px; width: 19px; border-radius: 3px; flex-shrink: 0;">
                <div>
                    <div style="width: 100%; height: 100%;">
                        <img src="" style="display: block; object-fit: cover; border-radius: 3px; width: 16.872px; height: 16.872px; transition: opacity 100ms ease-out 0s;">
                    </div>
                </div>
            </div>
        </div>
        <div style="margin-left: 8px; margin-right: 12px; min-width: 0px; display: inline-flex; align-items: baseline; width: 100%;">
            <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex-shrink: 0; max-width: 100%;">
                <div style="display: flex; flex-direction: row; font-weight: 500; line-height: 20px;">
                    <div class="notranslate command-palette-item-title" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: 500; line-height: 20px;">
                        Create New Command
                    </div>
                </div>
            </div>
            <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: rgba(55, 53, 47, 0.65); margin-top: 1px; font-size: 12px; display: inline-flex;">
                <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: rgba(55, 53, 47, 0.65); margin-top: 0px; font-size: 12px; margin-left: 0.5em; margin-right: 0.5em;">—</span>
                <div style="display: flex; font-size: 12px; color: rgba(55, 53, 47, 0.5); overflow: hidden;">
                    <div class="notranslate command-palette-item-desc" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 12px; color: rgba(55, 53, 47, 0.5);">
                        Use this command to create your own command.
                    </div>
                </div>
            </div>
            <div style="margin-top: 4px; font-size: 12px; color: rgba(55, 53, 47, 0.65); overflow-wrap: break-word;"></div>
        </div>
        <div class="command-palette-item-sign" style="margin-left: auto; margin-right: 12px; min-width: 0px; flex: 0 0 auto; align-self: flex-start; margin-top: 3px;">
            <svg viewBox="0 0 14 12" class="enter" style="width: 14px; height: 14px; display: block; fill: rgba(55, 53, 47, 0.45); flex-shrink: 0; backface-visibility: hidden; opacity: 1;">
                <path d="M4.45869 11.0605C4.83955 11.0605 5.09736 10.791 5.09736 10.4219C5.09736 10.2285 5.02119 10.0879 4.904 9.9707L3.41572 8.51758L2.39033 7.65625L3.74384 7.71484H11.0563C12.527 7.71484 13.154 7.05273 13.154 5.59961V2.125C13.154 0.654297 12.527 0.0214844 11.0563 0.0214844H7.80439C7.41181 0.0214844 7.13642 0.314453 7.13642 0.677734C7.13642 1.03516 7.41181 1.32812 7.79853 1.32812H11.027C11.613 1.32812 11.8649 1.58008 11.8649 2.16602V5.55859C11.8649 6.16211 11.613 6.4082 11.027 6.4082H3.74384L2.39033 6.47266L3.41572 5.60547L4.904 4.1582C5.02119 4.04102 5.09736 3.89453 5.09736 3.70117C5.09736 3.33789 4.83955 3.06836 4.45869 3.06836C4.29462 3.06836 4.11298 3.14453 3.98408 3.27344L0.626656 6.57812C0.49189 6.70703 0.421577 6.88281 0.421577 7.06445C0.421577 7.24023 0.49189 7.41602 0.626656 7.54492L3.98408 10.8555C4.11298 10.9844 4.29462 11.0605 4.45869 11.0605Z"></path>
            </svg>
        </div>`;

    let commandItems = [];
    chrome.storage.sync.get(["commands"], function(result) {
        if (result.commands === undefined) {
            console.error("No commands found");
        } else {
            for (let command of result.commands) {
                let commandItem = commandItemEl.cloneNode(true);
                commandItem.dataset.id = command.id;
                commandItem.querySelector(".command-palette-item-icon img").src = command.icon || chrome.runtime.getURL("assets/empty.png");
                commandItem.querySelector(".command-palette-item-title").innerText = command.title;
                commandItem.querySelector(".command-palette-item-desc").innerText = command.description;
                commandItems.push(commandItem);
            }
        }
        DEFAULT_COMMANDS_DEFINE.forEach(command => {
            let commandItem = commandItemEl.cloneNode(true);
            commandItem.dataset.id = command.id;
            commandItem.querySelector(".command-palette-item-icon img").src = command.icon || chrome.runtime.getURL("assets/empty.png");
            commandItem.querySelector(".command-palette-item-title").innerText = command.name;
            commandItem.querySelector(".command-palette-item-desc").innerText = command.desc;
            commandItems.push(commandItem);
        });
        commandItems[0].classList.add("selected");
        commandList.querySelector("ul").append(...commandItems);
    });
}

function searchCommands(commandPalette) {
    let emptyEl = document.querySelector("#command-palette-empty");
    if (emptyEl) {
        emptyEl.remove();
    }
    let searchText = commandPalette.value;
    let commandItems = document.querySelectorAll(".command-palette-item");
    if (searchText.length > 0) {
        let setSelected = false;
        searchText = searchText.toLowerCase();
        commandItems.forEach(item => {
            item.classList.remove("selected");
            if (item.innerText.toLowerCase().includes(searchText)) {
                item.classList.remove("hidden");
                if (!setSelected) {
                    item.classList.add("selected");
                    setSelected = true;
                }
            } else {
                item.classList.add("hidden");
            }
        });
        document.querySelector("#command-palette-title").innerText = "Search Results";
        if (!setSelected) {
            emptyEl = document.createElement("div");
            emptyEl.id = "command-palette-empty";
            emptyEl.style = "display: flex; flex-direction: column; width: 100%;";
            emptyEl.innerHTML = `<section style="flex: 1 1 0%; display: flex; flex-direction: column; overflow: auto; height: 100%;">
                <div style="display: flex; align-items: center; line-height: 120%; width: 100%; user-select: none; font-size: 14px; padding-top: 32px; padding-bottom: 32px; margin-top: auto; margin-bottom: auto;">
                    <div style="margin-left: 12px; margin-right: 12px; min-width: 0px; flex: 1 1 auto; text-align: center;">
                        <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                            <h4 role="alert" style="margin: 0px; font-weight: 500; font-size: 14px; line-height: 20px; color: rgba(55, 53, 47, 0.65);">
                                No results
                            </h4>
                        </div>
                        <div style="white-space: normal; overflow: hidden; text-overflow: ellipsis; color: rgba(55, 53, 47, 0.65); margin-top: auto; font-size: 14px;">
                            <div style="font-size: 14px; margin-top: auto; color: rgba(55, 53, 47, 0.5);">
                                Oops! Command not found...
                            </div>
                        </div>
                    </div>
                </div>
            </section>`;
            document.querySelector("#notion-command-palette-list").appendChild(emptyEl);
        }
    } else {
        commandItems.forEach(item => {
            item.classList.remove("selected");
            item.classList.remove("hidden");
        });
        document.querySelector("#command-palette-title").innerText = "All Commands";
        commandItems[0].classList.add("selected");
    }
}

function bindCommandEvents() {
    // Add mouseover event listeners to command items
    let commandListEl = document.querySelector("#notion-command-palette-list ul");
    commandListEl.addEventListener("mouseover", (e) => {
        let selectedItem = commandListEl.querySelector(".command-palette-item.selected");
        if (selectedItem) {
            selectedItem.classList.remove("selected");
        }
        e.target.closest(".command-palette-item").classList.add("selected");
    });

    // Execute command after clicked command item
    commandListEl.addEventListener("click", (e) => {
        let commandItem = e.target.closest(".command-palette-item");
        executeCommand(commandItem.dataset.id);
    });

    let commandPalette = document.querySelector(".notion-quick-find-menu input");
    // Add keydown event listeners to command items
    commandPalette.addEventListener("keydown", (e) => {
        if (e.key !== "Escape") {
            e.stopPropagation();
        }
        if (e.key === "ArrowUp" || e.key === "ArrowDown") {
            e.preventDefault();
            let selectedItem = commandListEl.querySelector(".command-palette-item.selected");
            const offsetTop = selectedItem.offsetTop;
            const itemHeight = selectedItem.clientHeight;

            let mainList = document.querySelector(".notion-quick-find-menu main");
            const mainHeight = mainList.clientHeight;
            const scrollHeight = mainList.scrollHeight;
            const scrollTop = mainList.scrollTop;

            if (e.key === "ArrowUp") {
                let siblingItem = getSiblingCommandItem(selectedItem, "previous");
                if (siblingItem) {
                    selectedItem.classList.remove("selected");
                    siblingItem.classList.add("selected");
                    if (offsetTop - itemHeight * 2 <= scrollHeight - mainHeight) {
                        mainList.scroll({ top: scrollTop - itemHeight * 2, behavior: "smooth" });
                    }
                }
            } else {
                let siblingItem = getSiblingCommandItem(selectedItem, "next");
                if (siblingItem) {
                    selectedItem.classList.remove("selected");
                    siblingItem.classList.add("selected");
                    if (offsetTop + itemHeight > mainHeight) {
                        mainList.scroll({ top: scrollTop + itemHeight, behavior: "smooth" });
                    }
                }
            }
        } else if (e.key === "Enter") {
            let selectedItem = commandListEl.querySelector(".command-palette-item.selected");
            if (e.shiftKey) {
                if (selectedItem.dataset.id === CREATE_CMD) {
                    showToastMsg("Cannot edit this command");
                } else {
                    showCommandDialog(selectedItem.dataset.id);
                }
            } else {
                executeCommand(selectedItem.dataset.id);
            }
            removeCommandPalette();
        } else if (e.key === "Backspace" && e.shiftKey) {
            e.preventDefault();
            let selectedItem = commandListEl.querySelector(".command-palette-item.selected");
            if (DEFAULT_COMMANDS.includes(selectedItem.dataset.id)) {
                showToastMsg("Cannot delete this command");
            } else {
                let commandTitle = selectedItem.querySelector(".command-palette-item-title").innerText;
                showWarningDialog(`You are about to delete the command ${commandTitle}, this will be permanently deleted.`, "Delete", () => {
                    deleteCommand(selectedItem.dataset.id);
                });
            }
            removeCommandPalette();
        } else {
            if (!(e.altKey || e.ctrlKey || e.metaKey || e.shiftKey)) {
                clearTimeout(inputTimeout);
                inputTimeout = setTimeout(() => { searchCommands(commandPalette) }, 500);
            }
        }
    });
}

function showToastMsg(msg) {
    let toastEl = document.createElement("div");
    toastEl.dataset.overlay = "true";
    toastEl.style = "pointer-events: auto; position: relative; z-index: 0;";
    toastEl.innerHTML = `<div><div style="bottom: 24px; position: fixed; left: 0px; width: 100%; display: flex; z-index: 1000000; opacity: 1;">
        <div style="background: rgb(15, 15, 15); color: rgba(255, 255, 255, 0.9); border-radius: 3px; padding: 6px 12px; box-shadow: rgba(15, 15, 15, 0.05) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 5px 10px, rgba(15, 15, 15, 0.2) 0px 15px 40px; margin: 0px auto; font-size: 14px; display: flex; align-items: center;">
            ${msg}
        </div></div></div>`;
    toastEl.addEventListener('transitionend', () => toastEl.remove());
    toastEl.style.transition = "opacity 1.5s";
    setTimeout(() => {
        toastEl.style.opacity = 0;
    }, 1500);

    document.querySelector(".notion-overlay-container").appendChild(toastEl);
}

function showWarningDialog(msg, btnTitle, callback) {
    let dialogEl = document.createElement("div");
    dialogEl.dataset.overlay = "true";
    dialogEl.style = "pointer-events: auto; position: relative; z-index: 9999999;";
    dialogEl.innerHTML = `<div style="width: 100vw; height: 100vh; position: fixed; top: 0px; left: 0px; display: flex; align-items: center; justify-content: center; pointer-events: auto; opacity: 1; transform: translateZ(0px);">
        <div style="position: absolute; inset: 0px; background: rgba(15, 15, 15, 0.6);"></div>
        <div style="position: relative; z-index: 1; box-shadow: rgba(15, 15, 15, 0.05) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 5px 10px, rgba(15, 15, 15, 0.2) 0px 15px 40px; border-radius: 3px; background: white; margin-bottom: 0px; overflow: hidden; padding: 24px 32px; width: 336px; font-size: 16px; margin-left: 24px; margin-right: 24px;">
            <div><div style="display: flex; align-items: center; justify-content: center; min-height: 64px;">
                ${msg}
            </div><div>
        <div style="padding-top: 6px; padding-bottom: 6px;">
            <div id="dialog-button-confirm" class="notion-focusable" role="button" tabindex="0" style="user-select: none; transition: background 20ms ease-in 0s; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; white-space: nowrap; border-radius: 3px; height: 32px; padding: 0px 12px; font-size: 14px; line-height: 1.2; color: rgb(235, 87, 87); border: 1px solid rgba(235, 87, 87, 0.5); width: 100%; margin-top: 8px; background: rgba(235, 87, 87, 0.1);">
                ${btnTitle || "Confirm"}
            </div>
            <div id="dialog-button-close" class="notion-focusable" role="button" tabindex="0" style="user-select: none; transition: background 20ms ease-in 0s; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; white-space: nowrap; border-radius: 3px; height: 32px; padding: 0px 12px; font-size: 14px; line-height: 1.2; border: 1px solid rgba(55, 53, 47, 0.16); width: 100%; margin-top: 8px;">
                Close
            </div>
        </div></div></div></div></div>`
    dialogEl.querySelector("#dialog-button-close").addEventListener("click", () => {
        dialogEl.remove();
    });

    dialogEl.querySelector("#dialog-button-confirm").addEventListener("click", () => {
        dialogEl.remove();
        callback();
    });

    document.querySelector(".notion-overlay-container").appendChild(dialogEl);
}

function showCommandDialog(commandId) {
    let overlayEl = document.createElement("div");
    overlayEl.dataset.overlay = "true";
    overlayEl.style = "pointer-events: auto; position: relative; z-index: 0;";
    overlayEl.innerHTML = `<div class="command-palette-dialog" style="width: 100vw; height: 100vh; position: fixed; top: 0px; left: 0px; display: flex; align-items: center; justify-content: center; pointer-events: auto; opacity: 1; transform: translateZ(0px);">
        <div style="position: absolute; inset: 0px; background: rgba(15, 15, 15, 0.6);"></div>
        <div style="position: relative;z-index: 1;box-shadow: rgba(15, 15, 15, 0.05) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 5px 10px, rgba(15, 15, 15, 0.2) 0px 15px 40px;border-radius: 5px;background: white;margin-bottom: 0px;width: 900px;max-width: calc(100vw - 100px);height: calc(100vh - 100px);overflow: hidden;max-height: 715px;">
            <div style="display: flex; height: 100%; flex-direction: row;">
                <div style="flex-grow: 1; position: relative; z-index: 1; height: 100%;">
                    <div style="display: flex; flex-direction: column; width: 100%; height: 100%; background-color: white;">
                        <div class="notion-scroller vertical horizontal" style="flex-grow: 1; transform: translateZ(0px); padding: 36px 60px; z-index: 1; overflow: auto; margin-right: 0px; margin-bottom: 0px;">
                            <div id="command-dialog-title" style="color: rgb(55, 53, 47); border-bottom: 1px solid rgba(55, 53, 47, 0.09); margin-bottom: 16px; padding-bottom: 12px; font-size: 16px; font-weight: 500; width: auto;">
                                Notion Palette
                            </div>
                            <div style="color: rgb(55, 53, 47); border-bottom: 0px; margin-bottom: 8px; padding-bottom: 0px; font-size: 14px; font-weight: 400; width: auto;">
                                Name
                            </div>
                            <div class="notion-focusable-within" style="display: flex; align-items: center; width: 100%; font-size: 14px; line-height: 20px; padding: 4px 10px; position: relative; border-radius: 3px; box-shadow: rgba(15, 15, 15, 0.1) 0px 0px 0px 1px inset; background: rgba(242, 241, 238, 0.6); cursor: text;">
                                <input id="command-item-name" placeholder="e.g. Quick Note" type="text" style="font-size: inherit; line-height: inherit; border: none; background: none; width: 100%; display: block; resize: none; padding: 0px;">
                            </div>
                            <div style="font-size: 12px; line-height: 16px; color: rgba(55, 53, 47, 0.65); margin-top: 4px;">
                                The name of your command, which will be displayed in the command palette.
                            </div>
                            <div style="display: flex; align-items: center; justify-content: center; pointer-events: none; width: 100%; height: 37px; flex: 0 0 auto;">
                                <div style="width: 100%; height: 1px; visibility: visible; border-bottom: 1px solid rgba(55, 53, 47, 0.16);"></div>
                            </div>
                            <div style="color: rgb(55, 53, 47); border-bottom: 0px; margin-bottom: 8px; padding-bottom: 0px; font-size: 14px; font-weight: 400; width: auto;">
                                Icon
                            </div>
                            <div class="notion-focusable-within" style="display: flex; align-items: center; width: 100%; font-size: 14px; line-height: 20px; padding: 4px 10px; position: relative; border-radius: 3px; box-shadow: rgba(15, 15, 15, 0.1) 0px 0px 0px 1px inset; background: rgba(242, 241, 238, 0.6); cursor: text;">
                                <input id="command-item-icon" placeholder="e.g. https://example.com/icon.png" type="text"
                                    style="font-size: inherit; line-height: inherit; border: none; background: none; width: 100%; display: block; resize: none; padding: 0px;">
                            </div>
                            <div style="font-size: 12px; line-height: 16px; color: rgba(55, 53, 47, 0.65); margin-top: 8px;">
                                The URL of your command icon. It will show up in your command palette.
                            </div>
                            <div style="display: flex; align-items: center; justify-content: center; pointer-events: none; width: 100%; height: 37px; flex: 0 0 auto;">
                                <div style="width: 100%; height: 1px; visibility: visible; border-bottom: 1px solid rgba(55, 53, 47, 0.16);"></div>
                            </div>
                            <div style="color: rgb(55, 53, 47); border-bottom: 0px; margin-bottom: 8px; padding-bottom: 0px; font-size: 14px; font-weight: 400; width: auto;">
                                Description
                            </div>
                            <div class="notion-focusable-within" style="display: flex; align-items: center; width: 100%; font-size: 14px; line-height: 20px; padding: 4px 10px; position: relative; border-radius: 3px; box-shadow: rgba(15, 15, 15, 0.1) 0px 0px 0px 1px inset; background: rgba(242, 241, 238, 0.6); cursor: text;">
                                <input id="command-item-desc" placeholder="e.g. Take a quick note." type="text"
                                    style="font-size: inherit; line-height: inherit; border: none; background: none; width: 100%; display: block; resize: none; padding: 0px;">
                            </div>
                            <div style="font-size: 12px; line-height: 16px; color: rgba(55, 53, 47, 0.65); margin-top: 8px;">
                                To describe what the command do.
                            </div>
                            <div style="display: flex; align-items: center; justify-content: center; pointer-events: none; width: 100%; height: 37px; flex: 0 0 auto;">
                                <div style="width: 100%; height: 1px; visibility: visible; border-bottom: 1px solid rgba(55, 53, 47, 0.16);"></div>
                            </div>
                            <div style="color: rgb(55, 53, 47); border-bottom: 0px; margin-bottom: 8px; padding-bottom: 0px; font-size: 14px; font-weight: 400; width: auto;">
                                Code
                            </div>
                            <div style="display: flex; flex-wrap: wrap; align-items: flex-start; min-height: 32px; box-shadow: rgba(15, 15, 15, 0.1) 0px 0px 0px 1px inset; background: rgba(242, 241, 238, 0.6); border-radius: 3px; font-size: 14px; cursor: text; overflow: hidden; padding: 7px 9px 0px;">
                                <div style="display: flex; align-items: center; border: none; padding: 0px; width: auto; background: transparent; font-size: inherit; line-height: 20px; flex: 1 1 60px; min-width: 60px; margin: 0px 6px 6px 0px;">
                                    <textarea id="command-item-code" placeholder="Type the JavaScript code here…" autocomplete="off" autocorrect="off"
                                        autocapitalize="off" spellcheck="false" size="1"
                                        style="font-size: inherit;line-height: inherit;border: none;background: none;width: 100%;display: block;resize: auto;padding: 0px;height: 240px;"></textarea>
                                </div>
                            </div>
                            <div id="command-item-code-desc" style="font-size: 12px; line-height: 16px; color: rgba(55, 53, 47, 0.65); margin-top: 4px;">
                                Write your command code here, only support JavaScript. See the
                                <a href="#" target="_blank" rel="noopener noreferrer" class="notion-link" style="display: inline; text-decoration: underline; user-select: none; cursor: pointer; color: inherit;">
                                    docs
                                </a> for more information.
                            </div>
                            <div id="command-item-danger-zone">
                                <div style="display: flex; align-items: center; justify-content: center; pointer-events: none; width: 100%; height: 37px; flex: 0 0 auto;">
                                    <div style="width: 100%; height: 1px; visibility: visible; border-bottom: 1px solid rgba(55, 53, 47, 0.16);"></div>
                                </div>
                                <div style="color: rgb(55, 53, 47); border-bottom: 0px; margin-bottom: 8px; padding-bottom: 0px; font-size: 14px; font-weight: 400; width: auto;">
                                    Danger zone
                                </div>
                                <div style="display: flex;">
                                    <div id="command-button-delete" class="notion-focusable" role="button" tabindex="0"
                                        style="user-select: none; transition: background 20ms ease-in 0s; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; white-space: nowrap; border-radius: 3px; height: 32px; padding: 0px 12px; font-size: 14px; line-height: 1.2; color: rgb(235, 87, 87); border: 1px solid rgba(235, 87, 87, 0.5);">
                                        Delete Command
                                    </div>
                                </div>
                            </div>
                            <div style="height: 12px;"></div>
                        </div>
                        <div style="flex-grow: 0; flex-shrink: 0; padding: 16px 60px; box-shadow: rgba(55, 53, 47, 0.09) 0px -1px 0px;">
                            <div style="display: flex;">
                                <div id="command-button-save" class="notion-focusable" role="button" aria-disabled="false" tabindex="0"
                                    style="user-select: none; transition: background 20ms ease-in 0s; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; white-space: nowrap; height: 32px; border-radius: 3px; box-shadow: rgba(15, 15, 15, 0.1) 0px 0px 0px 1px inset, rgba(15, 15, 15, 0.1) 0px 1px 2px; background: rgb(46, 170, 220); color: white; fill: white; line-height: 1.2; padding-left: 12px; padding-right: 12px; font-size: 14px; font-weight: 500;">
                                    Create
                                </div>
                                <div id="command-button-cancel" class="notion-focusable" role="button" tabindex="0"
                                    style="user-select: none; transition: background 20ms ease-in 0s; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; white-space: nowrap; border-radius: 3px; height: 32px; padding: 0px 12px; font-size: 14px; line-height: 1.2; border: 1px solid rgba(55, 53, 47, 0.16); margin-left: 12px;">
                                    Cancel
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`;

    overlayEl.addEventListener("mousemove", (e) => {
        e.stopPropagation();
    });

    overlayEl.addEventListener("keydown", (e) => {
        e.stopPropagation();
    });

    overlayEl.addEventListener("cut", (e) => {
        e.stopPropagation();
    });

    overlayEl.addEventListener("copy", (e) => {
        e.stopPropagation();
    });

    overlayEl.addEventListener("paste", (e) => {
        e.stopPropagation();
    });

    overlayEl.querySelector("#command-button-cancel").addEventListener("click", () => {
        overlayEl.remove();
    });

    overlayEl.querySelector("#command-button-save").addEventListener("click", () => {
        let commandId = overlayEl.dataset.id;
        if (commandId === ENV_CMD) {
            let commandEnv = document.querySelector("#command-item-code").value;
            try {
                commandEnv = JSON.parse(commandEnv);
                chrome.storage.sync.set({ commandEnv: commandEnv });
            } catch (e) {
                if (e instanceof SyntaxError) {
                    showToastMsg("Invalid JSON syntax");
                }
                console.error(e);
                return;
            }
        } else {
            chrome.storage.sync.get(["commands"], function(result) {
                if (result.commands === undefined) {
                    console.error("Command not found");
                } else {
                    let iconUrl = overlayEl.querySelector("#command-item-icon").value;
                    let commandTitle = overlayEl.querySelector("#command-item-name").value;
                    let commandDesc = overlayEl.querySelector("#command-item-desc").value;
                    let commandScript = overlayEl.querySelector("#command-item-code").value;
                    if (commandId) {
                        let command = result.commands.find(cmd => cmd.id == commandId);
                        command.icon = iconUrl;
                        command.title = commandTitle;
                        command.description = commandDesc;
                        command.script = commandScript;
                    } else {
                        result.commands.push({
                            id: new Date().getTime(),
                            icon: iconUrl,
                            title: commandTitle,
                            description: commandDesc,
                            script: commandScript
                        });
                    }
                    chrome.storage.sync.set({"commands": result.commands});
                }
            });
        }
        overlayEl.remove();
    });

    let overlayContainer = document.querySelector(".notion-overlay-container");
    if (commandId === ENV_CMD) {
        overlayEl.dataset.id = commandId;
        overlayEl.querySelector("#command-dialog-title").innerText = "Command Secrets";
        overlayEl.querySelector("#command-button-save").innerText = "Update";
        overlayEl.querySelector("#command-item-icon").disabled = true;
        overlayEl.querySelector("#command-item-icon").value = chrome.runtime.getURL("assets/lock.png");
        overlayEl.querySelector("#command-item-name").disabled = true;
        overlayEl.querySelector("#command-item-name").value = "Command Secrets";
        overlayEl.querySelector("#command-item-desc").disabled = true;
        overlayEl.querySelector("#command-item-desc").value = "Store your command secrets or environment variables here, use getEnv('key') to retrieve.";
        let commandItemCode = overlayEl.querySelector("#command-item-code");
        commandItemCode.placeholder = "A JSON object containing your command secrets or environment variables…";
        overlayEl.querySelector("#command-item-code-desc").innerHTML = 'Place your command secrets or environment variables here, must be a valid JSON object. See the <a href="#" target="_blank" rel="noopener noreferrer" class="notion-link" style="display: inline; text-decoration: underline; user-select: none; cursor: pointer; color: inherit;">docs</a> for more information.';
        chrome.storage.sync.get(["commandEnv"], (result) => {
            let commandEnv = {};
            if (result !== "undefined") {
                commandEnv = result.commandEnv;
            }
            commandItemCode.value = JSON.stringify(commandEnv, null, 2);
        });
        overlayEl.querySelector("#command-item-danger-zone").style = "display: none;";
        overlayContainer.appendChild(overlayEl);
    } else if (commandId) {
        overlayEl.dataset.id = commandId;
        overlayEl.querySelector("#command-dialog-title").innerText = "Edit Command";
        overlayEl.querySelector("#command-button-save").innerText = "Update";
        chrome.storage.sync.get(["commands"], function(result) {
            if (result.commands === undefined) {
                console.error("Command not found");
            } else {
                let command = result.commands.find(cmd => cmd.id == commandId);
                if (command) {
                    overlayEl.querySelector("#command-item-icon").value = command.icon;
                    overlayEl.querySelector("#command-item-name").value = command.title;
                    overlayEl.querySelector("#command-item-desc").value = command.description;
                    overlayEl.querySelector("#command-item-code").value = command.script;
                }
                overlayContainer.appendChild(overlayEl);
            }
        });
        overlayEl.querySelector("#command-button-delete").addEventListener("click", () => {
            showWarningDialog(`You are about to delete the command, this will be permanently deleted.`, "Delete", () => {
                deleteCommand(commandId);
                overlayEl.remove();
            });
        });
    } else {
        overlayEl.querySelector("#command-dialog-title").innerText = "Create Command";
        overlayEl.querySelector("#command-item-danger-zone").style = "display: none;";
        overlayContainer.appendChild(overlayEl);
    }
}

async function getEnv(key) {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(["commandEnv"], (result) => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }
      resolve(result.commandEnv[key]);
    });
  });
}

async function copyText(text) {
    return navigator.clipboard.writeText(text);
}

function getCurrentPageId() {
    const url = new URL(window.location.href);
    const pageId = url.searchParams.get('p');
    if (pageId) {
        return pageId;
    } else {
        return url.pathname.split('-').slice(-1)[0];
    }
}

async function executeCommand(commandId) {
    if (commandId === CREATE_CMD) {
        createCommand();
    } else if (commandId === ENV_CMD) {
        showCommandDialog(ENV_CMD);
    } else {
        chrome.storage.sync.get(["commands"], function(result) {
            if (result.commands === undefined) {
                console.error("Command not found");
            } else {
                let command = result.commands.find(cmd => cmd.id == commandId);
                if (command) {
                    const interpreter = new Sval({ecmaVer: 9, sandbox: true});
                    interpreter.import({
                        copyText: copyText,
                        getEnv: getEnv,
                        showToast: showToastMsg,
                        getCurrentPageId: getCurrentPageId,
                    });
                    interpreter.run(command.script);
                    console.log(`Execute command ${command.title}`);
                }
            }
        });
    }
}

async function createCommand() {
    showCommandDialog();
}

async function deleteCommand(commandId) {
    chrome.storage.sync.get(["commands"], function(result) {
        if (result.commands === undefined) {
            console.error("Command not found");
        } else {
            let command = result.commands.find(cmd => cmd.id == commandId);
            if (command) {
                result.commands.splice(result.commands.indexOf(command), 1);
                chrome.storage.sync.set({"commands": result.commands});
            }
        }
    });
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.command === "show_command_palette") {
        showAllCommands();
        bindCommandEvents();
    }
});
