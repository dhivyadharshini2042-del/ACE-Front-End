export default function UnauthorizedPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      <h1>Unauthorized</h1>
      <p>Your session has expired or you are not authorized.</p>
      <a
        href="/auth/user/login"
        style={{
          color: "#4f46e5",
          textDecoration: "underline",
        }}
      >
        Go to Login
      </a>
    </div>
  );
}
