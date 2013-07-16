Readme dependencies

### Add an SSH Key to GitHub ###

  1. `ssh-keygen -t rsa -b 2048` (in terminal)
  2. Press **Enter** to accept the default save location.
  3. Enter a passphrase that you will remember.
  4. `cat ~/.ssh/id_rsa.pub`  
     Copy the text block that is displayed.
     This is your SSH key.  
     If you're on Window and can't copy the text from the terminal, go
     to `C:\Users\[your username here]\.ssh` and open the `id_rsa.pub` file
     with notepad.
  5. In GitHub, click **Edit Your Profile**.
  6. Select **SSH Keys** on the left.
  7. Click **Add SSH key**. Give it a meaningful title.
  8. Copy your SSH Key into the Key, and click **Add key**.

### Windows ###

1. You will need a terminal tool for Windows. I used [Git Bash][] to test these
   steps, but [Cygwin][] or another unix like editor should work fine too.
  1. Download [Git Bash][].
  2. Click **Next** on the welcome screen.
  3. Click **Next** to acknowledge the license.
  4. Click **Next** to keep the default directory.
  5. Click **Next** to Select Components.  
     You may add Quick Launch and Desktop icons here if you'd like.
  6. Click **Next** to confirm the Start Menu Folder.
  7. PATH environment. I recommend the __last option__ here to include Unix
     tools, but if you don't understand what that entails use the
     _second option_ which still adds Git to your system PATH then click **Next**.
  8. Line Ending Conversion. Keep the first option selected, click **Next**.
  9. Click **Finish** when the installation is complete.

1. Install the newest release of [Node][] for Windows, using the Windows
   Installer (.msi).
  1. Click **Next** on the welcome screen.
  1. Accept the License Agreement, then click **Next**.
  1. Click **Next** to keep the default directory.
  1. Click **Next** to intall the default features of Node.
  1. Click **Install** to begin the installation.
  1. Click **Finish** when the installation is complete.

1. Install the newest release of [Ruby][] for Windows, using the executable.
  1. Select your language of choice, then click **OK**.
  1. Accept the License Agreement, then click **Next**.
  1. Select the check box to Add Ruby to your PATH then click **Install**.
  1. Click **Finish** when the installation is complete.

1. Close and re-open your terminal so that your new PATH is loaded.  
   Make sure to navigate back to your `geomag-baseline-calculator` project directory.

[Git Bash]: http://git-scm.com/download/win
[Cygwin]: http://cygwin.com/install.html
[Node]: http://nodejs.org/download/
[Ruby]: http://rubyinstaller.org/

---
### Mac ###

1. Use homebrew to install node and git.
