import assert = require('assert');
import { before, after } from 'mocha';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import { storageKey } from '../../lib/const';
import FirstradeMonitor from '../../lib/firstrade-monitor';

suite('Firstrade Monitor Test Suite', () => {
	before(() => {
		vscode.window.showInformationMessage('Start tests.');
		init();
	});

	after(() => {
		vscode.window.showInformationMessage('All tests done!');
		init();
	});

	test("should login", async () => {
		await FirstradeMonitor.login();
		const showInputBox = vscode.window.showInformationMessage('Should Login: Should Display Login Input Box', 'Pass', 'Failed');
		const showConnecting = vscode.window.showInformationMessage('Should Login: Should Display Connect Status at Bottom Bar', 'Pass', 'Failed');
		const showBalance = vscode.window.showInformationMessage('Should Login: Should Display Balance at Bottom Bar', 'Pass', 'Failed');

		assert(await matchCondition('Pass', showInputBox, showBalance, showConnecting))
	}).timeout(99999 * 1000)


	test("should return balance", async () => {
		const balance = await FirstradeMonitor.fetchBalance()
		assert.ok(balance)
	}).timeout(99 * 1000)

	test("should logout", async () => {
		FirstradeMonitor.logout()
		const showDisconnect = vscode.window.showInformationMessage('Should Logout: Should Display Disconnect State at Bottom Bar', 'Pass', 'Failed')
		assert(await matchCondition('Pass', showDisconnect))
	}).timeout(99999 * 1000)

});

async function matchCondition(matchStr: string, ...showInputBox: Thenable<string | undefined>[]) {
	let ret = true
	for (const thenable of showInputBox) {
		ret = ret && (await thenable) == matchStr
	}
	return ret
}

function init() {
	FirstradeMonitor.extensionContext.globalState.update(storageKey.loginCache, null);
}

