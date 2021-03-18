import * as vscode from 'vscode';
import FirstradeTicker from './lib/firstrade-ticker';
import { commandId } from './lib/const';

export async function activate(context: vscode.ExtensionContext) {
	FirstradeTicker.extensionContext = context
	const login = vscode.commands.registerCommand(commandId.login, FirstradeTicker.login);
	const logout = vscode.commands.registerCommand(commandId.logout, FirstradeTicker.logout);
	context.subscriptions.push(login, logout);

	FirstradeTicker.statusBarItem.initUi()
}

export function deactivate() { }