const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const axios = require("axios");

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.NEXT_PUBLIC_CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const interviewSessions = {};

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("startInterview", async ({ userId, context }) => {
    if (interviewSessions[userId]) {
      socket.emit("resumeInterview", interviewSessions[userId]);
    } else {
      try {
        const response = await axios.get(`http://localhost:3000/api/questions?topic=${context}`);
        const questions = response.data.questions;

        interviewSessions[userId] = {
          questions,
          index: 0,
          answers: [],
          startTime: Date.now(),
          duration: 15 * 60 * 1000, 
        };

        socket.emit("askQuestion", questions[0]);
      } catch (error) {
        console.error("Error fetching questions:", error);
        socket.emit("error", "Failed to fetch questions");
      }
    }
  });

  socket.on("sendAnswer", ({ userId, answer }) => {
    const session = interviewSessions[userId];
    if (!session) return;

    session.answers.push(answer);
    session.index++;

    if (session.index < session.questions.length) {
      socket.emit("askQuestion", session.questions[session.index]);
    } else {
      socket.emit("interviewComplete");
      delete interviewSessions[userId];
    }
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Session timeout checker
setInterval(() => {
  for (const userId in interviewSessions) {
    const session = interviewSessions[userId];
    if (Date.now() - session.startTime > session.duration) {
      io.to(userId).emit("interviewTimeout");
      delete interviewSessions[userId];
    }
  }
}, 1000);

httpServer.listen(3001, () => {
  console.log("Socket server running on port 3001");
});
