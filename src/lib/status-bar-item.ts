import * as vscode from 'vscode';
import Firstrade = require('firstrade-cli');
import { commandId, configKey } from './const';
import FirstradeExtension from "./FirstradeExtension";

export class StatusBarItem {
    #ui: vscode.StatusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Left,
        9999
    );
    #balance: Firstrade.Balance | undefined

    constructor() {
        this.displayConnecting()
        this.#ui.show()
    }

    async updateBalance() {
        const scrollSpeedInSecond = FirstradeExtension.getConfig(configKey.scrollSpeed);
        this.#balance = await FirstradeExtension.fetchBalance()
        if (!!this.#balance)
            this.#displayBalance()
        await FirstradeExtension.sleep(scrollSpeedInSecond * 1000)
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