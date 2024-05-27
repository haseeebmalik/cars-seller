class User {
    constructor(id, name, email, password, verificationCode, codeExpireTime) {
      this.id = id;
      this.name = name;
      this.email = email;
      this.password = password;
      this.verificationCode = verificationCode;
      this.codeExpireTime = codeExpireTime;
    }
  }
  
  module.exports = User;
  