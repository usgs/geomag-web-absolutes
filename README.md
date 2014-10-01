geomag-baseline-calculator
==========================

Enter Geomagnetic absolute measurements to calculate *baselines* to be applied
to raw magnetometer data. Publish the calibration points for use in magnetic
data processing software.

Getting Started
---------------

1. [Use git to clone earthquake-eventpages from git repository](readme_git_install.md)

1. [Install needed dependencies and run them](readme_dependency_install.md)

1. Set up your environment and database

    `./src/lib/pre-install` (Unix) `php src/lib/pre-install.php` (Windows)

    If you're not sure what to do, pick

      `[3] Re-configure using default configuration as defaults.`

    Leave all options at their defaults except for

      `Would you like to set up the absolutes database at this time [N]`,

    to which you should answer `Y`.

1. Preview in a browser

    `grunt`

    On windows, `gateway` has trouble resolving default documents so you may
    need to change the opened url to

      `http://localhost:8080/index.php`

    To view the application go to

      `http://localhost:8080/observation.php`

### Having trouble getting started?

1. If this is your first time using **grunt**, you need to install the grunt
command line interface globally

    `npm install -g grunt-cli`

[Dependency install details for Windows and Mac](readme_dependency_install.md)
