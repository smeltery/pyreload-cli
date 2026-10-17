import { entries } from './navigation';
const descriptions: Record<string, string> = {
  '': 'Meet Pyreload and find the right guide for your project.',
  api: 'Commands, configuration, and the restart lifecycle in one place.',
  'getting-started/installation':
    'Install Pyreload and get your environment ready.',
  'getting-started/quick-start':
    'Run your first watcher and see a change take effect.',
  'getting-started/basic-usage':
    'The everyday workflow: run, watch, and restart.',
  'user-guide/watch-patterns':
    'Choose the Python files, templates, and folders to watch.',
  'user-guide/ignore-patterns': 'Skip caches, logs, and generated files.',
  'user-guide/polling-mode':
    'Detect changes across mounted and remote filesystems.',
  'user-guide/config-files': 'Keep watch and ignore defaults in your project.',
  'user-guide/commands': 'Restart on demand and control the running watcher.',
  'advanced/exec-mode': 'Watch a module or shell command with exec mode.',
  'advanced/clean-mode': 'Run without interactive terminal input.',
  'advanced/troubleshooting':
    'Find the cause of missed changes and unexpected restarts.',
  'use-cases/docker': 'Use Pyreload inside Docker with mounted source files.',
  'use-cases/vagrant':
    'Keep the development loop running in a Vagrant machine.',
  'api/cli-reference': 'Command-line arguments, flags, and defaults.',
  'api/config-reference': 'Configuration keys, supported types, and defaults.',
  development: 'Set up Flox, run checks, and contribute to the project.',
  releasing: 'How tested changes become published releases.',
};
export const searchEntries = [
  {
    title: 'Brand & assets',
    description: 'Pyreload logos, colors, typography, and social artwork.',
    kind: 'Guide',
    url: '/brand/',
  },
  ...entries.map(([title, slug]) => ({
    title,
    description: descriptions[slug],
    kind: slug.startsWith('api') ? 'Reference' : 'Guide',
    url: `/docs/${slug ? `${slug}/` : ''}`,
  })),
];
const startingPoints = [
  '/brand/',
  '/docs/getting-started/installation/',
  '/docs/getting-started/quick-start/',
  '/docs/api/cli-reference/',
  '/docs/user-guide/polling-mode/',
  '/docs/use-cases/docker/',
];
export const suggestedEntries = startingPoints.map(
  (url) => searchEntries.find((entry) => entry.url === url)!,
);
