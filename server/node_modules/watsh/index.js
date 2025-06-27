var child_process = require('child_process');
var fs = require('fs');

function watsh(command, filenames) {
  var watch_options = {
    persistent: true,
    recursive: true,
  };

  var command_options = {
    // cwd: process.cwd(),
    // shell: '/bin/bash',
    maxBuffer: 1024*1024, // 1MB instead of the default of 200KB
  };

  /**
  filename may not actually be supplied
  */
  function change(event, filename) {
    console.error('%s:%s', filename, event);
    child_process.exec(command, command_options, function(error, stdout, stderr) {
      if (error) {
        console.error('child_process.exec produced error: %s', error.message);
      }
      stdout = stdout.trim();
      stderr = stderr.trim();
      if (stdout) {
        console.log('stdout: %s', stdout);
      }
      if (stderr) {
        console.error('stderr: %s', stderr);
      }
    });
  }
  function error(error) {
    console.error('FSWatcher emitted error: %s', error.message);
  }

  filenames.forEach(function(filename) {
    fs.watch(filename, watch_options, change).on('error', error);
  });
}
module.exports = watsh;
