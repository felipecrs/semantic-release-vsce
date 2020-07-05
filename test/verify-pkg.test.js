const test = require('ava');
const SemanticReleaseError = require('@semantic-release/error');
const verifyPkg = require('../lib/verify-pkg');

test('package is valid', t => {
  t.notThrows(() => verifyPkg({ name: 'test', publisher: 'tester' }));
});

test('package is missing name', t => {
  t.throws(() => verifyPkg({ publisher: 'tester' }), { instanceOf: SemanticReleaseError });
});

test('package is missing publisher', t => {
  t.throws(() => verifyPkg({ name: 'test' }), { instanceOf: SemanticReleaseError });
});
