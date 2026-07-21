import path from 'node:path';

import { scanPublicContent } from './residue.mjs';

export class ConsumerShipError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = 'ConsumerShipError';
    this.details = details;
  }
}

const PLACEHOLDER_PATTERNS = Object.freeze([
  ['empty-link', /(?:href|action)=["']#["']/i],
  ['example-domain', /https?:\/\/(?:www\.)?example\.(?:com|org|net)/i],
  ['placeholder-copy', /\b(?:lorem ipsum|todo:|replace me|coming soon)\b/i],
]);

function sortStrings(values) {
  return [...values].sort((left, right) => (left < right ? -1 : left > right ? 1 : 0));
}

function normalizeFileMap(files) {
  if (files instanceof Map) return new Map(files);
  if (!files || typeof files !== 'object' || Array.isArray(files)) {
    throw new ConsumerShipError('Ship planning requires a file map or plain file object.');
  }
  return new Map(Object.entries(files));
}

function readJson(files, file) {
  const source = files.get(file);
  if (typeof source !== 'string') {
    throw new ConsumerShipError(`Required ship file is missing: ${file}.`, { file });
  }
  try {
    return JSON.parse(source);
  } catch (error) {
    throw new ConsumerShipError(`Invalid JSON in ${file}: ${error.message}`, { file });
  }
}

function canonicalBase(url) {
  return url.endsWith('/') ? url : `${url}/`;
}

function inspectImages(html) {
  const findings = [];
  for (const match of html.matchAll(/<img\b[^>]*>/gi)) {
    if (!/\balt=["'][^"']*["']/i.test(match[0])) findings.push('missing-image-alt');
  }
  return findings;
}

function inspectPlaceholders(files) {
  const findings = [];
  for (const [file, content] of files) {
    if (typeof content !== 'string' || !/\.(?:html?|md|json|xml|txt)$/i.test(file)) continue;
    for (const [rule, pattern] of PLACEHOLDER_PATTERNS) {
      if (pattern.test(content)) findings.push({ file, rule });
    }
    if (/\.html?$/i.test(file)) {
      for (const rule of inspectImages(content)) findings.push({ file, rule });
    }
  }
  return findings;
}

function deploymentFiles(config) {
  if (config.deployment === 'github-pages-actions') {
    return ['.github/workflows/pages.yml'];
  }
  if (config.deployment === 'github-pages-root') return ['.nojekyll'];
  return [];
}

function releaseFiles(config, manifest) {
  const base = canonicalBase(config.project.canonicalUrl);
  const host = new URL(base).hostname;
  const customDomain = !host.endsWith('.github.io') ? host : null;
  const files = new Map([
    [
      'sitemap.xml',
      `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${base}</loc></url>\n</urlset>\n`,
    ],
    ['robots.txt', `User-agent: *\nAllow: /\nSitemap: ${base}sitemap.xml\n`],
    [
      'structured-data.json',
      `${JSON.stringify(
        {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: config.project.name,
          description: config.project.description,
          url: base,
          author: { '@type': 'Person', name: config.project.author },
        },
        null,
        2,
      )}\n`,
    ],
    [
      'RELEASE_CHECKLIST.md',
      `# ${config.project.name} release checklist\n\n- [ ] Review production copy and links\n- [ ] Confirm desktop, mobile, keyboard, dark, and reduced-motion checks\n- [ ] Confirm canonical URL: ${base}\n- [ ] Confirm deployment mode: ${config.deployment}\n- [ ] Review framework CSS size: ${Buffer.byteLength(manifest.files?.['syntax.css'] ?? '', 'utf8')} bytes\n- [ ] Publish and verify the live URL\n`,
    ],
  ]);
  if (customDomain) files.set('CNAME', `${customDomain}\n`);
  return files;
}

export function createShipPlan({ config, files }) {
  const normalizedFiles = normalizeFileMap(files);
  const manifest = readJson(normalizedFiles, 'syntax.project.json');
  const webManifest = readJson(normalizedFiles, 'site.webmanifest');
  const blocking = [];

  if (!config?.project?.canonicalUrl) blocking.push({ file: 'syntax.project.json', rule: 'missing-canonical-url' });
  if (!config?.project?.name || !config?.project?.description || !config?.project?.author) {
    blocking.push({ file: 'syntax.project.json', rule: 'missing-project-metadata' });
  }

  blocking.push(...scanPublicContent(Object.fromEntries(normalizedFiles)));
  blocking.push(...inspectPlaceholders(normalizedFiles));

  if (config.project.canonicalUrl) {
    const base = canonicalBase(config.project.canonicalUrl);
    const index = normalizedFiles.get('index.html') ?? '';
    if (!index.includes(`href="${base}"`) && !index.includes(`href='${base}'`)) {
      blocking.push({ file: 'index.html', rule: 'canonical-mismatch' });
    }
  }
  if (webManifest.name !== config.project.name) {
    blocking.push({ file: 'site.webmanifest', rule: 'manifest-name-mismatch' });
  }
  if (manifest.mode === 'ship') {
    blocking.push({ file: 'syntax.project.json', rule: 'already-in-ship-mode' });
  }

  const proposedFiles = blocking.length === 0 ? releaseFiles(config, { ...manifest, files: Object.fromEntries(normalizedFiles) }) : new Map();
  return Object.freeze({
    blocking: Object.freeze(
      [...new Map(blocking.map((finding) => [`${finding.file}:${finding.rule}`, finding])).values()].sort(
        (left, right) => `${left.file}:${left.rule}`.localeCompare(`${right.file}:${right.rule}`),
      ),
    ),
    proposedFiles,
    deploymentFiles: Object.freeze(sortStrings(deploymentFiles(config))),
    removals: Object.freeze(['demo/', 'lab/'].filter((directory) => [...normalizedFiles.keys()].some((file) => file.startsWith(directory)))),
  });
}

export function formatShipPlan(plan) {
  const lines = [];
  if (plan.blocking.length > 0) {
    lines.push('Blocking findings:');
    for (const finding of plan.blocking) lines.push(`- ${finding.file}: ${finding.rule}`);
  } else {
    lines.push('Proposed release files:');
    for (const file of plan.proposedFiles.keys()) lines.push(`- ${file}`);
    if (plan.removals.length > 0) {
      lines.push('Prototype-only paths eligible for removal:');
      for (const file of plan.removals) lines.push(`- ${file}`);
    }
  }
  return lines.join('\n');
}
