"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { SmartReviewEditor } from "@/components/editor/Editor";

export default function ShareViewPage() {
  const params = useParams();
  const shareId = params.shareId as string;
  const [document, setDocument] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDocument() {
      try {
        const res = await fetch(`/api/share/${shareId}`);
        if (!res.ok) {
          throw new Error(
            res.status === 404 ? "ドキュメントが見つかりません" : "エラーが発生しました"
          );
        }
        const data = await res.json();
        setDocument(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (shareId) {
      fetchDocument();
    }
  }, [shareId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground text-sm">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4 p-8">
          <h1 className="text-2xl font-bold">😕</h1>
          <p className="text-muted-foreground">
            {error || "ドキュメントが見つかりません"}
          </p>
          <a
            href="/"
            className="inline-block px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm hover:bg-primary/90"
          >
            ホームへ戻る
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Shared document header */}
      <div className="border-b border-border bg-muted/30 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">
            {document.title || "無題"}
          </span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
            閲覧のみ
          </span>
        </div>
        <span className="text-xs text-muted-foreground">
          Smart Review で作成
        </span>
      </div>

      {/* Read-only editor view */}
      <SmartReviewEditor />
    </div>
  );
}
