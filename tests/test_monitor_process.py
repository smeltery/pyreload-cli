"""Tests for the Monitor class."""

import argparse
from unittest.mock import Mock, patch

from watchdog.observers import Observer
from watchdog.observers.polling import PollingObserver

from pyreload.monitor import Monitor


class TestMonitorProcess:
    def test_initialization_default_observer(self):
        """Test that Monitor uses Observer by default"""
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

        with patch.object(Observer, "start"), patch.object(Observer, "schedule"):
            monitor.start()
            assert len(monitor.observers) > 0
            # Verify Observer was used (not PollingObserver)
            assert all(isinstance(obs, Observer) for obs in monitor.observers)

    def test_initialization_polling_observer(self):
        """Test that Monitor uses PollingObserver when polling=True"""
        args = argparse.Namespace(
            command="app.py",
            watch=["*.py"],
            ignore=[],
            debug=False,
            clean=True,
            exec=False,
            polling=True,
        )
        monitor = Monitor(args)

        with patch.object(PollingObserver, "start"), patch.object(PollingObserver, "schedule"):
            monitor.start()
            assert len(monitor.observers) > 0
            # Verify PollingObserver was used
            assert all(isinstance(obs, PollingObserver) for obs in monitor.observers)

    def test_watch_items_creation(self):
        """Test that watch items are properly created"""
        args = argparse.Namespace(
            command="app.py",
            watch=["*.py", "config/*.json"],
            ignore=[],
            debug=False,
            clean=False,
            exec=False,
            polling=False,
        )
        monitor = Monitor(args)
        assert len(monitor.watch_items) == 2
        assert (".", "*.py") in monitor.watch_items
        assert ("config", "*.json") in monitor.watch_items

    @patch("pyreload.monitor.subprocess.Popen")
    def test_start_process_python_file(self, mock_popen):
        """Test starting a Python file"""
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
        monitor.start_process()
        mock_popen.assert_called_once()

    @patch("pyreload.monitor.subprocess.Popen")
    def test_start_process_exec_mode(self, mock_popen):
        """Test starting a shell command in exec mode"""
        args = argparse.Namespace(
            command="npm run dev",
            watch=["*.js"],
            ignore=[],
            debug=False,
            clean=True,
            exec=True,
            polling=False,
        )
        monitor = Monitor(args)
        monitor.start_process()
        mock_popen.assert_called_once_with("npm run dev", shell=True)

    @patch("pyreload.monitor.subprocess.Popen")
    def test_restart_process(self, mock_popen):
        """Test process restart"""
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

        # Start initial process
        mock_process = Mock()
        mock_popen.return_value = mock_process
        monitor.start_process()

        # Restart
        monitor.restart_process()

        # Verify old process was terminated
        mock_process.terminate.assert_called_once()
        # Verify new process was started (Popen called twice)
        assert mock_popen.call_count == 2

    @patch("pyreload.monitor.subprocess.Popen")
    def test_stop_process(self, mock_popen):
        """Test stopping a process"""
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
        mock_process = Mock()
        mock_popen.return_value = mock_process
        monitor.start_process()

        # Stop process
        monitor.stop_process()

        # Verify terminate was called
        mock_process.terminate.assert_called_once()
        mock_process.wait.assert_called_once()

    @patch("pyreload.monitor.subprocess.Popen")
    def test_stop_process_timeout(self, mock_popen):
        """Test stopping a process that times out"""
        import subprocess

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
        mock_process = Mock()
        mock_process.wait.side_effect = [subprocess.TimeoutExpired("cmd", 5), None]
        mock_popen.return_value = mock_process
        monitor.start_process()

        # Stop process
        monitor.stop_process()

        # Verify terminate, then kill was called
        mock_process.terminate.assert_called_once()
        mock_process.kill.assert_called_once()
        assert mock_process.wait.call_count == 2

    def test_stop_monitor(self):
        """Test stopping the monitor"""
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

        # Mock observers
        mock_observer1 = Mock()
        mock_observer2 = Mock()
        monitor.observers = [mock_observer1, mock_observer2]

        # Mock process
        mock_process = Mock()
        monitor.process = mock_process

        # Stop
        monitor.stop()

        # Verify observers were stopped
        mock_observer1.stop.assert_called_once()
        mock_observer2.stop.assert_called_once()
        mock_observer1.join.assert_called_once()
        mock_observer2.join.assert_called_once()

        # Verify process was terminated
        mock_process.terminate.assert_called_once()
        # Process should be None after stop
        assert monitor.process is None

    @patch("pyreload.monitor.subprocess.Popen")
    def test_start_process_without_py_extension(self, mock_popen):
        """Test starting a Python file without .py extension"""
        args = argparse.Namespace(
            command="app",  # No .py extension
            watch=["*.py"],
            ignore=[],
            debug=False,
            clean=True,
            exec=False,
            polling=False,
        )
        monitor = Monitor(args)
        monitor.start_process()
        # Should add .py extension
        mock_popen.assert_called_once()
        call_args = mock_popen.call_args[0][0]
        assert call_args[-1] == "app.py"

    def test_stop_monitor_with_logging(self):
        """Test stopping the monitor with logging enabled"""
        args = argparse.Namespace(
            command="app.py",
            watch=["*.py"],
            ignore=[],
            debug=False,
            clean=False,  # Logging enabled
            exec=False,
            polling=False,
        )
        monitor = Monitor(args)

        # Mock observers
        mock_observer = Mock()
        monitor.observers = [mock_observer]

        # Mock process
        mock_process = Mock()
        monitor.process = mock_process

        # Stop with logging
        with patch("pyreload.monitor.log") as mock_log:
            monitor.stop()
            mock_log.assert_called()

    @patch("pyreload.monitor.subprocess.Popen")
    def test_start_polling_with_logging(self, mock_popen):
        """Test start method in polling mode with logging"""
        args = argparse.Namespace(
            command="app.py",
            watch=["*.py"],
            ignore=[],
            debug=False,
            clean=False,  # Logging enabled
            exec=False,
            polling=True,  # Polling mode
        )
        monitor = Monitor(args)

        with patch("pyreload.monitor.log") as mock_log, patch.object(
            PollingObserver, "start"
        ), patch.object(PollingObserver, "schedule"):
            monitor.start()
            # Should log startup messages including polling mode
            assert mock_log.call_count >= 2

    @patch("pyreload.monitor.subprocess.Popen")
    def test_start_process_exec_mode_with_logging(self, mock_popen):
        """Test starting a shell command in exec mode with logging"""
        args = argparse.Namespace(
            command="npm run dev",
            watch=["*.js"],
            ignore=[],
            debug=False,
            clean=False,  # Logging enabled
            exec=True,
            polling=False,
        )
        monitor = Monitor(args)

        with patch("pyreload.monitor.log") as mock_log:
            monitor.start_process()
            mock_log.assert_called()
            mock_popen.assert_called_once_with("npm run dev", shell=True)

    @patch("pyreload.monitor.subprocess.Popen")
    def test_start_process_python_with_logging(self, mock_popen):
        """Test starting a Python file with logging"""
        args = argparse.Namespace(
            command="app.py",
            watch=["*.py"],
            ignore=[],
            debug=False,
            clean=False,  # Logging enabled
            exec=False,
            polling=False,
        )
        monitor = Monitor(args)

        with patch("pyreload.monitor.log") as mock_log:
            monitor.start_process()
            mock_log.assert_called()
            mock_popen.assert_called_once()
