import { memberType, memberTypes } from './members.js';
import { changePost, createPost, deletePost, post, posts } from './posts.js';
import {
  changeProfile,
  createProfile,
  deleteProfile,
  profile,
  profiles,
} from './profiles.js';
import {
  changeUser,
  createUser,
  deleteUser,
  subscribeTo,
  unsubscribeFrom,
  user,
  users,
} from './users.js';

export default {
  users,
  user,
  createUser,
  changeUser,
  deleteUser,
  subscribeTo,
  unsubscribeFrom,
  posts,
  post,
  createPost,
  changePost,
  deletePost,
  memberTypes,
  memberType,
  profiles,
  profile,
  createProfile,
  changeProfile,
  deleteProfile,
};
