"""Tests for the Monitor class."""

import argparse
from unittest.mock import Mock, patch

from watchdog.observers import Observer

from pyreload.monitor import Monitor


class TestMonitorEvents:
    def test_handle_event_directory_ignored(self):
        """Test that directory events are ignored"""
        args = argparse.Namespace(
            command="app.py",
            watch=["*.py"],
            ignore=[],
            debug=False,
            clean=True,
            exec=False,
            polling=False,
        )
        monitor = Monitor(args)

        # Create mock directory event
        event = Mock()
        event.is_directory = True
        event.src_path = "some_directory"

        # Should not restart
        with patch.object(monitor, "restart_process") as mock_restart:
            monitor._handle_event(event)
            mock_restart.assert_not_called()

    def test_handle_event_ignored_pattern(self):
        """Test that events matching ignore patterns are ignored"""
        args = argparse.Namespace(
            command="app.py",
            watch=["*.py"],
            ignore=["*__pycache__*", "*.log"],
            debug=False,
            clean=True,
            exec=False,
            polling=False,
        )
        monitor = Monitor(args)

        # Create mock file event with ignored path
        event = Mock()
        event.is_directory = False
        event.src_path = "src/__pycache__/test.pyc"

        # Should not restart
        with patch.object(monitor, "restart_process") as mock_restart:
            monitor._handle_event(event)
            mock_restart.assert_not_called()

    def test_handle_event_triggers_restart(self):
        """Test that valid file events trigger restart"""
        args = argparse.Namespace(
            command="app.py",
            watch=["*.py"],
            ignore=[],
            debug=False,
            clean=True,
            exec=False,
            polling=False,
        )
        monitor = Monitor(args)

        # Create mock file event
        event = Mock()
        event.is_directory = False
        event.src_path = "src/test.py"

        # Should restart
        with patch.object(monitor, "restart_process") as mock_restart:
            monitor._handle_event(event)
            mock_restart.assert_called_once()

    def test_handle_event_with_debug(self):
        """Test that debug mode logs file changes"""
        args = argparse.Namespace(
            command="app.py",
            watch=["*.py"],
            ignore=[],
            debug=True,
            clean=True,
            exec=False,
            polling=False,
        )
        monitor = Monitor(args)

        # Create mock file event
        event = Mock()
        event.is_directory = False
        event.src_path = "src/test.py"

        # Should log and restart
        with patch("pyreload.monitor.log") as mock_log, patch.object(
            monitor, "restart_process"
        ) as mock_restart:
            monitor._handle_event(event)
            mock_log.assert_called()
            mock_restart.assert_called_once()

    def test_handle_event_not_clean_mode(self):
        """Test that non-clean mode logs restart message"""
        args = argparse.Namespace(
            command="app.py",
            watch=["*.py"],
            ignore=[],
            debug=False,
            clean=False,  # Not clean mode
            exec=False,
            polling=False,
        )
        monitor = Monitor(args)

        # Create mock file event
        event = Mock()
        event.is_directory = False
        event.src_path = "src/test.py"

        # Should log restart message
        with patch("pyreload.monitor.log") as mock_log, patch.object(
            monitor, "restart_process"
        ) as mock_restart:
            monitor._handle_event(event)
            mock_log.assert_called()
            mock_restart.assert_called_once()

    def test_handle_event_debug_ignored_pattern(self):
        """Test that debug mode logs ignored patterns in event handler"""
        args = argparse.Namespace(
            command="app.py",
            watch=["*.py"],
            ignore=["*.log"],
            debug=True,
            clean=False,
            exec=False,
            polling=False,
        )
        monitor = Monitor(args)

        # Create mock file event with ignored path
        event = Mock()
        event.is_directory = False
        event.src_path = "debug.log"

        # Should log the ignore
        with patch("pyreload.monitor.log") as mock_log, patch.object(
            monitor, "restart_process"
        ) as mock_restart:
            monitor._handle_event(event)
            mock_log.assert_called()
            mock_restart.assert_not_called()

    @patch("pyreload.monitor.subprocess.Popen")
    def test_start_with_logging_and_ignore_patterns(self, mock_popen):
        """Test start method with logging and ignore patterns"""
        args = argparse.Namespace(
            command="app.py",
            watch=["*.py", "config/*.yaml"],
            ignore=["*.log", "*__pycache__*"],
            debug=False,
            clean=False,  # Logging enabled
            exec=False,
            polling=False,
        )
        monitor = Monitor(args)

        with patch("pyreload.monitor.log") as mock_log, patch.object(
            Observer, "start"
        ), patch.object(Observer, "schedule"):
            monitor.start()
            # Should log startup messages
            assert mock_log.call_count >= 3  # Multiple log calls
