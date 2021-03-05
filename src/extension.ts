import * as vscode from 'vscode';
import FirstradeExtension from './lib/FirstradeExtension';
import { commandId } from './lib/const';

export async function activate(context: vscode.ExtensionContext) {
	FirstradeExtension.extensionContext = context
	const login = vscode.commands.registerCommand(commandId.login, FirstradeExtension.login);
	const logout = vscode.commands.registerCommand(commandId.logout, FirstradeExtension.logout);
	context.subscriptions.push(login, logout);
}

export function deactivate() { }