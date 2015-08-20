Git clone

If you plan to contribute code to this project, follow all of the directions
below, other wise you can just use this command to get a copy of the project:

      git clone https://github.com/usgs/geomag-baseline-calculator.git

Then continue
[installing dependencies](readme_dependency_install.md#dependencies).

---
### Fork the project repository ###

1. Fork the project into your GitHub user account.
  1. Sign in to GitHub
  2. Go to `https://github.com/usgs/geomag-baseline-calculator`
  3. Click the **Fork** button near the top right of the page

2. Make sure you Add an SSH Key to GitHub for the computer you're
   working on into your GitHub account, see below for specifics.

3. Clone from fork (update for your fork).
   Navigate to the _HOME_ directory that you want to use for projects.
   Copy the __SSH__ URL located in the right-hand column near the bottom.
   Paste it in the terminal with `git clone`. It should look similar to this:

        git clone git@github.com:[your username]/geomag-baseline-calculator.git

   If you'd like to use a different project name than the default
   (geomag-baseline-calculator) locally, just specify it at the end of the
   command above.

4. Make sure you navigate in to the newly created project directory

        cd geomag-baseline-calculator

5. Add upstream remote for primary. This will allow you to pull down updates
   later.

        git remote add upstream git@github.com:usgs/geomag-baseline-calculator.git

   Check your remotes with `git remote -v`, it should look like this

        origin  git@github.com:[your username]/geomag-baseline-calculator.git (fetch)
        origin  git@github.com:[your username]/geomag-baseline-calculator.git (push)
        upstream        git@github.com:usgs/geomag-baseline-calculator.git (fetch)
        upstream        git@github.com:usgs/geomag-baseline-calculator.git (push)

### Add an SSH Key to GitHub ###

  1. `ssh-keygen -t rsa -b 2048` (in terminal)

  2. Press **Enter** to accept the default save location.

  3. Enter a passphrase that you will remember.

  4. `cat ~/.ssh/id_rsa.pub`
     Copy the text block that is displayed.
     This is your SSH key.
     - If you can't copy the text from the terminal and you're on Windows, go
     to `C:\Users\[your username]\.ssh` and open the `id_rsa.pub` file
     with notepad.

  5. In GitHub, click **Edit Your Profile**.

  6. Select **SSH Keys** on the left.

  7. Click **Add SSH key**. Give it a meaningful title.

  8. Copy your SSH Key into the Key, and click **Add key**.

When all of that is complete, don't for get to
[continue installing dependencies](readme_dependency_install.md#dependencies).
