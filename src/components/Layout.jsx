export default function Layout({ children }) {
  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>{children}</div>
    </div>
  );
}

const styles = {
  wrapper: {
    background: "#f9f9f9",
    minHeight: "100vh",
  },
  container: {
    maxWidth: "760px",
    margin: "0 auto",
    padding: "40px 20px",
  },
};
