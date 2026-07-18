import { readFile, rm, writeFile } from 'node:fs/promises';

const demoPath = new URL('../demo/index.html', import.meta.url);
let html = await readFile(demoPath, 'utf8');

const desktopGitHub = `            <li class="nav-item">
              <a class="nav-link" href="https://github.com/stokewell/syntax">GitHub</a>
            </li>`;
const desktopLab = `            <li class="nav-item">
              <a class="nav-link" href="../lab/">Component Lab</a>
            </li>
${desktopGitHub}`;

const mobileGitHub = `          <li class="mobile-nav-item">
            <a class="mobile-nav-link" href="https://github.com/stokewell/syntax">GitHub</a>
          </li>`;
const mobileLab = `          <li class="mobile-nav-item">
            <a class="mobile-nav-link" href="../lab/">Component Lab</a>
          </li>
${mobileGitHub}`;

if (!html.includes('href="../lab/"')) {
  if (!html.includes(desktopGitHub) || !html.includes(mobileGitHub)) {
    throw new Error('Unable to locate the canonical overview navigation markers.');
  }
  html = html.replace(desktopGitHub, desktopLab).replace(mobileGitHub, mobileLab);
}

const footerRepository = `          <a href="https://github.com/stokewell/syntax">Repository</a>`;
const footerLab = `          <a href="../lab/">Component Lab</a> ·
          <a href="https://github.com/stokewell/syntax">Repository</a>`;
if (!html.includes('<a href="../lab/">Component Lab</a> ·')) {
  if (!html.includes(footerRepository)) throw new Error('Unable to locate the overview footer marker.');
  html = html.replace(footerRepository, footerLab);
}

await writeFile(demoPath, html);
await rm(new URL('./apply-component-lab-links.mjs', import.meta.url));
await rm(new URL('../.github/workflows/component-lab-link.yml', import.meta.url));
