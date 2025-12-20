import { useState, useEffect } from "react";
import { Heart, MessageCircle, Share2, Send, Image, Video } from "lucide-react";

// -------- API FETCH (INFINITE SCROLL) --------
const fetchPostsFromAPI = async (page) => {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts?_limit=5&_page=${page}`);
  const data = await res.json();

  return data.map((item) => ({
    id: item.id + page * 1000,
    author: `User ${item.userId}`,
    content: item.title,
    media: Math.random() > 0.5
      ? { type: "image", url: `https://picsum.photos/1080/1080?random=${item.id}` }
      : { type: "video", url: "https://www.w3schools.com/html/mov_bbb.mp4" },
    likes: Math.floor(Math.random() * 100),
    liked: false,
    showHeart: false,
    views: Math.floor(Math.random() * 1000),
    viewed: false,
    comments: [],
  }));
};

export default function PostPage() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [newPost, setNewPost] = useState("");
  const [media, setMedia] = useState(null);
  const [commentsInput, setCommentsInput] = useState({});

  useEffect(() => {
    loadMore();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 && !loading) {
      loadMore();
    }
  };

  const loadMore = async () => {
    setLoading(true);
    const data = await fetchPostsFromAPI(page);
    setPosts((prev) => [...prev, ...data]);
    setPage((p) => p + 1);
    setLoading(false);
  };

  const createPost = () => {
    if (!newPost && !media) return;

    setPosts((prev) => [
      {
        id: Date.now(),
        author: "You",
        content: newPost,
        media,
        likes: 0,
        liked: false,
        showHeart: false,
        views: 0,
        viewed: false,
        comments: [],
      },
      ...prev,
    ]);

    setNewPost("");
    setMedia(null);
  };

  const likePost = (id) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
          : p
      )
    );
  };

  const doubleTapLike = (id) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id && !p.liked ? { ...p, liked: true, likes: p.likes + 1, showHeart: true } : p
      )
    );
    setTimeout(() => {
      setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, showHeart: false } : p)));
    }, 800);
  };

  const addView = (id) => {
    setPosts((prev) => prev.map((p) => (p.id === id && !p.viewed ? { ...p, views: p.views + 1, viewed: true } : p)));
  };

  const addComment = (id) => {
    if (!commentsInput[id]) return;
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, comments: [...p.comments, commentsInput[id]] } : p)));
    setCommentsInput({ ...commentsInput, [id]: "" });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center px-2 sm:px-4 lg:px-8">
      <div className="w-full max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-3xl space-y-4">
        {/* CREATE POST */}
        <div className="bg-white p-3 sm:p-4 rounded-xl shadow">
          <textarea
            className="w-full border rounded-xl p-2 sm:p-3 text-sm sm:text-base"
            rows={3}
            placeholder="Share your jam..."
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
          />

          {media?.type === "image" && <img src={media.url} className="rounded-xl mt-2 w-full" />}
          {media?.type === "video" && (
            <video className="rounded-xl mt-2 w-full" autoPlay muted loop playsInline>
              <source src={media.url} />
            </video>
          )}

          <div className="flex justify-between items-center mt-2">
            <div className="flex gap-4">
              <button onClick={() => setMedia({ type: "image", url: "https://picsum.photos/1080/1080" })}><Image /></button>
              <button onClick={() => setMedia({ type: "video", url: "https://www.w3schools.com/html/mov_bbb.mp4" })}><Video /></button>
            </div>
            <button onClick={createPost} className="bg-black text-white px-4 py-2 rounded-lg text-sm sm:text-base">Post</button>
          </div>
        </div>

        {/* FEED */}
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-xl shadow p-3 sm:p-4">
            <p className="font-semibold text-sm sm:text-base">{post.author}</p>
            <p className="text-gray-700 text-sm sm:text-base mb-2">{post.content}</p>

            {post.media?.type === "image" && (
              <div className="relative" onDoubleClick={() => doubleTapLike(post.id)}>
                <img src={post.media.url} className="rounded-xl w-full" />
                {post.showHeart && <Heart className="absolute inset-0 m-auto text-white" size={80} fill="currentColor" />}
              </div>
            )}

            {post.media?.type === "video" && (
              <div className="relative" onDoubleClick={() => doubleTapLike(post.id)}>
                <video className="rounded-xl w-full" autoPlay muted loop playsInline onPlay={() => addView(post.id)}>
                  <source src={post.media.url} />
                </video>
                {post.showHeart && <Heart className="absolute inset-0 m-auto text-white" size={80} fill="currentColor" />}
                <span className="absolute bottom-2 right-2 text-xs sm:text-sm text-white bg-black/60 px-2 py-1 rounded">👁 {post.views}</span>
              </div>
            )}

            <div className="flex justify-between items-center mt-3 text-gray-600 text-sm sm:text-base">
              <button onClick={() => likePost(post.id)} className={post.liked ? "text-red-500" : ""}>
                <Heart size={18} fill={post.liked ? "currentColor" : "none"} /> {post.likes}
              </button>
              <span className="flex items-center gap-1"><MessageCircle size={18} /> {post.comments.length}</span>
              <Share2 size={18} />
            </div>

            <div className="flex gap-2 mt-2">
              <input className="flex-1 border rounded-lg px-2 py-1 sm:px-3 sm:py-2 text-sm" placeholder="Comment..." value={commentsInput[post.id] || ""} onChange={(e) => setCommentsInput({ ...commentsInput, [post.id]: e.target.value })} />
              <button onClick={() => addComment(post.id)} className="bg-black text-white px-3 rounded-lg"><Send size={16} /></button>
            </div>
          </div>
        ))}

        {loading && <p className="text-center text-xs sm:text-sm text-gray-500">Loading...</p>}
      </div>
    </div>
  );
}
