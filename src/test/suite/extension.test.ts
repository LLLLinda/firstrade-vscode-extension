import * as assert from 'assert';
// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';

suite('Extension Test Suite', () => {
	test("Extension should be present", () => {
		assert.ok(vscode.extensions.getExtension("linda-cheung.firstrade-ticker"));
	});
	test("should activate", function () {
		this.timeout(1 * 60 * 1000);
		return vscode.extensions.getExtension("linda-cheung.firstrade-ticker")!.activate().then((_api) => {
			assert.ok(true);
		});
	});
});
