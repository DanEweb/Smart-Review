"use client";

import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";

const COLORS = [
  "#ff6b6b", "#51cf66", "#339af0", "#fcc419", "#cc5de8",
  "#20c997", "#ff922b", "#845ef7", "#f06595", "#22b8cf",
];

const NAMES_JA = [
  "田中", "鈴木", "佐藤", "高橋", "渡辺",
  "伊藤", "山本", "中村", "小林", "加藤",
];

function getRandomColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

function getRandomName() {
  return NAMES_JA[Math.floor(Math.random() * NAMES_JA.length)];
}

interface CollabInstance {
  ydoc: Y.Doc;
  provider: WebrtcProvider;
  user: { name: string; color: string };
}

const instances = new Map<string, CollabInstance>();

export function getCollabInstance(roomId: string): CollabInstance {
  if (instances.has(roomId)) {
    return instances.get(roomId)!;
  }

  const ydoc = new Y.Doc();
  const provider = new WebrtcProvider(roomId, ydoc, {
    signaling: ["wss://signaling.yjs.dev"],
  });

  const user = {
    name: getRandomName(),
    color: getRandomColor(),
  };

  provider.awareness.setLocalStateField("user", user);

  const instance: CollabInstance = { ydoc, provider, user };
  instances.set(roomId, instance);
  return instance;
}

export function destroyCollabInstance(roomId: string) {
  const instance = instances.get(roomId);
  if (instance) {
    instance.provider.destroy();
    instance.ydoc.destroy();
    instances.delete(roomId);
  }
}
