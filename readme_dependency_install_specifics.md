Readme install dependency details

---
### Mac ###

1. install xcode

        https://developer.apple.com/xcode/

2. install homebrew

        http://mxcl.github.io/homebrew/

3. Use homebrew to install `node`, `git`, `ruby` and `php`

        brew install node
        brew install git
        brew install ruby
        brew install php

4. Update paths as needed in your `~/.bash_profile`:
   (If you use a tool other than brew to install these dependencies, you may
   need to modify these paths to point to the install directories.)

        # brew installed binaries
        export PATH=$PATH:/usr/local/bin
        # npm installed binaries
        export PATH=$PATH:/usr/local/share/npm/bin
        # gem installed binaries
        export PATH=$PATH:/usr/local/opt/ruby/bin

5. Close and re-open your terminal so that your new PATH is loaded.
   Make sure to navigate back to your `geomag-baseline-calculator` project
   directory.

Then continue by
[installing secondary dependencies](readme_dependency_install.md#secondary-dependencies).

---
### Windows ###

1. You will need a terminal tool for Windows.
   [Git Bash (http://git-scm.com/download/win)](http://git-scm.com/download/win)
   was used to test these steps, but
   [Cygwin (http://cygwin.com/install.html)](http://cygwin.com/install.html)
   or another unix-like editor should work too.

   - Choosing PATH environment: We recommend the __last option__ here to include
     Unix tools, but if you don't understand what that entails then use the
     _second option_ which still adds Git to your system PATH.
   - Besides that, all of the defaults should be sufficient.

2. Install the latest release of
   [Node (http://nodejs.org/download/)](http://nodejs.org/download/) for
   Windows, using the Windows Installer (.msi).

   - All of the defaults should be sufficient for this.

3. Install the latest release of
   [Ruby (http://rubyinstaller.org/)](http://rubyinstaller.org/) for Windows,
   using the executable.

   - All of the defaults should be sufficient for this.

4. Install PHP, from zip.
   1. Download the appropriate zip file from http://windows.php.net/download/
   2. Unzip the folder and copy the contents into a new folder on your `C:\`
     drive.
        C:\php54
   3. Add PHP to your **PATH** (add `C:\php54;` to your "PATH" environment
     variable).

5. If you are having trouble with PHP, you can try to install it with node.

        npm install -g php

6. Close and re-open your terminal so that your new PATH is loaded.
   Make sure to navigate back to your `geomag-baseline-calculator` project
   directory.

        git config --global url."https://".insteadOf git://

Then continue by
[installing secondary dependencies](readme_dependency_install.md#secondary-dependencies).
