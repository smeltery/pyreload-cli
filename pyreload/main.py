"""Main CLI entry point for pyreload."""

import argparse
import json
import time
from pathlib import Path

import colorama

from . import __version__
from .logger import Color, log
from .monitor import Monitor

CONFIG_FILES = [".pyreloadrc", "pyreload.json"]


def load_config():
    """Load configuration from .pyreloadrc or pyreload.json if present.

    Returns:
        Tuple of (config dict, config filename or None)
    """
    for config_name in CONFIG_FILES:
        config_path = Path(config_name)
        if config_path.exists():
            try:
                with open(config_path) as f:
                    config = json.load(f)
                return config, config_name
            except json.JSONDecodeError as e:
                log(Color.RED, f"Error parsing {config_name}: {e}")
                return {}, None
            except OSError as e:
                log(Color.RED, f"Error reading {config_name}: {e}")
                return {}, None
    return {}, None


def merge_config(args, config):
    """Merge config file settings with command line arguments.

    CLI arguments take precedence over config file settings.

    Args:
        args: Parsed command line arguments
        config: Config dict from file

    Returns:
        Merged arguments
    """
    if args.watch is None:
        args.watch = config.get("watch", ["*.py"])

    if not args.ignore:
        args.ignore = config.get("ignore", [])

    if not args.debug:
        args.debug = config.get("debug", False)

    if not args.clean:
        args.clean = config.get("clean", False)

    if not args.exec:
        args.exec = config.get("exec", False)

    if not args.polling:
        args.polling = config.get("polling", False)

    return args


def create_parser():
    """Create and configure the argument parser.

    Returns:
        Configured ArgumentParser instance
    """
    parser = argparse.ArgumentParser(
        prog="pyreload",
        description="Automatically restart Python applications when file changes are detected",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  pyreload app.py                          # Watch *.py files, restart app.py
  pyreload app.py -w "*.py" -w "*.yaml"    # Watch multiple patterns
  pyreload app.py -i "*__pycache__*"       # Ignore pattern
  pyreload app.py --polling                # Use polling for Docker/Vagrant
  pyreload -x "npm run dev"                # Execute shell command
  pyreload app.py --debug                  # Show file change events
  pyreload app.py --clean                  # Quiet mode

For more information, visit: https://github.com/smeltery/pyreload-cli
        """,
    )

    parser.add_argument(
        "-V",
        "--version",
        action="version",
        version=f"%(prog)s {__version__}",
        help="show the pyreload version and exit",
    )

    parser.add_argument(
        "command",
        type=str,
        help="the file to be executed or command to run with pyreload",
        metavar="command",
    )

    parser.add_argument(
        "-w",
        "--watch",
        type=str,
        help="paths/patterns to watch (e.g., 'src/*.py', 'config/*.yaml'). "
        "use once for each path/pattern. default is '*.py'",
        action="append",
        default=None,
        metavar="pattern",
    )

    parser.add_argument(
        "-i",
        "--ignore",
        type=str,
        help="patterns of files/paths to ignore. use once for each pattern",
        action="append",
        default=[],
        metavar="pattern",
    )

    parser.add_argument(
        "-p",
        "--polling",
        help="use polling-based file watching (useful for mounted filesystems like "
        "Docker, Vagrant, CIFS)",
        action="store_true",
        default=False,
    )

    parser.add_argument(
        "-d",
        "--debug",
        help="logs detected file changes to the terminal",
        action="store_true",
        default=False,
    )

    parser.add_argument(
        "-c",
        "--clean",
        help="runs pyreload in clean mode (no logs, no commands)",
        action="store_true",
        default=False,
    )

    parser.add_argument(
        "-x",
        "--exec",
        help="execute a shell command instead of running a Python file",
        action="store_true",
        default=False,
    )

    return parser


def main():
    """Main entry point for pyreload CLI."""
    colorama.init()

    parser = create_parser()
    arguments = parser.parse_args()

    # Load and merge config
    config, config_name = load_config()
    if config and not arguments.clean:
        log(Color.CYAN, f"Using config from {config_name}")
    arguments = merge_config(arguments, config)

    # Create and start monitor
    monitor = Monitor(arguments)
    monitor.start()

    # Main loop - handle user input
    try:
        while True:
            if not arguments.clean:
                try:
                    cmd = input()
                    if cmd == "rs":
                        monitor.restart_process()
                    elif cmd == "stop":
                        monitor.stop()
                        break
                except EOFError:
                    # Handle Ctrl+D gracefully
                    break
            else:
                time.sleep(1)
    except KeyboardInterrupt:
        monitor.stop()


if __name__ == "__main__":
    main()
