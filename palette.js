function showCommandPalette() {
    const PALETTE_HTML = `<div id="notion-command-palette" data-overlay="true" style="pointer-events: auto; position: relative; z-index: 0;">
        <div
            style="width: 100vw; height: 100vh; position: fixed; top: 0px; left: 0px; display: flex; align-items: flex-start; justify-content: center; pointer-events: auto;">
            <div style="position: absolute; inset: 0px; background: rgba(15, 15, 15, 0.6);"></div>
            <div style="position: relative; z-index: 1; box-shadow: rgba(15, 15, 15, 0.05) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 5px 10px, rgba(15, 15, 15, 0.2) 0px 15px 40px; border-radius: 5px; background: white; margin-bottom: 0px; top: 90px; overflow: hidden; width: 75%; min-height: 50px; max-height: 80vh; max-width: 600px;">
                <div class="notion-quick-find-menu" style="display: flex; flex-direction: column; min-width: 180px; max-width: calc(100vw - 24px); height: 100%; max-height: 80vh; min-height: 50px;">
                    <div style="flex-grow: 1; min-height: 0px; transform: translateZ(0px); display: flex; flex-flow: row nowrap; justify-content: space-between; max-height: 80vh;">
                        <div style="flex: 1 1 0%; overflow: hidden; display: flex; flex-direction: column;">
                            <div style="display: flex; align-items: center; border: none; padding: 0px 16px; width: 100%; background: transparent; font-size: 18px; line-height: inherit; height: 52px; flex-grow: 0; flex-shrink: 0; z-index: 1; box-shadow: rgba(55, 53, 47, 0.09) 0px 1px 0px;">
                                <svg viewBox="0 0 17 17" class="searchNew" style="width: 18px; height: 18px; display: block; fill: rgba(55, 53, 47, 0.45); flex-shrink: 0; backface-visibility: hidden; margin-right: 10px; flex-grow: 0;">
                                    <path d="M6.78027 13.6729C8.24805 13.6729 9.60156 13.1982 10.709 12.4072L14.875 16.5732C15.0684 16.7666 15.3232 16.8633 15.5957 16.8633C16.167 16.8633 16.5713 16.4238 16.5713 15.8613C16.5713 15.5977 16.4834 15.3516 16.29 15.1582L12.1504 11.0098C13.0205 9.86719 13.5391 8.45215 13.5391 6.91406C13.5391 3.19629 10.498 0.155273 6.78027 0.155273C3.0625 0.155273 0.0214844 3.19629 0.0214844 6.91406C0.0214844 10.6318 3.0625 13.6729 6.78027 13.6729ZM6.78027 12.2139C3.87988 12.2139 1.48047 9.81445 1.48047 6.91406C1.48047 4.01367 3.87988 1.61426 6.78027 1.61426C9.68066 1.61426 12.0801 4.01367 12.0801 6.91406C12.0801 9.81445 9.68066 12.2139 6.78027 12.2139Z"></path>
                                </svg>
                                <input placeholder="Search Commands…" type="text" style="font-size: inherit; line-height: inherit; border: none; background: none; width: 100%; display: block; resize: none; padding: 0px; min-width: 0px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                            </div>
                            <main style="width: 100%; height: 100%; overflow: hidden auto;">
                                <div>
                                </div>
                            </main>
                        </div>
                    </div>
                    <footer style="flex-shrink: 0;">
                        <div style="box-shadow: rgba(55, 53, 47, 0.09) 0px -1px 0px; margin-top: 1px; display: flex; flex-direction: row; justify-content: space-between; align-items: center; font-size: 14px;">
                            <div style="display: flex; align-items: center; line-height: 120%; width: 100%; user-select: none; min-height: 28px; font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: rgba(55, 53, 47, 0.5);">
                                <div style="margin-left: 12px; margin-right: 12px; min-width: 0px; flex: 1 1 auto;">
                                    <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                                        <ul style="list-style-type: none; padding: 0px; margin: 0px; font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: rgba(55, 53, 47, 0.5);">
                                            <li style="display: inline; margin-right: 16px;">
                                                <span style="margin-right: 4px; margin-bottom: 1px; font-variant: all-small-caps; font-size: 13.2px; color: rgba(55, 53, 47, 0.65);">↑↓</span>Select
                                            </li>
                                            <li style="display: inline; margin-right: 16px;">
                                                <span style="margin-right: 4px; margin-bottom: 1px; font-variant: all-small-caps; font-size: 13.2px; color: rgba(55, 53, 47, 0.65);">↵</span>Execute
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    </div>`
    let template = document.createElement('template');
    template.innerHTML = PALETTE_HTML;
    let overlayContainer = document.querySelector(".notion-overlay-container");
    overlayContainer.append(...template.content.childNodes);

    let commandPalette = document.querySelector(".notion-quick-find-menu input");
    commandPalette.focus();
    commandPalette.addEventListener("click", (e) => {
        e.stopPropagation();
    });
}

showCommandPalette();
