{
  "name": "project-name",
  "version": "1.0.0",
  "dependencies": {
    "@openai": "^1.0.0",
    "@metamask/delegation-toolkit": "^1.0.0",
    "winston": "^3.0.0",
    "ts-retry-promise": "^1.0.0"
  },
  "devDependencies": {
    "typescript": "^4.0.0",
    "jest": "^27.0.0",
    "ts-jest": "^27.0.0"
  }
}

const { grantPermissions, revokePermissions } = require('@metamask/delegation-toolkit');

test('grantPermissions should work correctly', async () => {
  const result = await grantPermissions(/* parameters */);
  expect(result).toBeDefined();
});

test('revokePermissions should work correctly', async () => {
  const result = await revokePermissions(/* parameters */);
  expect(result).toBeDefined();
});