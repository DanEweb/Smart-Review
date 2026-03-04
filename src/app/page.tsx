"use client";

import { SmartReviewEditor } from "@/components/editor/Editor";
import { Suspense } from "react";

function EditorWithParams() {
  return <SmartReviewEditor />;
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <EditorWithParams />
    </Suspense>
  );
}
