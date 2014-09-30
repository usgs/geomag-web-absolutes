<?php

include_once 'DatabaseInstaller.class.php';


/**
 * Sqlite implementation of DatabaseInstaller.
 *
 * Currently only supports file backed sqlite PDO urls.
 */
class SqliteDatabaseInstaller extends DatabaseInstaller {

	// file referred to by $url.
	private $dbfile;

	/**
	 * Called by DatabaseInstaller::getInstaller().
	 */
	protected function __construct ($url, $user, $pass) {
		parent::__construct($url, $user, $pass);
		preg_match('/:([^;]+)/', $url, $matches);
		if (count($matches) < 2) {
			throw new Exception('sqlite database must specify filename');
		}
		$this->dbfile = $matches[1];
	}

	/**
	 * Check if database exists.
	 *
	 * @return {Boolean} true if sqlite file exists, false otherwise.
	 */
	public function databaseExists () {
		return file_exists($this->dbfile);
	}

	/**
	 * Drop the database referred to by $url.
	 * Deletes the sqlite database file.
	 */
	public function dropDatabase () {
		if (file_exists($this->dbfile)) {
			unlink($this->dbfile);
		}
	}

	/**
	 * Create the database referred to by $url.
	 * Does nothing, file is created when statements are executed after connect.
	 */
	public function createDatabase () {
		// nothing to do
	}

	/**
	 * Create database user.
	 */
	public function createUser ($roles, $user, $password) {
		// nothing to do
	}

}
