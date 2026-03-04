"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/lib/supabase/auth-context";
import { useI18n } from "@/lib/i18n";
import {
  Plus,
  FileText,
  Clock,
  Users,
  MoreHorizontal,
  Trash2,
  ExternalLink,
  LogOut,
} from "lucide-react";
import type { Document } from "@/lib/supabase/types";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user, signOut, isSupabaseConfigured } = useAuth();
  const { t } = useI18n();
  const router = useRouter();
  const [owned, setOwned] = useState<Document[]>([]);
  const [shared, setShared] = useState<(Document & { _permission: string })[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  const fetchDocuments = useCallback(async () => {
    try {
      const res = await fetch("/api/documents");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setOwned(data.owned || []);
      setShared(data.shared || []);
    } catch (err) {
      console.error("Failed to fetch documents:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isSupabaseConfigured && user) {
      fetchDocuments();
    } else {
      setLoading(false);
    }
  }, [user, isSupabaseConfigured, fetchDocuments]);

  const handleCreateDocument = async () => {
    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "" }),
      });
      if (!res.ok) throw new Error("Failed to create");
      const doc = await res.json();
      router.push(`/?doc=${doc.id}`);
    } catch (err) {
      console.error("Failed to create document:", err);
    }
  };

  const handleDeleteDocument = async (id: string) => {
    if (!confirm("このドキュメントを削除しますか？")) return;

    try {
      const res = await fetch(`/api/documents/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setOwned((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      console.error("Failed to delete document:", err);
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isSupabaseConfigured) {
    // If Supabase is not configured, redirect to local editor
    router.push("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight">Smart Review</h1>
          <div className="flex items-center gap-4">
            {user && (
              <>
                <span className="text-sm text-muted-foreground">
                  {user.email}
                </span>
                <button
                  onClick={signOut}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  ログアウト
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Create Button */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-lg font-semibold">マイドキュメント</h2>
          <button
            onClick={handleCreateDocument}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            新しいドキュメント
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : owned.length === 0 && shared.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <FileText className="w-12 h-12 mx-auto text-muted-foreground/40" />
            <p className="text-muted-foreground">
              ドキュメントがありません
            </p>
            <button
              onClick={handleCreateDocument}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              最初のドキュメントを作成
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Owned Documents */}
            {owned.length > 0 && (
              <div className="grid gap-3">
                {owned.map((doc) => (
                  <div
                    key={doc.id}
                    className="group flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors cursor-pointer"
                    onClick={() => router.push(`/?doc=${doc.id}`)}
                  >
                    <FileText className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {doc.title || "無題"}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(doc.updated_at)}
                        </span>
                        {doc.is_public && (
                          <span className="flex items-center gap-1 text-green-600">
                            <ExternalLink className="w-3 h-3" />
                            公開中
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteDocument(doc.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Shared with me */}
            {shared.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  共有されたドキュメント
                </h3>
                <div className="grid gap-3">
                  {shared.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors cursor-pointer"
                      onClick={() => router.push(`/?doc=${doc.id}`)}
                    >
                      <FileText className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">
                          {doc.title || "無題"}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                          <Clock className="w-3 h-3" />
                          {formatDate(doc.updated_at)}
                          <span className="px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-[10px]">
                            {doc._permission}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
