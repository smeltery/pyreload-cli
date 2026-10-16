export const groups = [
  {
    title: 'Getting started',
    links: [
      ['Installation', 'getting-started/installation'],
      ['Quick start', 'getting-started/quick-start'],
      ['Basic usage', 'getting-started/basic-usage'],
    ],
  },
  {
    title: 'User guide',
    links: [
      ['Watch patterns', 'user-guide/watch-patterns'],
      ['Ignore patterns', 'user-guide/ignore-patterns'],
      ['Polling mode', 'user-guide/polling-mode'],
      ['Configuration files', 'user-guide/config-files'],
      ['Interactive commands', 'user-guide/commands'],
    ],
  },
  {
    title: 'Advanced',
    links: [
      ['Exec mode', 'advanced/exec-mode'],
      ['Clean mode', 'advanced/clean-mode'],
      ['Troubleshooting', 'advanced/troubleshooting'],
    ],
  },
  {
    title: 'Examples',
    links: [
      ['Docker', 'use-cases/docker'],
      ['Vagrant', 'use-cases/vagrant'],
    ],
  },
  {
    title: 'Reference',
    links: [
      ['CLI reference', 'api/cli-reference'],
      ['Configuration reference', 'api/config-reference'],
    ],
  },
  {
    title: 'Project',
    links: [
      ['Development', 'development'],
      ['Releases', 'releasing'],
    ],
  },
];
export const entries = [
  ['Overview', ''],
  ['Reference overview', 'api'],
  ...groups.flatMap((group) => group.links),
];
