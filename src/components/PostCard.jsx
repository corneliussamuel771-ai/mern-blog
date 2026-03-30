export default function PostCard({ post, openPost }) {
  return (
    <div style={styles.card} onClick={() => openPost(post)}>
      <h2 style={styles.title}>{post.title}</h2>
      <p style={styles.preview}>
        {post.body.replace(/<[^>]+>/g, "").slice(0, 150)}...
      </p>

      <div style={styles.meta}>
        <span>{post.readingTime} min read</span>
        <span>•</span>
        <span>{post.likes.length} likes</span>
      </div>
    </div>
  );
}

const styles = {
  card: {
    padding: "25px 0",
    borderBottom: "1px solid #eee",
    cursor: "pointer",
  },
  title: {
    fontSize: "24px",
    marginBottom: "10px",
  },
  preview: {
    color: "#555",
    fontSize: "16px",
  },
  meta: {
    marginTop: "10px",
    fontSize: "14px",
    color: "#888",
    display: "flex",
    gap: "8px",
  },
};
