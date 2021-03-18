import * as vscode from 'vscode';
import Firstrade = require('firstrade-cli');
import { commandId, configKey } from './const';
import FirstradeTicker from "./firstrade-ticker";

export class StatusBarItem {
    #ui!: vscode.StatusBarItem
    #balance: Firstrade.Balance | undefined

    initUi() {
        const alignment: "Left" | "Right" = FirstradeTicker.getConfig(configKey.alignment);
        if (this.#ui)
            this.#ui.dispose()
        this.#ui = vscode.window.createStatusBarItem(
            vscode.StatusBarAlignment[alignment],
            9999
        );
        this.#ui.show()
        this.displayConnecting()
    }

    async updateBalance() {
        const scrollSpeedInSecond = FirstradeTicker.getConfig(configKey.scrollSpeed);
        this.#balance = await FirstradeTicker.fetchBalance()
        if (!!this.#balance)
            this.#displayBalance()
        await FirstradeTicker.sleep(scrollSpeedInSecond * 1000)
    }

    displayConnecting = () => {
        const str = "Firstrade Connecting...";
        if (this.#ui.tooltip == str)
            return
        this.#ui.text = "$(sync~spin)"
        this.#ui.tooltip = str;
    }

    displayDisconnected = () => {
        const str = "Firstrade Disconnected (Click to Login)"
        if (this.#ui.tooltip == str)
            return
        this.#ui.text = "$(debug-disconnect)"
        this.#ui.tooltip = "Firstrade Disconnected (Click to Login)";
        this.#ui.command = commandId.login
    }

    #displayBalance = async () => {
        const str = "Firstrade Balance";
        if (this.#balance!.totalNetchangeValue == 0)
            this.#ui.text = `$(arrow-right)`;
        else if (this.#balance!.totalNetchangeValue > 0)
            this.#ui.text = `$(arrow-up)`;
        else
            this.#ui.text = `$(arrow-down)`;
        this.#ui.text += `$${this.#balance!.totalAccountValue}`;
        if (this.#ui.tooltip == str)
            return
        this.#ui.tooltip = "Firstrade Balance";
        this.#ui.command = commandId.logout
    }
}