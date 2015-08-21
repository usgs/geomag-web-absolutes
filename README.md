Geomag Baseline Calculator
==========================

Enter Geomagnetic absolute measurements to calculate *baselines* to be applied
to raw magnetometer data. Finalize and publish the calibration points for use
in magnetic data processing software.

[License](LICENSE.md)

## Getting Started ##

### [Install](readme_dependency_install.md) ###
First time install. Walk through dependencies and other considerations.

### Configure ###
Set up your environment and database, by running the pre-install script.

  Unix

        ./src/lib/pre-install
  Windows

        php src/lib/pre-install.php

   If you're not sure what to do, pick

        [3] Re-configure using default configuration as defaults

   Leave all options at their defaults except for

        Would you like to set up the absolutes database at this time [N]

   to which you should answer `Y`.

### Use ###

To preview in a browser, run `grunt` from the install directory.

---
### Having trouble getting started? ###

If this is your first time using **grunt**, you need to install the grunt
command line interface globally:

        npm install -g grunt-cli
