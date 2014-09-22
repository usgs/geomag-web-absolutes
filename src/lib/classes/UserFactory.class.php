<?php

/**
 * Authenticate and access user information.
 */
class UserFactory {

	// TODO: make it use a DB.
	private $users = array(
		array(
			'id' => 1,
			'username' => 'admin',
			'password' => 'admin',
			'admin' => true
		),
		array(
			'id' => 2,
			'username' => 'user',
			'password' => 'user',
			'admin' => false
		)
	);

	public function __construct($pdo) {
		$this->pdo = $pdo;
	}

	/**
	 * Get user information by id.
	 *
	 * @param $id {Integer}
	 *        the user id.
	 */
	public function getUser ($id) {
		// TODO: make it use a DB.
		foreach ($this->users as $user) {
			if ($user['id'] === $id) {
				return $user;
			}
		}
		return null;
	}

	/**
	 * Log a user in.
	 *
	 * @param $username {String}
	 *        the username.
	 * @param $password {String}
	 *        the password.
	 */
	public function authenticate ($username, $password) {
		// TODO: make it use a DB.
		foreach ($this->users as $user) {
			if ($user['username'] === $username) {
				if ($user['password'] === $password) {
					return $user;
				} else {
					break;
				}
			}
		}
		return null;
	}

	/**
	 * Get the current logged in user.
	 *
	 * @return array of user information, or null if no user logged in.
	 */
	public function getCurrentUser () {
		if (isset($_SESSION['userid'])) {
			return $this->getUser(intval($_SESSION['userid']));
		} else {
			return null;
		}
	}

}
