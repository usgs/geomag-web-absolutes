<?php

/**
 * Authenticate and access user information.
 */
class UserFactory {

	private $selectUserById;
	private $selectUserByCredentials;
	private $selectUserByUsername;
	private $selectUsers;

	private $insertUserSkeleton;
	private $insertUser;

	private $updateUser;
	private $deleteUser;

	public function __construct ($db) {
		$this->db = $db;
		$this->_initStatements();
	}

	/**
	 * initStatements
	 *
	 * Sets database prepare statements for transactions.
	 *
	 */
	private function _initStatements () {
		$this->selectUserById = $this->db->prepare(
				'SELECT * FROM user WHERE ID = :id');
		$this->selectUserByUsername = $this->db->prepare(
				'SELECT * FROM user WHERE username = :username');
		$this->selectUserByCredentials = $this->db->prepare(
				'SELECT * FROM user WHERE username = :username AND ' .
					'password = :password');
		$this->selectUsers = $this->db->prepare('SELECT * FROM user');

		$this->insertUserSkeleton = $this->db->prepare(
				'INSERT INTO user (username, password, default_observatory_id) ' .
					'VALUES (:username, :password, :default_observatory_id)');
		$this->insertUser = $this->db->prepare(
				'INSERT INTO user (' .
					'ID, name, username, default_observatory_id, email,' .
					'password, last_login, admin, enabled' .
				') VALUES (' .
					':id, :name, :username, :default_observatory_id, :email,' .
					':password, :last_login, :admin, :enabled' .
				')');

		$this->updateUser = $this->db->prepare(
				'UPDATE user set ' .
					'ID=:id, name=:name, username=:username,' .
					'default_observatory_id=:default_observatory_id, email=:email, ' .
					'password=:password, last_login=:last_login, admin=:admin, ' .
					'enabled=:enabled'
					);
		$this->deleteUser = $this->db->prepare(
			'DELETE FROM user WHERE ID=:id');
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

	/**
	 * Get user information by ID.
	 *
	 * @param $ID {Integer}
	 *        the user ID.
	 */
	public function getUser ($id) {
		$user = null;
		$this->selectUserById->bindValue(':id', intval($id), PDO::PARAM_INT);
		try {
			$this->selectUserById->execute();
			$user = $this->selectUserById->fetchAll(PDO::FETCH_ASSOC);
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
		$this->selectUserByUsername->bindValue(':username',
				$username, PDO::PARAM_STR);
		try {
			$this->selectUserByUsername->execute();
			$user = $this->selectUserByUsername->fetchAll(PDO::FETCH_ASSOC);
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
		$this->selectUserByCredentials->bindValue(
				':username', $username, PDO::PARAM_STR);
		$this->selectUserByCredentials->bindValue(
				':password', md5($password), PDO::PARAM_STR);
		try {
			$this->selectUserByCredentials->execute();
			$user = $this->selectUserByCredentials->fetchAll(PDO::FETCH_ASSOC);
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
	 * Get all users.
	 *
	 * @return array of user information, or null if no user logged in.
	 */
	public function getAllUsers () {
		$users = null;
		try {
			$this->selectUsers->execute();
			$users = $this->selectUsers->fetchAll(PDO::FETCH_ASSOC);
			$countUser = count($user);
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
	public function createUserSkeleton ($username, $password,
			$default_observatory_id=null) {

		$this->insertUserSkeleton->bindValue(':username',
				$username, PDO::PARAM_STR);
		$this->insertUserSkeleton->bindValue(':password',
				md5($password), PDO::PARAM_STR);
		$this->insertUserSkeleton->bindValue(':default_observatory_id',
				$default_observatory_id, PDO::PARAM_INT);

		try {
			$this->insertUserSkeleton->execute();
			return $this->getUserFromUsername($username);
		} catch (Exception $e) {
			return null;
		}
	}

	/**
	 * Get the current logged in user.
	 *
	 * @param $user {Array}
	 *        array of user information.
	 *
	 */
	public function createUser ($user) {
		$this->insertUser->bindValue(':id', intval($user['id']), PDO::PARAM_INT);
		$this->insertUser->bindValue(':name', $user['name'], PDO::PARAM_STR);
		$this->insertUser->bindValue(':username', $user['username'],
				PDO::PARAM_STR);
		$this->insertUser->bindValue(':default_observatory_id', $user['ID'],
				PDO::PARAM_STR);
		$this->insertUser->bindValue(':email', $user['email'], PDO::PARAM_STR);
		$this->insertUser->bindValue(':password', $user['password'],
				PDO::PARAM_STR);
		$this->insertUser->bindValue(':last_login', $user['last_login'],
				PDO::PARAM_STR);
		$this->insertUser->bindValue(':admin', $user['admin'], PDO::PARAM_STR);
		$this->insertUser->bindValue(':enabled', $user['enabled'], PDO::PARAM_STR);

		try {
			$this->insertUser->execute();
			$this->db->commit();
		} catch (Exception $e) {
			$this->db->rollback;
			$this->triggerError($e);
		}
	}

	/**
	 * Update User by id
	 *
	 * @param $user {Array}
	 *        array of user information.
	 *
	 * @return array of user information, or null if no user logged in.
	 */
	public function updateUser ($user) {
		$this->updateUser->bindValue(':id', intval($user['id']), PDO::PARAM_INT);
		$this->updateUser->bindValue(':username', $user['username'], PDO::PARAM_STR);
		$this->updateUser->bindValue(':default_observatory_id', $user['ID'], PDO::PARAM_STR);
		$this->updateUser->bindValue(':email', $user['email'], PDO::PARAM_STR);
		$this->updateUser->bindValue(':password', $user['password'], PDO::PARAM_STR);
		$this->updateUser->bindValue(':last_login', $user['last_login'], PDO::PARAM_STR);
		$this->updateUser->bindValue(':admin', $user['admin'], PDO::PARAM_STR);
		$this->updateUser->bindValue(':enabled', $user['enabled'], PDO::PARAM_STR);
		try {
			$this->updateUser->execute();
			$this->db->commit();
		} catch (Exception $e) {
			$this->db->rollback;
			$this->triggerError($e);
		}
	}

	/**
	 * Delete user by id.
		 * @param $id {String}
	 *        the username id.
	 */
	public function deleteUser ($id) {
		$this->deleteUser->bindValue(':id', intval($id), PDO::PARAM_INT);
	}

	protected function triggerError (&$statement) {
		$error = $statement->errorInfo();
		$statement->closeCursor();

		$errorMessage = (is_array($error)&&isset($error[2])&&isset($error[0])) ?
				'[' . $error[0] . '] :: ' . $error[2] : 'Unknown SQL Error';
		$errorCode = (is_array($error)&&isset($error[1])) ?
				$error[1] : -999;

		throw new Exception($errorMessage, $errorCode);
	}

}