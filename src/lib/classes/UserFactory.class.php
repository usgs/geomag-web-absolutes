<?php

/**
 * Authenticate and access user information.
 */
class UserFactory {

	private $queryUserById;
	private $queryUserByCredentials;

	public function __construct($pdo) {
		$this->pdo = $pdo;
		$this->queryUserById = $this->pdo->prepare(
				'SELECT * FROM user WHERE ID = :id');
		$this->queryUserByCredentials = $this->pdo->prepare(
				'SELECT * FROM user WHERE username = :username AND password = :password'
				);
		$this->queryUserByUsername = $this->pdo->prepare(
				'SELECT * FROM user WHERE username = :username');
		$this->queryUserByUsername = $this->pdo->prepare(
				'SELECT * FROM user WHERE username = :username');
		$this->queryAddUser = $this->pdo->prepare(
				'INSERT INTO user (username, password, default_observatory_id)' .
				'VALUES (:username, :password, :default_observatory_id)');
	}

	/**
	 * Get user information by id.
	 *
	 * @param $id {Integer}
	 *        the user id.
	 */
	public function getUser ($id) {
		$user = null;
		$this->queryUserById->bindValue(':id', intval($id), PDO::PARAM_INT);
		try {
			$this->queryUserById->execute();
			$user = $this->queryUserById->fetchAll(PDO::FETCH_ASSOC);
			$countUser = count($user);
			if ($countUser === 1) {
				$user = $user[0];
			} else {
				$user = null;
			}
		} catch (Exception $e) {
			$user = null;
		}
		return $user;
	}

	/**
	 * Get user information by username.
	 *
	 * @param $username {String}
	 */
	public function getUserFromUsername ($username) {
		$user = null;
		$this->queryUserByUsername->bindValue(':username',
				$username, PDO::PARAM_STR);
		try {
			$this->queryUserByUsername->execute();
			$user = $this->queryUserByUsername->fetchAll(PDO::FETCH_ASSOC);
			$countUser = count($user);
			if ($countUser === 1) {
				$user = $user[0];
			} else {
				$user = null;
			}
		} catch (Exception $e) {
			$user = null;
		}
		return $user;
	}

	/**
	 * Add user information.
	 *
	 * @param $username {String}
	 * @param $password {String}
	 *        Plain text password.
	 * @param $default_observatory_id {Integer} Default null
	 *        Id of an observatory object.
	 */
	public function addUser ($username, $password, $default_observatory_id=null) {
		$this->queryAddUser->bindValue(':username',
				$username, PDO::PARAM_STR);
		$this->queryAddUser->bindValue(':password',
				md5($password), PDO::PARAM_STR);
		$this->queryAddUser->bindValue(':default_observatory_id',
				$default_observatory_id, PDO::PARAM_INT);

		try {
			$this->queryAddUser->execute();
			return $this->getUserFromUsername($username);
		} catch (Exception $e) {
			return null;
		}
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
		$user = null;
		$this->queryUserByCredentials->bindValue(
				':username', $username, PDO::PARAM_STR);
		$this->queryUserByCredentials->bindValue(
				':password', md5($password), PDO::PARAM_STR);
		try {
			$this->queryUserByCredentials->execute();
			$user = $this->queryUserByCredentials->fetchAll(PDO::FETCH_ASSOC);
			$countUser = count($user);
			if ($countUser === 1) {
				$user = $user[0];
			} else {
				$user = null;
			}
		} catch (Exception $e) {
			$user = null;
		}
		return $user;
	}

	/**
	 * Get the current logged in user.
	 *
	 * @return array of user information, or null if no user logged in.
	 */
	public function getCurrentUser () {
		if (isset($_SESSION['userid'])) {
			$user = $this->getUser(intval($_SESSION['userid']));
			unset($user['password']);
			return $user;
		} else {
			return null;
		}
	}

}
