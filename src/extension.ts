import * as vscode from 'vscode';
import FirstradeMonitor from './lib/firstrade-monitor';
import { commandId } from './lib/const';

export async function activate(context: vscode.ExtensionContext) {
	FirstradeMonitor.extensionContext = context
	const login = vscode.commands.registerCommand(commandId.login, FirstradeMonitor.login);
	const logout = vscode.commands.registerCommand(commandId.logout, FirstradeMonitor.logout);
	context.subscriptions.push(login, logout);

	FirstradeMonitor.statusBarItem.initUi()
}

export function deactivate() { }