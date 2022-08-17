import samplePostImage from '../assets/sample-post.jpeg';
import { Viewer, Creator } from '../objects/User';
import { BlogPostObj, CommentObj, ImagePostObj } from '../objects/PostObj';

const SAMPLE_CREATORS = [new Creator('graphic_design_is_my_passion'), new Creator('raven_claw')];
const SAMPLE_VIEWERS = [new Viewer('steve-0'), new Viewer('steve-1'), new Viewer('alex-0')];

function randInd(array) {
  const index = Math.floor(Math.random() * array.length);
  return index < array.length ? index : array.length - 1;
}

function generateSamplePosts(creators, viewers) {
  const posts = [];
  for (let i = 0; i < 5; i++) {
    const post = new ImagePostObj(
      creators[i % 2],
      new Date().toUTCString(),
      `Post ${i}`,
      samplePostImage,
      `this is a caption for post ${i}`,
      [`Lorem ipsum dolor sit amet, consectetur adipiscing elit.`, `What a great post!`]
    );
    post.comments = [
      new CommentObj(viewers[randInd(viewers)], new Date().toUTCString(), [
        `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam et viverra eros.Curabitur ultrices ipsum est,
          tincidunt ultrices felis luctus at. Morbi aliquet augue eu urna commodo, nec semper ante sagittis.`,
        'Curabitur sit amet porta dui, vel rutrum tellus. Nullam rutrum ultrices rhoncus.',
        'Fusce eget ex fermentum, varius leo sed, rhoncus elit.'
      ]),
      new CommentObj(viewers[randInd(viewers)], new Date().toUTCString(), ['very cool!'])
    ];
    for (let j = 0; j < i; j++) {
      post.comments.push(
        new CommentObj(creators[j % 2], new Date().toUTCString(), [
          `Today, it is November ${i + j}, 2020 and I like this photo :)`
        ])
      );
    }
    for (let x = 0; x < randInd(viewers); x++) {
      post.likedBy.push(viewers[randInd(viewers)]);
    }
    posts.push(post);
  }
  return posts;
}

function generateSampleBlogs(creators, viewers) {
  const blogs = [];
  const randomcreator = Math.floor(Math.random() * 2);
  const index = randomcreator < SAMPLE_CREATORS.length ? randomcreator : 3;
  for (let i = 0; i < 6; i++) {
    let blogpost = {};
    if (i % 2) {
      blogpost = new BlogPostObj(creators[index], new Date().toUTCString(), `Blog Post Example A ${i}`, [
        `Proin faucibus ex non est fermentum luctus. Pellentesque varius at risus quis eleifend. Duis in tortor sem.
        Suspendisse eu mauris faucibus, consectetur purus a, semper lorem.`
      ]);
    } else {
      blogpost = new BlogPostObj(creators[index], new Date().toUTCString(), `Blost Post Example B ${i}`, [
        `Lorem ipsum dolor sit amet, consectetur adipiscing elit. In enim quam, ullamcorper id quam id, consectetur
        imperdiet nisi. Quisque molestie euismod nulla, ut pharetra velit maximus in. Integer maximus finibus nunc
        vel vestibulum. Donec luctus dignissim mollis.`,
        `Donec ultricies
        malesuada nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae.`
      ]);
    }
    blogpost.comments.push(
      new CommentObj(viewers[i % 3], new Date().toUTCString(), [
        `Today, it is November ${i}, 2020 and I like this photo :)`
      ])
    );
    blogpost.likedBy.push(i % 2 ? creators[index] : creators[Math.floor(index / 2)]);

    blogs.push(blogpost);
  }
  console.log('SAMPLE BLOG POSTS', blogs);

  return blogs;
}

export default {
  viewers: SAMPLE_VIEWERS,
  creators: SAMPLE_CREATORS,
  posts: generateSamplePosts(SAMPLE_CREATORS, SAMPLE_VIEWERS),
  blogs: generateSampleBlogs(SAMPLE_CREATORS, SAMPLE_VIEWERS)
};
