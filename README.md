Geomag Baseline Calculator
==========================

Enter Geomagnetic absolute measurements to calculate *baselines* to be applied
to raw magnetometer data.

Getting Started
---------------

### Fork the project repository ###

1. Fork the project into your github user account.
  1. Sign in to GitHub.
  2. Go to `https://github.com/usgs/geomag-baseline-calculator`.
  2. Click the Fork button near the top right of the page.  

1. Make sure you [Add an SSH Key to GitHub](readme_dependency_install.md) for the
   computer you're working on into your GitHub account.

1. Clone from fork (update for your fork).  
   Navigate to the _HOME_ directory that you want to use for projects.
   Replace `[your username]` with your GitHub username.  
   ```git clone git@github.com:[your username]/geomag-baseline-calculator.git geomag-baseline-calculator```  
   ```cd geomag-baseline-calculator```

1. Add upstream remote for primary (use terminal)  
   ```  
   git remote add upstream git@github.com:usgs/geomag-baseline-calculator.git  
   ```  
   Check your remotes with `git remote -v`, it should look like this  
   ```origin  git@github.com:[your username]/geomag-baseline-calculator.git (fetch)```
   ```origin  git@github.com:[your username]/geomag-baseline-calculator.git (push)```
   ```upstream        git@github.com:usgs/geomag-baseline-calculator.git (fetch)```
   ```upstream        git@github.com:usgs/geomag-baseline-calculator.git (push)```

### Dependencies ###
You will need to have the following tools installed in order to run this project:

1. Node
1. Ruby
1. Bower
1. Sass
1. Compass
1. PHP
1. Grunt

[Dependency install details for Windows and Mac](readme_dependency_install.md)

### More Dependencies ###
1. Install some packages from your terminal
   ```git config --global url."https://".insteadOf git://```  
   Bower:  
   ```npm install -g bower```  
   ```bower install```  
   Sass (Syntactically Awesome Stylesheets):  
   ```gem install sass```  
   Compass:  
   ```gem install compass```  
   PHP:  
   ```npm install php```  
   Grunt:  
   ```npm install -g grunt-cli```  
   Package dependencies:  
   ```npm install```  

### Begin Developing ###
Enter development mode: `grunt`

---
Files:  
  - All javascript classes are in the "src/htdocs/js/" directory.  
  - All matching tests for javascript classes are in the "test/spec" directory.
