import { firstrade } from 'firstrade-cli';
import Firstrade = require('firstrade-cli');
import * as vscode from 'vscode';
import { storageKey } from './const';
import { StatusBarItem } from './status-bar-item';


namespace FirstradeExtension {
	export let extensionContext!: vscode.ExtensionContext;
	export const statusBarItem = new StatusBarItem();
	export const login = async () => {
		const loginContext: Firstrade.Credential = <Firstrade.Credential>{};
		loginContext.username = await vscode.window.showInputBox({ prompt: "Firstrade Username" }) as string;
		if (!!loginContext.username)
			loginContext.password = await vscode.window.showInputBox({ prompt: "Firstrade Password", password: true }) as string;
		if (!!loginContext.username && !!loginContext.password)
			loginContext.pin = await vscode.window.showInputBox({ prompt: "Firstrade Pin", password: true }) as string;
		const required = ["username", "password", "pin"].filter(x => !(loginContext as any)[x]);
		if (required.length > 0) {
			vscode.window.showInformationMessage(`Firstrade Login Failed: ${required.join(", ")} required.`);
			return;
		}
		statusBarItem.displayConnecting()
		for (let numOfRetry = 0; numOfRetry < 5; numOfRetry++) {
			const ret = await firstrade.login(loginContext) as Firstrade.Cookie[]
			const sessionTime = await getLoginStatus(ret)
			if (!!sessionTime) {
				extensionContext.globalState.update(storageKey.loginCache, undefined);
				vscode.window.showInformationMessage(`Failed to Login Firstrade. Retrying...${!!numOfRetry ? `(${numOfRetry})` : ""}`);
				return;
			}
			extensionContext.globalState.update(storageKey.loginCache, ret);
		}
	};

	export const logout = () => {
		extensionContext.globalState.update(storageKey.loginCache, undefined);
		vscode.window.showInformationMessage(`Logged Out.`);
	}

	export const getLoginStatus = async (cache = getCache()) => {
		if (typeof cache == 'string')
			return cache
		if (!cache)
			return `not logined`;
		const ret = await firstrade.getSessionTimeLeft(cache);
		if (ret <= 0)
			return `session expired`;
		return
	}

	export const fetchBalance = async () => {
		const failedReason = await getLoginStatus()
		if (!failedReason)
			return firstrade.getBalance(getCache());
		else
			statusBarItem.displayDisconnected()
	};

	function getCache() {
		return extensionContext.globalState.get(storageKey.loginCache) as Firstrade.Cookie[];
	}

	export function getConfig(config: string | number) {
		return vscode.workspace.getConfiguration("firstrade")[config];
	}

	export function sleep(ms: number) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	(async () => {
		while (!extensionContext)
			await sleep(300)
		while (true)
			await statusBarItem.updateBalance()
	})()
}


export default FirstradeExtension;