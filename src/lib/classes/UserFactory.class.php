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
