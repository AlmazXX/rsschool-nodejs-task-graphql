import { memberType, memberTypes } from './members.js';
import { createPost, deletePost, post, posts, updatePost } from './posts.js';
import {
  createProfile,
  deleteProfile,
  profile,
  profiles,
  updateProfile,
} from './profiles.js';
import { subscribeToUser, subscriptions, unsubscribeFromUser } from './subscriptions.js';
import { createUser, deleteUser, updateUser, user, users } from './users.js';

export default {
  users,
  user,
  createUser,
  updateUser,
  deleteUser,
  subscribeToUser,
  unsubscribeFromUser,
  posts,
  post,
  createPost,
  updatePost,
  deletePost,
  memberTypes,
  memberType,
  profiles,
  profile,
  createProfile,
  updateProfile,
  deleteProfile,
  subscriptions,
};
