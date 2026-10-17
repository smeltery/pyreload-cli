export const recipes = [
  {
    name: 'Python script',

    file: 'app.py',
    command: 'pyreload app.py',
    title: 'Your script. A shorter loop.',
    text: 'Start in your project directory. Pyreload watches Python files recursively and restarts your script when a matching file changes.',
    note: 'Python files are watched by default.',
    link: 'getting-started/quick-start',
    label: 'Script quick start',
  },
  {
    name: 'Python module',

    file: 'http.server',
    command: "pyreload -x 'python -m http.server 8000' -w '*.html'",
    title: 'Give a command its own loop.',
    text: 'Run a module through exec mode. This example serves your current directory and restarts the server when an HTML file changes.',
    note: 'Keep the entire command inside quotes.',
    link: 'advanced/exec-mode',
    label: 'Explore exec mode',
  },
  {
    name: 'Mounted folders',

    file: 'Docker / Vagrant',
    command: 'pyreload app.py --polling',
    title: 'Keep up with mounted files.',
    text: 'Run inside your development environment. Polling checks for changes when Docker, Vagrant, or a network mount does not forward file events.',
    note: 'Polling can use more CPU than native events.',
    link: 'user-guide/polling-mode',
    label: 'Understand polling',
  },
];
