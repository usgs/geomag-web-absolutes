Geomag Baseline Calculator
==========================

Enter Geomagnetic absolute measurements to calculate *baselines* to be applied
to raw magnetometer data.

Getting Started
---------------

This projects takes advantage of several tools including:

1. Node
1. Ruby
1. Bower
1. PHP (5.4)

### Windows ###

1. You will need a terminal tool for Windows. I used [Git Bash][] to test these steps, but [Cygwin][] should work fine too.
1. Fork into your github user account.
1. Clone from fork (update for your fork)
    ```
    git clone git@github.com:jmfee-usgs/geomag-baseline-calculator.git geomag-baseline-calculator
    cd geomag-baseline-calculator
    ```
1. Add upstream remote for primary
    ```
    git remote add upstream git@github.com:usgs/geomag-baseline-calculator.git
    ```
1. Install the newest release of [Node][] for Windows, using the executable.
1. Install the newest release of [Ruby][] for Windows, using the executable.
1. Install Bower from your terminal.
    ```
    npm install -g bower
    bower install
    ```
    1. If there are issues installing bower
        ```
        git config --global url."https://".insteadOf git://
        bower install
        ```
1. Install PHP 5.4 from your terminal.

[Git Bash]: http://git-scm.com/download/win
[Cygwin]: http://cygwin.com/install.html
[Node]: http://nodejs.org/download/
[Ruby]: http://rubyinstaller.org/

### Mac ###

1. Fork into your github user account
1. Clone from fork (update for your fork)
    ```
    git clone git@github.com:jmfee-usgs/geomag-baseline-calculator.git geomag-baseline-calculator
    cd geomag-baseline-calculator
    ```
1. Add upstream remote for primary
    ```
    git remote add upstream git@github.com:usgs/geomag-baseline-calculator.git
    ```
1. Install node/bower dependencies
    ```
    npm install
    bower install
    ```
    Homebrew
    --> node
       --> bower (global)
       --> grunt-cli (global)
    --> ruby
       --> sass
       --> compass
1. Enter development mode
    ``` grunt ```

Files:
	- All javascript classes are in the "src/htdocs/js/" directory.
	- All matching tests for javascript classes are in the "test/spec" directory.
