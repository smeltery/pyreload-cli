import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { lint } from 'markdownlint/promise';

const tracked = execFileSync(
  'git',
  ['ls-files', '--cached', '--others', '--exclude-standard', '-z'],
  { encoding: 'utf8' },
).split('\0');
const files = [
  ...new Set(
    tracked.filter((path) => path.endsWith('.md') && existsSync(path)),
  ),
];
const config = JSON.parse(readFileSync('.markdownlint.json', 'utf8'));
const results = await lint({ files, config });
const errors = Object.entries(results)
  .flatMap(([file, issues]) =>
    issues.map(
      (issue) =>
        `${file}:${issue.lineNumber} ${issue.ruleNames[0]} ${issue.ruleDescription}${issue.errorDetail ? `: ${issue.errorDetail}` : ''}`,
    ),
  )
  .join('\n');
if (errors) {
  console.error(errors);
  process.exitCode = 1;
} else console.log(`Validated ${files.length} Markdown files`);
