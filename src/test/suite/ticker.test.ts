import assert = require('assert');
import { before, after } from 'mocha';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import { storageKey } from '../../lib/const';
import FirstradeTicker from '../../lib/firstrade-ticker';

suite('Firstrade Ticker Test Suite', () => {
	before(() => {
		vscode.window.showInformationMessage('Start all tests.');
		init();
	});

	after(() => {
		vscode.window.showInformationMessage('All tests done!');
		init();
	});

	test("should login", async () => {
		await FirstradeTicker.login();
		const showInputBox = vscode.window.showInformationMessage('Should Login: Should Display Login Input Box', 'Pass', 'Failed');
		const showConnecting = vscode.window.showInformationMessage('Should Login: Should Display Connect Status at Bottom Bar', 'Pass', 'Failed');
		const showBalance = vscode.window.showInformationMessage('Should Login: Should Display Balance at Bottom Bar', 'Pass', 'Failed');

		assert(await matchCondition('Pass', showInputBox, showBalance, showConnecting))
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
	FirstradeTicker.extensionContext.globalState.update(storageKey.loginCache, null);
}

