# Artist website

Users on this website are both artists and people who want to view art. (http://frozen-journey-67626.herokuapp.com/)

## Features:

### Homepage/Explore

This is available to any user, as well as available to anyone without an account who is visiting this website. This page is a list of the most recent posts that have been uploaded to the website. If you click on a post, you will go to that posts post page, where you can view it in detail, and see some of the comments that were commented by other users on that specific post.

### Search page

This will search for a specific query, enter text into the search bar and click the icon to start the search.

#### Note that all the following features require an account to be viewed, if a user without an account tries to visit these features, they will be prompted to Login. If they do not already have an account to login with, they can click on the "new user?" option to be redirected to a signup page.

### Dashboard

This will take you to see the latest posts from those you subscribe to.

### Profile

Clicking on the Account panel in the Header will take you to your own profile, and clicking on someone's name on the site will take you to see theirs. Depending on if they're a creator, they might have a Blog and Gallery section, which would contain an archive of their Image and Blog posts respectively. If you are on another users profile, if that user is a creator, you can click subscribe to subscribe to that creator and have their posts appear in your dashboard.

### Upload

This will let you submit your own content. It can either be an image post, or a blog post.

### Post pages

As mentioned earlier, clicking on any post will allow you to see the post in detail as well as the latest comments on that post.

### Admin/User seperation

Clicking on the Admin panel (if you are an Admin) will allow you to see a list of all (non-Admin) users on this website. It will include username, display name, id, and signup date of each user in question. At the bottom after all the users are listed, there will be a ban button. A ban button will delete this user from the server.

## API Spec

Passing the user and admin username/password combinations mentioned on the handout as basic authentication headers will give access to the appropriate APIs.

Routes marked with a **(\*)** are restricted to the affected user and administrators.
Routes marked with a **(\*\*)** are restricted to the affected user and moderators.

Routes without a specified response either return the object they are creating/manipulating as JSON or return nothing other than the response code to indicate success.

### User Routes

#### Create a user - `POST /api/users/create`

Example request body:

```
{

    "username": "test",
    "password": "abcdefg",
    "displayName": "Test",
    "links": ["https://facebook.com", "https://twitter.com"],
    "about": ["A really testy guy","","Who likes spaces acting as line breaks in his arrays"],
    "other": ["Not much about other me"]

}
```

#### (\*) Update a user - `POST /api/users/:username/update`

Example body:

```
{

    "displayName": "Testie2",
    "links": ["https://facebook2.com", "https://twitter2.com"],
    "about": ["A not very testy guy","","Who does not like spaces acting as line breaks in his arrays"],
    "other": ["A lot much about other me"]

}
```

#### (\*) Ban/Delete a user - `POST /api/users/:username/delete`

#### Retrieve a user's information - `GET /api/users/:username/get`

Example response:

```
{
    "user": {
		"_id": "5fd1aed1cd676263198b0679",
		"subscriptions": [],
		"username": "user",
		"password": "$2a$10$NKHFdjaKaNpo53i5YuDPGeGyH81EXMxfCjkVvakacly1Z0OrpIdSm",
		"displayName": "user",
		"flags": {
		"admin": true,
		"creator": true,
		"moderator": true
		},
		"createdAt": "2020-12-10T05:14:57.542Z",
		"__v": 0
	}
}
```

#### Retrieve a user's full profile with a list of their posts - `GET /api/users/:username/profile`

Example response:

```
{
    "user": {
        "_id": "5fd1aed1cd676263198b0679",
        "subscriptions": [],
        "username": "user",
        "password": "$2a$10$NKHFdjaKaNpo53i5YuDPGeGyH81EXMxfCjkVvakacly1Z0OrpIdSm",
        "displayName": "user",
        "flags": {
            "admin": true,
            "creator": true,
            "moderator": true
        },
        "following": true,
        "createdAt": "2020-12-10T05:14:57.542Z",
        "__v": 0,
        "profile": {
            "_id": "5fd1aed1cd676263198b067a",
            "about": [
                "just about me"
            ],
            "other": [
                "some other info"
            ],
            "links": [
                "https://google.com/"
            ],
            "followedBy": [],
            "user": "5fd1aed1cd676263198b0679",
            "__v": 0
        },
        "posts": [
            {
                "_id": "5fd47608f09761483d0f8716",
                "caption": [
                    "Just a caption"
                ],
                "content": [
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt."
                ],
                "likedBy": [],
                "type": "image",
                "imageUrl": "http://res.cloudinary.com/csc309-team10/image/upload/v1607759367/5fd1aed1cd676263198b0679/suf9od2adoxiyuvws526.jpg",
                "cloudId": "5fd1aed1cd676263198b0679/suf9od2adoxiyuvws526",
                "user": {
                    "_id": "5fd1aed1cd676263198b0679",
                    "subscriptions": [],
                    "username": "creator",
                    "password": "$2a$10$NKHFdjaKaNpo53i5YuDPGeGyH81EXMxfCjkVvakacly1Z0OrpIdSm",
                    "displayName": "creator123",
                    "flags": {
                        "admin": true,
                        "creator": true,
                        "moderator": true
                    },
                    "createdAt": "2020-12-10T05:14:57.542Z",
                    "__v": 0
                },
                "title": "Post title",
                "timestamp": "2020-12-12T07:49:28.596Z",
                "__v": 0,
                "numLikes": 0,
                "comments": []
            }
        ]
    }
}
```

#### Follow a user's posts which will then appear in your dashboard - `POST /api/users/:username/follow`

Example response:

```
{
	nowFollowing: true
}
```

#### (\*) Get all users currently in the database - `GET /api/users/all`

Example response:

```
[
    {
        "subscriptions": [],
        "_id": "5fd3bcb7f4a62d1e26fdbf92",
        "username": "test",
        "password": "$2a$10$dEtwH5Lz2GQGedQ3Zla9zeRv1WDL/ACxJr.SN5afZxaqrcl2ClM0.",
        "displayName": "Tes",
        "flags": {
            "admin": true,
            "creator": true,
            "moderator": false,
            "deleted": false
        },
        "createdAt": "2020-12-11T18:38:47.782Z",
        "__v": 0
    }
]
```

### Post Routes

#### Create a Blog post- `POST /api/posts/blog`

Example body:

```
{
	"title": "Test image",
	"content": ["this","part","contains","the blog post"]
}
```

#### Create a Blog post- `POST /api/posts/comment`

Example body:

```
{
	"title": "Test comment",
	"content": ["this","part","contains","the comment text"],
	"parentId": "", //id of comment I'm replying to, if any
	"postId": "5fd3e7c70c86c51a0f629274" //id of post I'm below
}
```

#### Create an Image post - `POST /api/posts/image` (`multipart/form-data` only)

Example body (along with an uploaded file):

```
{
	"title": "Test image",
	"caption": "A short description of the image",
	"content": ["A long","long","long","description of the content"]
}
```

#### Get any post - `GET /api/posts/:id/get`

#### (\*\*) Update any post - `PUT /api/posts/:id`

Example body:

```
{
	"title": "A better title",
	"content": ["A little", "better", "description/content of the post"]
}
```

#### (\*\*) Delete any post - `POST /api/posts/:id/delete`

#### (\*\*) Edit any post - `POST /api/posts/:id/delete`

#### Like/Unlike a post - `POST /api/posts/:id/like`

Example response:

```
{
	"liked": true
}
```

#### Get the 20 most recent posts from everyone - `GET /api/posts/all`

Example query:

```
?include=image,blog
```

#### Get the 20 most recent posts from your subscribed creators - `GET /api/posts/subscribed`

#### Get the replies to a post or comment - `GET /api/posts/:id/replies`
