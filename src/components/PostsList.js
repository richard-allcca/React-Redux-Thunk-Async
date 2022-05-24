import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts, getPostsError, getPostsStatus, selectAllPosts } from '../redux/slices/posts/postSlice';
import PostsExcerpt from './PostsExcerpt';

const PostsList = () => {
  const dispatch = useDispatch();

  const posts = useSelector(selectAllPosts);
  const postsStatus = useSelector(getPostsStatus);
  const error = useSelector(getPostsError);

  useEffect(
    () => {
      if (postsStatus === 'idle') {
        dispatch(fetchPosts());
      }
    },
    [postsStatus, dispatch]
  );

  let content;

  if (postsStatus === 'loading') {
    content = <p>"Loading..."</p>;

  } else if (postsStatus === 'succeeded') {
    const ordererPosts = posts.slice().sort((a, b) => b.date.localeCompare(a.date));

    content = ordererPosts.map((post) => <PostsExcerpt key={post.id} post={post} />);

  } else if (postsStatus === 'failed') {
    content = <p>`Failed to load posts ${error}`</p>;

  }

  return (
    <section>
      <h2>Posts</h2>
      {content}
    </section>
  );
};
export default PostsList;
