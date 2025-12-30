import { useState, useEffect } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  Send,
  VolumeX,
  Volume2,
  Upload,
} from "lucide-react";

// -------- API FETCH --------
const fetchPostsFromAPI = async (page) => {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_limit=5&_page=${page}`
  );
  const data = await res.json();

  return data.map((item) => ({
    id: item.id + page * 1000,
    author: `User ${item.userId}`,
    content: item.title,
    media:
      Math.random() > 0.5
        ? { type: "image", url: `https://picsum.photos/800/800?random=${item.id}` }
        : { type: "video", url: "https://www.w3schools.com/html/mov_bbb.mp4" },
    likes: Math.floor(Math.random() * 200),
    liked: false,
    showHeart: false,
    muted: true,
    showAllComments: false,
    comments: [
      { user: "alex", text: "🔥 Amazing!" },
      { user: "jamie", text: "Love this vibe 🎶" },
      { user: "rohan", text: "So clean 🔥🔥" },
      { user: "sara", text: "This looks awesome" },
    ],
  }));
};

export default function PostPage() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [commentInput, setCommentInput] = useState({});

  // 🔹 UPLOAD STATE
  const [caption, setCaption] = useState("");
  const [uploadMedia, setUploadMedia] = useState(null);

  useEffect(() => {
    loadMore();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScroll = () => {
    if (
      window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 200 &&
      !loading
    ) {
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

  // ❤️ LIKE
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
        p.id === id && !p.liked
          ? { ...p, liked: true, likes: p.likes + 1, showHeart: true }
          : p
      )
    );
    setTimeout(() => {
      setPosts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, showHeart: false } : p))
      );
    }, 600);
  };

  // 💬 COMMENT
  const addComment = (id) => {
    if (!commentInput[id]) return;
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              comments: [...p.comments, { user: "you", text: commentInput[id] }],
            }
          : p
      )
    );
    setCommentInput({ ...commentInput, [id]: "" });
  };

  const toggleComments = (id) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, showAllComments: !p.showAllComments } : p
      )
    );
  };

  const toggleMute = (id) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, muted: !p.muted } : p))
    );
  };

  // ⬆️ HANDLE UPLOAD
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const type = file.type.startsWith("video") ? "video" : "image";
    setUploadMedia({
      type,
      url: URL.createObjectURL(file),
    });
  };

  const createPost = () => {
    if (!uploadMedia && !caption) return;

    setPosts((prev) => [
      {
        id: Date.now(),
        author: "You",
        content: caption,
        media: uploadMedia,
        likes: 0,
        liked: false,
        showHeart: false,
        muted: true,
        showAllComments: false,
        comments: [],
      },
      ...prev,
    ]);

    setCaption("");
    setUploadMedia(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <div className="w-full max-w-[420px] md:max-w-[480px] lg:max-w-[520px] px-2 py-4 space-y-3">

        {/* ⬆️ CREATE POST */}
        <div className="bg-white rounded-xl border p-2 space-y-2">
          <textarea
            className="w-full border rounded-lg px-3 py-2 text-xs resize-none"
            rows={2}
            placeholder="Share something..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />

          {uploadMedia?.type === "image" && (
            <img
              src={uploadMedia.url}
              className="w-full aspect-[4/5] object-cover rounded-lg"
            />
          )}

          {uploadMedia?.type === "video" && (
            <video
              src={uploadMedia.url}
              className="w-full aspect-[4/5] object-cover rounded-lg"
              autoPlay
              muted
              loop
            />
          )}

          <div className="flex justify-between items-center">
            <label className="cursor-pointer text-gray-600">
              <Upload size={16} />
              <input
                type="file"
                accept="image/*,video/*"
                hidden
                onChange={handleUpload}
              />
            </label>
            <button
              onClick={createPost}
              className="bg-black text-white px-3 py-1 rounded-md text-xs"
            >
              Post
            </button>
          </div>
        </div>

        {/* FEED */}
        {posts.map((post) => {
          const visibleComments = post.showAllComments
            ? post.comments
            : post.comments.slice(0, 2);

          return (
            <div key={post.id} className="bg-white rounded-xl border overflow-hidden">
              <div className="px-3 py-2 text-sm font-semibold">
                {post.author}
              </div>

              <div
                className="relative"
                onDoubleClick={() => doubleTapLike(post.id)}
              >
                {post.media.type === "image" ? (
                  <img
                    src={post.media.url}
                    className="w-full aspect-[4/5] object-cover"
                  />
                ) : (
                  <video
                    src={post.media.url}
                    className="w-full aspect-[4/5] object-cover"
                    autoPlay
                    loop
                    muted={post.muted}
                  />
                )}

                {post.media.type === "video" && (
                  <button
                    onClick={() => toggleMute(post.id)}
                    className="absolute bottom-2 right-2 bg-black/60 text-white p-1.5 rounded-full"
                  >
                    {post.muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  </button>
                )}

                {post.showHeart && (
                  <Heart
                    size={70}
                    className="absolute inset-0 m-auto text-white"
                    fill="currentColor"
                  />
                )}
              </div>

              <div className="px-3 py-2 space-y-1">
                <div className="flex items-center gap-5">
                  <button onClick={() => likePost(post.id)} className="flex gap-1">
                    <Heart
                      size={20}
                      className={post.liked ? "text-red-500" : ""}
                      fill={post.liked ? "currentColor" : "none"}
                    />
                    <span className="text-xs">{post.likes}</span>
                  </button>

                  <button
                    onClick={() => toggleComments(post.id)}
                    className="flex gap-1"
                  >
                    <MessageCircle size={20} />
                    <span className="text-xs">{post.comments.length}</span>
                  </button>

                  <Share2 size={20} />
                </div>

                {post.comments.length > 2 && !post.showAllComments && (
                  <button
                    onClick={() => toggleComments(post.id)}
                    className="text-xs text-gray-500"
                  >
                    View all {post.comments.length} comments
                  </button>
                )}

                {visibleComments.map((c, i) => (
                  <p key={i} className="text-xs">
                    <span className="font-semibold mr-1">{c.user}</span>
                    {c.text}
                  </p>
                ))}

                <div className="flex gap-2 mt-1">
                  <input
                    className="flex-1 border rounded-full px-3 py-1.5 text-xs"
                    placeholder="Add a comment..."
                    value={commentInput[post.id] || ""}
                    onChange={(e) =>
                      setCommentInput({
                        ...commentInput,
                        [post.id]: e.target.value,
                      })
                    }
                  />
                  <button onClick={() => addComment(post.id)}>
                    <Send size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <p className="text-center text-xs text-gray-500">Loading...</p>
        )}
      </div>
    </div>
  );
}
