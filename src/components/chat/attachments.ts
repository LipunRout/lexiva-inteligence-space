export const MAX_FILES = 3;
export const MAX_FILE_CHARS = 100_000;
export const MAX_TOTAL_CHARS = 150_000;

// No "env" on purpose: .env files usually hold secrets.
const EXT = [
  'txt', 'md', 'markdown', 'csv', 'tsv', 'json', 'jsonl', 'xml', 'yml', 'yaml', 'toml', 'ini', 'log', 'sql',
  'html', 'css', 'scss', 'js', 'jsx', 'ts', 'tsx', 'mjs', 'py', 'java', 'kt', 'go', 'rs', 'c', 'h', 'cpp',
  'cs', 'php', 'rb', 'sh', 'bat', 'ps1', 'swift', 'vue', 'svelte',
];

export const ACCEPT = EXT.map((e) => '.' + e).join(',') + ',text/*';

export interface PickedFile {
  name: string;
  size: number;
  text: string;
}

function isTextFile(f: File) {
  const ext = f.name.split('.').pop()?.toLowerCase() ?? '';
  return EXT.includes(ext) || f.type.startsWith('text/');
}

export function formatSize(bytes: number) {
  return bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(bytes < 10240 ? 1 : 0)} KB`;
}

export async function readFiles(list: File[]) {
  const files: PickedFile[] = [];
  const errors: string[] = [];

  for (const f of list) {
    if (!isTextFile(f)) {
      errors.push(`${f.name}: only text and code files are supported for now.`);
      continue;
    }
    if (f.size > 500_000) {
      errors.push(`${f.name} is too large.`);
      continue;
    }
    const text = await f.text();
    if (text.includes('\u0000')) {
      errors.push(`${f.name} looks like a binary file.`);
      continue;
    }
    if (!text.trim()) {
      errors.push(`${f.name} is empty.`);
      continue;
    }
    if (text.length > MAX_FILE_CHARS) {
      errors.push(`${f.name} is too long (limit is about ${MAX_FILE_CHARS / 1000}k characters).`);
      continue;
    }
    files.push({ name: f.name, size: f.size, text });
  }
  return { files, errors };
}