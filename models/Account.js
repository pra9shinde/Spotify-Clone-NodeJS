const db = require("../util/database");
const crypto = require("crypto");

class Account {
  constructor() {
    this.errorArray = {};
    this.registerFormData = {};
  }

  async register(un, fn, ln, em, pw1, pw2) {
    try {
      this.validateUsername(un);
      const userReturn = await this.userExists(un);
      if (userReturn[0].length !== 0) {
        this.errorArray.userNameExists =
          "Username already taken try something different";
        return false;
      }
      this.validateFirstName(fn);
      this.validateLastName(ln);
      this.validateEmail(em);
      this.validatePasswords(pw1, pw2);

      if (Object.keys(this.errorArray).length === 0) {
        // Insert into database
        const insertUser = await this.insertUserDetails(un, fn, ln, em, pw1);
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  }

  getError(errorKey) {
    let error;
    if (this.errorArray[errorKey] === undefined) {
      error = "";
    } else {
      error = this.errorArray[errorKey];
    }
    return `<span class="errorMessage">${error}</span>`;
  }

  validateUsername(userName) {
    if (userName.length > 25 || userName.length < 5) {
      this.errorArray.userName = "Username must be between 5 & 25 characters";
      return false;
    }
  }

  userExists(userName) {
    return db.execute("SELECT username from users WHERE username= ?", [
      userName,
    ]);
  }

  validateFirstName(firstName) {
    if (firstName.length > 25 || firstName.length < 2) {
      this.errorArray.firstName = "Firstname must be between 2 & 25 characters";
      return;
    }
  }

  validateLastName(lastName) {
    if (lastName.length > 25 || lastName.length < 2) {
      this.errorArray.lastName = "Lastname must be between 2 & 25 characters";
      return;
    }
  }

  validateEmail(email) {
    const pattern = /^[a-zA-Z0-9\-_]+(\.[a-zA-Z0-9\-_]+)*@[a-z0-9]+(\-[a-z0-9]+)*(\.[a-z0-9]+(\-[a-z0-9]+)*)*\.[a-z]{2,4}$/;

    if (!pattern.test(email)) {
      this.errorArray.email = "Enter correct email address";
      return;
    }
  }

  validatePasswords(pw1, pw2) {
    if (pw1 !== pw2) {
      this.errorArray.passMatch = "Your passwords don't match";
      return;
    }

    if (pw1.length > 30 || pw1.length < 5) {
      this.errorArray.passLength = "Password must be between 5 & 30 characters";
      return;
    }

    // // Check alphanumeric
    // const pattern = /^([a-zA-Z0-9 _-]+)$/;
    // if (!pw1.match(pattern)) {
    //     this.errorArray.passPattern = 'Password can only contain numbers and letters';
    //     return;
    // }
  }

  insertUserDetails(un, fn, ln, em, pw) {
    let mykey = crypto.createCipher("aes-128-cbc", "We1c0me@123");
    let encryptedPass = mykey.update(pw, "utf8", "hex");
    encryptedPass += mykey.final("hex");
    const profilePicture = "/img/head_emerald.png";
    const datetime = new Date().toISOString().slice(0, 19).replace("T", " ");

    return db.execute("INSERT INTO users VALUES(?, ?, ?, ?, ?, ?, ?, ?)", [
      "",
      un,
      fn,
      ln,
      em,
      encryptedPass,
      datetime,
      profilePicture,
    ]);

    /*
				// Decrypt
				let mykey2 = crypto.createDecipher('aes-128-cbc', 'We1c0me@123');
				let password = mykey2.update('ENCRYPTED_PASSWORD_HERE', 'hex', 'utf8')
				password += mykey2.final('utf8');
				console.log(password);
				*/
  }

  async login(username, pass) {
    try {
      const result = await db.execute("SELECT * from users WHERE username= ?", [
        username,
      ]);
      if (result[0].length !== 1) {
        this.errorArray.loginIssue = "User not found";

        return { status: "failed", message: "User not found" };
      }

      const resultArray = Object.values(JSON.parse(JSON.stringify(result[0])));
      // Decrypt
      let mykey2 = crypto.createDecipher("aes-128-cbc", "We1c0me@123");
      let password = mykey2.update(resultArray[0].password, "hex", "utf8");
      password += mykey2.final("utf8");

      if (password !== pass) {
        this.errorArray.loginIssue = "Incorrect Password";
        return { status: "failed", message: "Incorrect Password" };
      }

      this.errorArray.loginIssue = "";
      return {
        status: "success",
        message: "Login Successfull",
        userFullName: `${resultArray[0].firstname} ${resultArray[0].lastname}`,
      };
    } catch (e) {
      console.log(e);
      return { status: "failed", message: "DB Operation Failed" };
    }
  }

  static fetchAllUsers() {
    return db.execute("SELECT * from test");
  }

  static fetchById(id) {
    return db.execute("SELECT * from test WHERE id= ?", [id]);
  }

  static deleteByID(id) {}
}

module.exports = Account;
