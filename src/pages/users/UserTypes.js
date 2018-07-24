// @flow

export class User {
  id: string;
  name: string;
  email: string;
  roles: string[];
  updateDate: Date;
}


export class UserCreateUpdate {
  name: string;
  email: string;
  roles: string[];
}
