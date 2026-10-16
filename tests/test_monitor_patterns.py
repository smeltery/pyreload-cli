"""Tests for the Monitor class."""

import argparse
from unittest.mock import patch

from pyreload.monitor import Monitor


class TestMonitorPatterns:
    def test_parse_watch_path_simple_pattern(self):
        """Test parsing simple pattern like *.py"""
        args = argparse.Namespace(
            command="app.py",
            watch=["*.py"],
            ignore=[],
            debug=False,
            clean=False,
            exec=False,
            polling=False,
        )
        monitor = Monitor(args)
        directory, pattern = monitor._parse_watch_path("*.py")
        assert directory == "."
        assert pattern == "*.py"

    def test_parse_watch_path_with_directory(self):
        """Test parsing pattern with directory like src/*.py"""
        args = argparse.Namespace(
            command="app.py",
            watch=["src/*.py"],
            ignore=[],
            debug=False,
            clean=False,
            exec=False,
            polling=False,
        )
        monitor = Monitor(args)
        directory, pattern = monitor._parse_watch_path("src/*.py")
        assert directory == "src"
        assert pattern == "*.py"

    def test_parse_watch_path_nested_directory(self):
        """Test parsing pattern with nested directory"""
        args = argparse.Namespace(
            command="app.py",
            watch=["src/lib/*.py"],
            ignore=[],
            debug=False,
            clean=False,
            exec=False,
            polling=False,
        )
        monitor = Monitor(args)
        directory, pattern = monitor._parse_watch_path("src/lib/*.py")
        assert directory == "src/lib"
        assert pattern == "*.py"

    def test_parse_watch_path_recursive_pattern(self):
        """Test parsing recursive pattern like src/**/*.py"""
        args = argparse.Namespace(
            command="app.py",
            watch=["src/**/*.py"],
            ignore=[],
            debug=False,
            clean=False,
            exec=False,
            polling=False,
        )
        monitor = Monitor(args)
        directory, pattern = monitor._parse_watch_path("src/**/*.py")
        assert directory == "src"
        assert pattern == "**/*.py"

    def test_parse_watch_path_directory_only(self):
        """Test parsing directory without pattern"""
        args = argparse.Namespace(
            command="app.py",
            watch=["src"],
            ignore=[],
            debug=False,
            clean=False,
            exec=False,
            polling=False,
        )
        monitor = Monitor(args)
        directory, pattern = monitor._parse_watch_path("src")
        assert directory == "src"
        assert pattern == "*"

    def test_matches_pattern_basic(self):
        """Test basic pattern matching"""
        args = argparse.Namespace(
            command="app.py",
            watch=["*.py"],
            ignore=[],
            debug=False,
            clean=False,
            exec=False,
            polling=False,
        )
        monitor = Monitor(args)
        assert monitor._matches_pattern("test.py", "*.py") is True
        assert monitor._matches_pattern("test.js", "*.py") is False

    def test_matches_pattern_with_ignore(self):
        """Test pattern matching with ignore patterns"""
        args = argparse.Namespace(
            command="app.py",
            watch=["*.py"],
            ignore=["*__pycache__*", "*.log"],
            debug=False,
            clean=False,
            exec=False,
            polling=False,
        )
        monitor = Monitor(args)
        assert monitor._matches_pattern("src/__pycache__/test.pyc", "*.pyc") is False
        assert monitor._matches_pattern("debug.log", "*.log") is False
        assert monitor._matches_pattern("app.py", "*.py") is True

    def test_parse_watch_path_with_windows_separators(self):
        """Test parsing pattern with Windows path separators"""
        args = argparse.Namespace(
            command="app.py",
            watch=[r"src\*.py"],
            ignore=[],
            debug=False,
            clean=False,
            exec=False,
            polling=False,
        )
        monitor = Monitor(args)
        directory, pattern = monitor._parse_watch_path(r"src\*.py")
        assert directory == "src"
        assert pattern == "*.py"

    def test_parse_watch_path_starting_with_wildcard(self):
        """Test parsing pattern that starts with wildcard like */*.py"""
        args = argparse.Namespace(
            command="app.py",
            watch=["*/*.py"],
            ignore=[],
            debug=False,
            clean=False,
            exec=False,
            polling=False,
        )
        monitor = Monitor(args)
        directory, pattern = monitor._parse_watch_path("*/*.py")
        assert directory == "."
        assert pattern == "*/*.py"

    def test_matches_pattern_with_debug_ignore(self):
        """Test pattern matching with debug mode for ignored files"""
        args = argparse.Namespace(
            command="app.py",
            watch=["*.py"],
            ignore=["*__pycache__*"],
            debug=True,  # Debug mode
            clean=False,
            exec=False,
            polling=False,
        )
        monitor = Monitor(args)

        # Should log when ignoring
        with patch("pyreload.monitor.log") as mock_log:
            result = monitor._matches_pattern("src/__pycache__/test.pyc", "*.pyc")
            assert result is False
            mock_log.assert_called()
