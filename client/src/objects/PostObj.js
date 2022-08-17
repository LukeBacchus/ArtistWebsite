import { uid } from 'react-uid';

class PostObj {
  constructor(user, timestamp, content) {
    this.key = uid(this);
    this.user = user;
    this.timestamp = timestamp;
    this.likedBy = [];
    this.content = content;
  }
}

class ContentPostObj extends PostObj {
  constructor(user, timestamp, title, content) {
    super(user, timestamp, content);

    this.comments = [];
    this.title = title;
  }
}

export class BlogPostObj extends ContentPostObj {
  constructor(user, timestamp, title, content) {
    super(user, timestamp, title, content);
    this.type = 'blog';
  }
}

export class ImagePostObj extends ContentPostObj {
  constructor(user, timestamp, title, imageURL, caption, content) {
    super(user, timestamp, title, content);

    this.imageURL = imageURL;
    this.caption = caption;
    this.type = 'image';
  }
}

export class CommentObj extends PostObj {
  constructor(user, timestamp, content) {
    super(user, timestamp, content);
    this.type = 'comment';
  }
}
