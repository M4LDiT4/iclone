export default class UserData {
  username: string;
  password: string;
  contactNumber: string;
  email: string;
  onboardingDone: boolean;

  constructor({username, password, contactNumber, email, onboardingDone}: {
    username: string;
    password: string;
    contactNumber: string;
    email: string;
    onboardingDone?: boolean;
  }){
    this.username = username;
    this.password = password;
    this.contactNumber = contactNumber;
    this.email = email;
    this.onboardingDone = onboardingDone ?? false;
  }

  toFirebaseJson(){
    return {
      'username' : this.username,
      'password' : this.password,
      'contactNumber' : this.contactNumber,
      'email' : this.email,
      'onboardingDone': this.onboardingDone,
    }
  }
  static fromFirebaseJson(json: {
    username: string;
    password: string;
    contactNumber: string;
    email: string;
    onboardingDone?: boolean;
  }): UserData {
    return new UserData({
      username: json.username,
      password: json.password,
      contactNumber: json.contactNumber,
      email: json.email,
      onboardingDone: json.onboardingDone,
    });
  }
}