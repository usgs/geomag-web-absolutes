<?php

	$CONFIG_FILE = '../conf/config.ini';

	if (!function_exists('configure')) {
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
		function configure ($option, $default='', $comment='', $secure=false,
				$unknown=false) {
			// check if windows
			static $isWindows = null;
			if ($isWindows === null) {
				$isWindows = (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN');
			}

			if ($unknown) {
				// Warn user about an unknown configuration option being used.
				print "\nThis next option ($option) is not a well-known " .
				      "configuration option and\nmay not get used. You may still " .
						"want to define a value for this option since you\nare a " .
						"human and theoretically smarter than this program. This " .
						"may have happened\nif an old option has been deprecated " .
						"or removed.\n\n";
			}

			// Make sure we have good values for I/O.
			if ($default == null) { $default = '<none>'; }
			$help = ($comment !== null && $comment != '') ? $comment : $option;

			// Prompt for and read the configuration option value
			printf("%s [%s]: ", $help, $default);
			if ($secure && !$isWindows) {system('stty -echo');}
			$value = trim(fgets(STDIN));
			if ($secure && !$isWindows) {system('stty echo'); print "\n";}

			// Check the input
			if ($value == '' && $default != '<none>') { $value = $default; }

			// Always return the value
			return $value;
		}
	}


	// Default action is to configure
	$configure_action = '3';

	// Check if previous configuration file exists
	if (file_exists($CONFIG_FILE)) { $configure_action = '0'; }

	while ($configure_action!=='1'&&$configure_action!=='2'&&$configure_action !== '3') {
		// File exists. Does user want to just go with previous configuration?
		print "Previous configuration file found. What would you like to do?\n";
		print "   [1] Use previous configuration.\n";
		print "   [2] Interactively re-configure using current configuration as defaults.\n";
		print "   [3] Interactively re-configure using default configuration as defaults.\n";
		print 'Enter the number corresponding to the action you would like to take: ';
		$configure_action = trim(fgets(STDIN));
		print "\n";
	}

	if ($configure_action === '1') {
		// Do not configure. File is in place and user wants to use it.
		print "Using previous configuration.\n";

		// pre-install depends on this variable
		$CONFIG = parse_ini_file($CONFIG_FILE);
	} else if ($configure_action === '2') {
		// Use current config as default and re-configure interactively.
		print "Using current config file as defaults, and interactively re-configuring.\n";
		$CONFIG = parse_ini_file($CONFIG_FILE);

		// Make sure all default parameters are in the new configuration.
		$CONFIG = array_merge($DEFAULTS, $CONFIG);

		// TODO :: Should this check be done in a loop where we notify the user
		// about each missing configuration parameter ???

		// TODO :: Should we do a reverse-check to make sure everything in the
		// config.ini file is also one of our defaults? This might be useful
		// during development if we accidently directly modify the config.ini
		// file to add a new parameter and it gets lost when we move into
		// production.
	} else if ($configure_action === '3') {
		// Use defaults and re-configure interactively.
		print "Reverting to default configuration and interactively re-configuring.\n";
		$CONFIG = $DEFAULTS;
	}

	if ($configure_action === '2' || $configure_action === '3') {
		// interactively configure options
		foreach ($CONFIG as $k=>$v) {
			$secure = (stripos($k, 'pass') !== false);
			$unknown = !isset($DEFAULTS[$k]);

			$CONFIG[$k] = configure(
				$k, // Name of option
				$v, // Default value
				(isset($HELP_TEXT[$k]))?$HELP_TEXT[$k]:null, // Help text
				$secure, // Should echo be turned off for inputs?
				$unknown // Is this a known/unkown option?
			);
		}

		// write config file
		$tmpfile = tempnam(sys_get_temp_dir(), 'config_ini');
		$file = fopen($tmpfile, 'w');
		foreach ($CONFIG as $key => $value) {
			$help = (isset($HELP_TEXT[$k]) ? ';'.$HELP_TEXT[$k] : '');
			fwrite($file, sprintf("%s\n%s = %s\n", $help, $key, $value));
		}
		fclose($file);

		// move into place
		rename($tmpfile, $CONFIG_FILE);
	}

?>
