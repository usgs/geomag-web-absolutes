<?php
	/**
	 * Prompts user for a configuration $option and returns the resulting input.
	 *
	 * @param $option {String}
	 *      The name of the option to configure.
	 * @param $default {String} Optional, default: <none>
	 *      The default value to use if no answer is given.
	 * @param $comment {String} Optional, default: $option
	 *      Help text used when prompting the user. Also used as a comment in
	 *      the configuration file.
	 * @param $secure {Boolean} Optional, default: false
	 *      True if user input should not be echo'd back to the screen as it
	 *      is entered. Useful for passwords.
	 * @param $unknown {Boolean} Optional, default: false
	 *      True if the configuration option is not a well-known option and
	 *      a warning should be printed.
	 *
	 * @return {String}
	 *      The configured value for the requested option.
	 */
	function configure ($option, $default=null, $comment='', $secure=false,
			$unknown=false) {
		// check if windows
		static $isWindows = null;
		if ($isWindows === null) {
			$isWindows = (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN');
		}

		if ($unknown) {
			// Warn user about an unknown configuration option being used.
			print "\nThis next option ($option) is an unknown configuration" .
					" option, which may mean it has been deprecated or removed.\n\n";
		}

		// Make sure we have good values for I/O.
		$help = ($comment !== null && $comment !== '') ? $comment : $option;

		// Prompt for and read the configuration option value
		printf("%s [%s]: ", $help, ($default === null ? '<none>' : $default));
		if ($secure && !$isWindows) {system('stty -echo');}
		$value = trim(fgets(STDIN));
		if ($secure && !$isWindows) {system('stty echo'); print "\n";}

		// Check the input
		if ($value === '' && $default !== null) {
			$value = $default;
		}

		// Always return the value
		return $value;
	}

	/**
	 * Checks if the given response seems to be in the affirmative.
	 *
	 * @param response {String}
	 *        The input response.
	 * @return True if the response seems to be affirmative. False otherwise.
	 */
	function responseIsAffirmative ($response) {
		return ($response === 'Y' || $response === 'y' || $response === 'yes' ||
				$response === 'Yes' || $response === 'YES');
	}

	// NB: These functions aren't very optimized but they get called only by
	//     an otherwise already very time-consuming process, so a few milliseconds
	//     won't matter here.

	function globDirs ($directory) {
		$dirs = glob($directory . DIRECTORY_SEPARATOR . '*',
				GLOB_ONLYDIR | GLOB_NOSORT);
		$alldirs = array($directory);

		foreach ($dirs as $dir) {
			$alldirs[] = $dir;
			$alldirs = array_merge($alldirs, globDirs($dir));
		}

		return array_unique($alldirs);
	}

	function recursiveGlob ($basedir, $pattern, $flags = 0) {
		$dirs = globDirs($basedir);
		$files = array();

		foreach ($dirs as $dir) {
			$files = array_merge($files,
					glob($dir . DIRECTORY_SEPARATOR . $pattern, $flags));
		}

		return array_unique($files);
	}

	function safefloatval($value=null) {
		if ($value === null) {
			return null;
		} else {
			return floatval($value);
		}
	}

	function safeintval($value=null) {
		if ($value === null) {
			return null;
		} else {
			return intval($value);
		}
	}

?>
