import { normalizeUpstreamPayload } from '../normalize/normalizeUpstreamPayload';

const UPSTREAM_URLS = {
  dimensions:
    'https://raw.githubusercontent.com/serenakeyitan/sbti-wiki/main/data/dimensions.json',
  patterns:
    'https://raw.githubusercontent.com/serenakeyitan/sbti-wiki/main/data/patterns.json',
  bundledData:
    'https://raw.githubusercontent.com/bingran-you/sbti-cli/main/src/bundled-data.mjs'
};

async function fetchText(url: string): Promise<string> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }

  return response.text();
}

async function loadBundledSnapshotFromModule(sourceText: string) {
  const moduleUrl = `data:text/javascript;charset=utf-8,${encodeURIComponent(sourceText)}`;
  const imported = await import(moduleUrl);

  return imported.BUNDLED_SBTI_SNAPSHOT as {
    questions: Array<{ id: string; dim: string; text: string; options: Array<{ label: string; value: number }> }>;
    specialQuestions: Array<{ id: string; kind: string; text: string; options: Array<{ label: string; value: number }> }>;
    TYPE_LIBRARY: Record<string, { code: string; cn: string; intro: string; desc: string }>;
  };
}

export async function fetchUpstreamSnapshot() {
  const [dimensionsText, patternsText, bundledDataText] = await Promise.all([
    fetchText(UPSTREAM_URLS.dimensions),
    fetchText(UPSTREAM_URLS.patterns),
    fetchText(UPSTREAM_URLS.bundledData)
  ]);

  const dimensions = JSON.parse(dimensionsText);
  const patterns = JSON.parse(patternsText);
  const bundledSnapshot = await loadBundledSnapshotFromModule(bundledDataText);

  return normalizeUpstreamPayload({
    version: new Date().toISOString().slice(0, 10),
    questions: bundledSnapshot.questions,
    specialQuestions: bundledSnapshot.specialQuestions,
    typeLibrary: bundledSnapshot.TYPE_LIBRARY,
    normalTypes: patterns.normal_types,
    specialTypes: patterns.special_types,
    dimensions
  });
}
