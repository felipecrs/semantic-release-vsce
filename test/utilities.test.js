import avaTest from 'ava';
import { stub } from 'sinon';

// Run tests serially to avoid env pollution
const test = avaTest.serial;

test('isVscePublishEnabled when empty', async (t) => {
  stub(process, 'env').value({
    VSCE_PAT: '',
  });

  const { isVscePublishEnabled } = await import('../lib/utilities.js');

  await t.false(isVscePublishEnabled());
});

test('isVscePublishEnabled when not set', async (t) => {
  stub(process, 'env').value({});

  const { isVscePublishEnabled } = await import('../lib/utilities.js');

  await t.false(isVscePublishEnabled());
});

test('isVscePublishEnabled when set', async (t) => {
  stub(process, 'env').value({
    VSCE_PAT: 'abc123',
  });

  const { isVscePublishEnabled } = await import('../lib/utilities.js');

  await t.true(isVscePublishEnabled());
});

test('isOvsxPublishEnabled when empty', async (t) => {
  stub(process, 'env').value({
    OVSX_PAT: '',
  });

  const { isOvsxPublishEnabled } = await import('../lib/utilities.js');

  await t.false(isOvsxPublishEnabled());
});

test('isOvsxPublishEnabled when not set', async (t) => {
  stub(process, 'env').value({});

  const { isOvsxPublishEnabled } = await import('../lib/utilities.js');

  await t.false(isOvsxPublishEnabled());
});

test('isOvsxPublishEnabled when set', async (t) => {
  stub(process, 'env').value({
    OVSX_PAT: 'abc123',
  });

  const { isOvsxPublishEnabled } = await import('../lib/utilities.js');

  await t.true(isOvsxPublishEnabled());
});
