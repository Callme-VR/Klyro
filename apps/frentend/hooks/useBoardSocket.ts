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

    let socketUrl = process.env.NEXT_PUBLIC_WS_URL;

    if (!socketUrl) {
      if (typeof window !== "undefined") {
        const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
        const host = window.location.hostname;

        if (host === "localhost" || host === "127.0.0.1") {
          socketUrl = `${protocol}//${host}:6001`;
        } else {
          socketUrl = `${protocol}//${host}`;
        }
      } else {
        socketUrl = "ws://localhost:6001";
      }
    }

    // Security check: HTTPS pages strictly require wss:// to avoid browser Mixed Content errors
    if (typeof window !== "undefined" && window.location.protocol === "https:") {
      socketUrl = socketUrl.replace(/^ws:\/\//, "wss://");
    }

    let socket: WebSocket | null = null;

    try {
      const socketInstance = new WebSocket(socketUrl);
      socket = socketInstance;
      socketRef.current = socketInstance;

      socketInstance.onopen = () => {
        if (socketRef.current !== socketInstance) return;

        setConnected(true);

        socketInstance.send(
          JSON.stringify({
            type: "JOIN_BOARD",
            boardid: boardId.trim(),
          })
        );
      };

      socketInstance.onmessage = (event) => {
        if (socketRef.current !== socketInstance) return;

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

      socketInstance.onclose = () => {
        if (socketRef.current !== socketInstance) return;
        setConnected(false);
        setOnlineUsers([]);
        setCurrentUserId(null);
      };

      socketInstance.onerror = () => {
        if (socketRef.current !== socketInstance) return;
        setError(`Unable to connect to WebSocket server at ${socketUrl}`);
        setConnected(false);
      };
    } catch (err) {
      console.error("Failed to construct WebSocket:", err);
      setError(`Unable to connect to WebSocket server at ${socketUrl}`);
      setConnected(false);
    }

    return () => {
      if (socket && socketRef.current === socket) {
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