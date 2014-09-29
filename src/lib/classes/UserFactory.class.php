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

	private $updateUserWithPassword;
	private $updateUserWithoutPassword;

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
		$userFields =
				'ID as id, ' .
					'name, ' .
					'username, ' .
					'default_observatory_id, ' .
					'email, ' .
					'last_login, ' .
					'admin, ' .
					'enabled ';
		$this->selectUserById = $this->db->prepare(
				'SELECT ' .
					$userFields .
				'FROM user WHERE ID = :id');
		$this->selectUserByUsername = $this->db->prepare(
				'SELECT ' .
					$userFields .
				'FROM user WHERE username = :username');
		$this->selectUserByCredentials = $this->db->prepare(
				'SELECT ' .
					$userFields .
				'FROM user WHERE username = :username AND password = :password');
		$this->selectUsers = $this->db->prepare(
				'SELECT ' .
					$userFields .
				'FROM ' .
					'user ' .
				'ORDER BY ' .
					'name'
			);

		$this->insertUserSkeleton = $this->db->prepare(
				'INSERT INTO user (username, password, default_observatory_id) ' .
					'VALUES (:username, :password, :default_observatory_id)');
		$this->insertUser = $this->db->prepare(
				'INSERT INTO user (' .
					'name, username, default_observatory_id, email,' .
					'password, last_login, admin, enabled' .
				') VALUES (' .
					':name, :username, :default_observatory_id, :email,' .
					':password, :last_login, :admin, :enabled' .
				')');

		$this->updateUserWithPassword = $this->db->prepare(
				'UPDATE user set ' .
					'name=:name, username=:username,' .
					'default_observatory_id=:default_observatory_id, email=:email, ' .
					'password=:password, last_login=:last_login, admin=:admin, ' .
					'enabled=:enabled WHERE ID = :id'
				);
		$this->updateUserWithoutPassword = $this->db->prepare(
				'UPDATE user set ' .
					'name=:name, username=:username,' .
					'default_observatory_id=:default_observatory_id, email=:email, ' .
					'last_login=:last_login, admin=:admin, ' .
					'enabled=:enabled WHERE ID = :id'
				);
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

				// Update last login time for this user
				$user['last_login'] = time();
				$user = $this->updateUser($user);
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
		} catch (Exception $e) {
			$users = null;
		}
		return $users;
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
		$this->db->beginTransaction();

		$this->insertUser->bindValue(':name', $user['name'], PDO::PARAM_STR);
		$this->insertUser->bindValue(':username', $user['username'],
				PDO::PARAM_STR);
		$this->insertUser->bindValue(':default_observatory_id',
				$user['default_observatory_id'], PDO::PARAM_STR);
		$this->insertUser->bindValue(':email', $user['email'], PDO::PARAM_STR);
		$this->insertUser->bindValue(':password', $user['password'],
				PDO::PARAM_STR);
		$this->insertUser->bindValue(':last_login', $user['last_login'],
				PDO::PARAM_INT);
		$this->insertUser->bindValue(':admin', $user['admin'], PDO::PARAM_STR);
		$this->insertUser->bindValue(':enabled', $user['enabled'], PDO::PARAM_STR);

		try {
			$this->insertUser->execute();
			$this->db->commit();
			$user_id = intval($this->db->lastInsertId());
			return $this->getUser($user_id);
		} catch (Exception $e) {
			$this->db->rollback();
			$this->triggerError($this->insertUser, $e);
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
		if (isset($user['password'])) {
			return $this->_updateUserWithPassword($user);
		} else {
			return $this->_updateUserWithoutPassword($user);
		}
	}

	protected function _updateUserWithPassword ($user) {
		$this->db->beginTransaction();

		$this->updateUserWithPassword->bindValue(':id', intval($user['id']),
				PDO::PARAM_INT);
		$this->updateUserWithPassword->bindValue(':name', $user['name'],
				PDO::PARAM_STR);
		$this->updateUserWithPassword->bindValue(':username', $user['username'],
				PDO::PARAM_STR);
		$this->updateUserWithPassword->bindValue(':default_observatory_id',
				$user['default_observatory_id'], PDO::PARAM_STR);
		$this->updateUserWithPassword->bindValue(':email', $user['email'],
				PDO::PARAM_STR);
		$this->updateUserWithPassword->bindValue(':password', $user['password'],
				PDO::PARAM_STR);
		$this->updateUserWithPassword->bindValue(':last_login',
				intval($user['last_login']), PDO::PARAM_INT);
		$this->updateUserWithPassword->bindValue(':admin', $user['admin'],
				PDO::PARAM_STR);
		$this->updateUserWithPassword->bindValue(':enabled', $user['enabled'],
				PDO::PARAM_STR);

		try {
			$this->updateUserWithPassword->execute();
			$this->db->commit();
			return $this->getUser($user['id']);
		} catch (Exception $e) {
			$this->db->rollback();
			$this->triggerError($this->updateUserWithPassword, $e);
		}
	}

	protected function _updateUserWithoutPassword ($user) {
		$this->db->beginTransaction();

		$this->updateUserWithoutPassword->bindValue(':id', intval($user['id']),
				PDO::PARAM_INT);
		$this->updateUserWithoutPassword->bindValue(':name', $user['name'],
				PDO::PARAM_STR);
		$this->updateUserWithoutPassword->bindValue(':username', $user['username'],
				PDO::PARAM_STR);
		$this->updateUserWithoutPassword->bindValue(':default_observatory_id',
				$user['default_observatory_id'], PDO::PARAM_STR);
		$this->updateUserWithoutPassword->bindValue(':email', $user['email'],
				PDO::PARAM_STR);
		$this->updateUserWithoutPassword->bindValue(':last_login',
				intval($user['last_login']), PDO::PARAM_INT);
		$this->updateUserWithoutPassword->bindValue(':admin', $user['admin'],
				PDO::PARAM_STR);
		$this->updateUserWithoutPassword->bindValue(':enabled', $user['enabled'],
				PDO::PARAM_STR);

		try {
			$this->updateUserWithoutPassword->execute();
			$this->db->commit();
			return $this->getUser($user['id']);
		} catch (Exception $e) {
			$this->db->rollback();
			$this->triggerError($this->updateUserWithoutPassword, $e);
		}
	}

	protected function triggerError (&$statement, $e) {
		$error = $statement->errorInfo();
		$statement->closeCursor();

		if (is_array($error) && isset($error[2]) && isset($error[0])) {
			$errorMessage = '[' . $error[0] . '] :: ' . $error[2];
			$errorCode = (isset($error[1])) ?
					$error[1] : -999;
		} else {
			$errorMessage = $e->getMessage();
			$errorCode = -4242;
		}

		throw new Exception($errorMessage, $errorCode);
	}

}
