import { uid } from 'react-uid';
import ViewerIcon from '../assets/sample-icon.png';

class User {
  constructor(displayName) {
    this.displayName = displayName;
    this.profileIcon = ViewerIcon;
    this.key = uid(this);
  }
}

export class Viewer extends User {
  constructor(displayName, grantedPerms) {
    super(displayName);
    this.permLevel = grantedPerms ? grantedPerms : 0;
  }
}

export class Creator extends User {
  constructor(displayName, grantedPerms) {
    super(displayName);
    this.imageposts = [];
    this.blogposts = [];
    this.profile = {};
    this.permLevel = grantedPerms ? grantedPerms : 1;
  }
}
