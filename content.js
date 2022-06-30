function removeCommandPalette() {
    let commandPaletteEl = document.querySelector("#notion-command-palette");
    if (commandPaletteEl) {
        commandPaletteEl.remove();
    }
}

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        removeCommandPalette();
    }
});

document.addEventListener("click", (e) => {
    removeCommandPalette();
});

function getCommanItems() {
    let commandItemEl = document.createElement("div");
    commandItemEl.className = "notranslate notion-focusable command-palette-item";
    commandItemEl.setAttribute("tabindex", "0");
    commandItemEl.setAttribute("role", "button");
    commandItemEl.style = "user-select: none; transition: none 0s ease 0s; cursor: pointer; width: calc(100% - 8px); margin-left: 4px; margin-right: 4px; border-radius: 3px;";
    commandItemEl.innerHTML = `<div style="display: flex; align-items: center; line-height: 120%; width: 100%; user-select: none; min-height: 36px; font-size: 14px; padding-top: 8px; padding-bottom: 8px;">
        <div style="display: flex; align-items: center; justify-content: center; margin-left: 10px; margin-right: 4px; margin-top: 1px; align-self: center;">
            <div class="command-palette-item-icon notranslate notion-focusable" role="button" aria-disabled="true" tabindex="-1"
                style="user-select: none; transition: background 20ms ease-in 0s; display: flex; align-items: center; justify-content: center; height: 19px; width: 19px; border-radius: 3px; flex-shrink: 0;">
                <div>
                    <div style="width: 100%; height: 100%;">
                        <img src="http://api.wolai.com/v1/icon?type=2&amp;locale=en&amp;date=2022-06-30&amp;pro=0&amp;color=green"
                            style="display: block; object-fit: cover; border-radius: 3px; width: 16.872px; height: 16.872px; transition: opacity 100ms ease-out 0s;">
                    </div>
                </div>
            </div>
        </div>
        <div style="margin-left: 8px; margin-right: 12px; min-width: 0px; display: inline-flex; align-items: baseline; width: 100%;">
            <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex-shrink: 0; max-width: 100%;">
                <div style="display: flex; flex-direction: row; font-weight: 500; line-height: 20px;">
                    <div class="notranslate command-palette-item-title" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: 500; line-height: 20px;">
                        2022-06-30
                    </div>
                </div>
            </div>
            <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: rgba(55, 53, 47, 0.65); margin-top: 1px; font-size: 12px; display: inline-flex;">
                <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: rgba(55, 53, 47, 0.65); margin-top: 0px; font-size: 12px; margin-left: 0.5em; margin-right: 0.5em;">—</span>
                <div style="display: flex; font-size: 12px; color: rgba(55, 53, 47, 0.5); overflow: hidden;">
                    <div class="notranslate command-palette-item-desc" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 12px; color: rgba(55, 53, 47, 0.5);">
                        Dashboard
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
    let commands = [
        {id: 1, title: 'Command Palette 001', description: 'This is the command description', icon: 'http://api.wolai.com/v1/icon?type=2&locale=en&date=2022-06-30&pro=0&color=green'},
        {id: 2, title: 'Command Palette 002', description: 'This is the second command description', icon: 'http://api.wolai.com/v1/icon?type=2&locale=en&date=2022-06-28&pro=0&color=red'},
    ];
    for (let command of commands) {
        let commandItem = commandItemEl.cloneNode(true);
        commandItem.dataset.commandId = command.id;
        commandItem.querySelector(".command-palette-item-icon img").src = command.icon;
        commandItem.querySelector(".command-palette-item-title").innerText = command.title;
        commandItem.querySelector(".command-palette-item-desc").innerText = command.description;
        commandItems.push(commandItem);
    }
    commandItems[0].classList.add("selected");
    return commandItems; 
}

function showAllCommands() {
    let commandList = document.createElement("div");
    commandList.id = "notion-command-palette-list";
    commandList.style = "padding-top: 0px; padding-bottom: 8px;";
    commandList.innerHTML = `<div style="display: flex; padding: 2px 14px 0px; margin: 0px; color: rgba(55, 53, 47, 0.65); font-size: 11px; font-weight: 500; line-height: 120%; user-select: none; height: 32px; align-items: center; text-transform: uppercase;">
        <div style="align-self: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">All Commands</div></div>
        <ul style="list-style-type: none; padding: 0px; margin: 0px;"></ul>`;

    let commandItems = getCommanItems();
    commandList.querySelector("ul").append(...commandItems);
    document.querySelector("#notion-command-palette main div").appendChild(commandList);
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
        executeCommand(commandItem.dataset.commandId);
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
            if (e.key === "ArrowUp") {
                if (selectedItem.previousElementSibling) {
                    selectedItem.classList.remove("selected");
                    selectedItem.previousElementSibling.classList.add("selected");
                }
            } else {
                if (selectedItem.nextElementSibling) {
                    selectedItem.classList.remove("selected");
                    selectedItem.nextElementSibling.classList.add("selected");
                }
            }
        }
    });

    // Add enter event listener to command palette
    commandPalette.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            let selectedItem = commandListEl.querySelector(".command-palette-item.selected");
            executeCommand(selectedItem.dataset.commandId);
            removeCommandPalette();
        }
    });
}

function executeCommand(commandId) {
    // TODO: execute command
    console.log(`Executing command ${commandId}`);
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.command === "show_command_palette") {
        showAllCommands();
        bindCommandEvents();
    }
});
