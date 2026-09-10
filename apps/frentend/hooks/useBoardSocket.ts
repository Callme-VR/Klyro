"use client";

import { useEffect, useRef, useState } from "react";

export type SocketMessage =
  | {
    type: "INIT_STATE";
    users: string[];
    userId: string;
  }
  | {
    type: "USER_JOINED";
    userId: string;
  }
  | {
    type: "USER_LEAVE";
    userId: string;
  }
  | {
    type: "ERROR";
    message: string;
  };

export interface SocketUser {
  userId: string
}

export default function UseBoardSocketConnections(boardId: string) {
  const socketRef = useRef<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<SocketUser[]>([]);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!boardId) return;

    setError(null);

    // clear existing connection
    if (socketRef.current) {
      socketRef.current.onclose = null;
      socketRef.current.onerror = null;
      socketRef.current.close();
      socketRef.current = null;
    }

    const host =
      typeof window !== "undefined" && window.location.hostname
        ? window.location.hostname
        : "localhost";

    const socketUrl = `ws://${host}:6001`;
    const socket = new WebSocket(socketUrl);

    socketRef.current = socket;

    socket.onopen = () => {
      if (socketRef.current !== socket) return;

      setConnected(true);

      socket.send(
        JSON.stringify({
          type: "JOIN_BOARD",
          boardid: boardId.trim(),
        })
      );
    };

    socket.onmessage = (event) => {
      if (socketRef.current !== socket) return;

      try {
        const data: SocketMessage = JSON.parse(event.data);

        if (data.type === "INIT_STATE") {
          setCurrentUserId(data.userId);
          setOnlineUsers(data.users.map((id) => ({ userId: id })));
        }

        if (data.type === "USER_JOINED") {
          setOnlineUsers((prev) => {
            if (prev.some((u) => u.userId === data.userId)) return prev;

            return [...prev, { userId: data.userId }];
          });
        }

        if (data.type === "USER_LEAVE") {
          setOnlineUsers((prev) =>
            prev.filter((u) => u.userId !== data.userId)
          );
        }

        if (data.type === "ERROR") {
          setError(data.message);
        }
      } catch (error) {
        console.error("Invalid WebSocket message:", error);
      }
    };

    socket.onclose = () => {
      if (socketRef.current !== socket) return;
      setConnected(false);
      setOnlineUsers([]);
      setCurrentUserId(null);
    }
    socket.onerror = () => {
      if (socketRef.current !== socket) return;
      setError(`Unable to connect to WebSocket server at ${socketUrl}`);
      setConnected(false);
    };

    return () => {
      if (socketRef.current === socket) {
        socket.onclose = null;
        socket.onerror = null;
        socket.close();
        socketRef.current = null;
      }
    };
  }, [boardId]);

  return {
    connected,
    currentUserId,
    onlineUsers,
    error
  }
}