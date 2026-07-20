const { io } = require("socket.io-client");

const socket = io("http://localhost:5000", {
  auth: {
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2YTViODI5NjRiYmI0M2Q2NTFiZTBhYTciLCJpYXQiOjE3ODQ1NDI4MzksImV4cCI6MTc4NDU0MzczOX0.9NtLKhTusk0EP6bwUUuDrHs_71jmxmNYS7iC_Rhp_Tw",
  },
});

socket.on("connect", () => {
  console.log("✅ Connected");
  console.log(socket.id);
});

socket.on("connect_error", (err) => {
  console.log("❌", err.message);
});