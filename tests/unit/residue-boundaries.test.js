import { describe, expect, it } from 'vitest';

import { scanPublicContent } from '../../consumer/lib/residue.mjs';

describe('template residue URL boundaries', () => {
  it('does not flag repositories whose names merely begin with syntax', () => {
    expect(
      scanPublicContent({
        'index.html': '<link rel="canonical" href="https://stokewell.github.io/syntax-test/">',
        'package.json': '{"repository":"https://github.com/stokewell/syntax-test"}',
      }),
    ).toEqual([]);
  });

  it('still detects the original Syntax project URLs', () => {
    expect(
      scanPublicContent({
        'index.html': '<link rel="canonical" href="https://stokewell.github.io/syntax/">',
        'package.json': '{"repository":"https://github.com/stokewell/syntax"}',
      }),
    ).toEqual(
      expect.arrayContaining([
        { file: 'index.html', rule: 'template-pages-url' },
        { file: 'package.json', rule: 'template-repository-url' },
      ]),
    );
  });
});
