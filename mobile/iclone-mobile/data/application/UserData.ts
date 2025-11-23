export default class UserData {
  username: string;
  password: string;
  contactNumber: string;
  email: string;

  constructor({username, password, contactNumber, email}: {
    username: string;
    password: string;
    contactNumber: string;
    email: string;
  }){
    this.username = username;
    this.password = password;
    this.contactNumber = contactNumber;
    this.email = email;
  }

  toFirebaseJson(){
    return {
      'username' : this.username,
      'password' : this.password,
      'contactNumber' : this.contactNumber,
      'email' : this.email
    }
  }
}