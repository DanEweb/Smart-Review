"use client";

import { useState, useCallback } from "react";
import { X, Copy, Check, Link2, Globe, Lock } from "lucide-react";
import { useAuth } from "@/lib/supabase/auth-context";

interface ShareDialogProps {
  open: boolean;
  onClose: () => void;
  documentId?: string;
}

export function ShareDialog({ open, onClose, documentId }: ShareDialogProps) {
  const { user, isSupabaseConfigured } = useAuth();
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateLink = useCallback(async () => {
    if (!documentId) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/documents/${documentId}/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create_link" }),
      });

      if (!res.ok) throw new Error("共有リンクの作成に失敗しました");

      const data = await res.json();
      setShareUrl(data.shareUrl);
      setIsPublic(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [documentId]);

  const handleRevokeLink = useCallback(async () => {
    if (!documentId) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/documents/${documentId}/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "revoke_link" }),
      });

      if (!res.ok) throw new Error("共有リンクの無効化に失敗しました");

      setShareUrl(null);
      setIsPublic(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [documentId]);

  const handleCopy = useCallback(async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for non-secure contexts
      const textarea = document.createElement("textarea");
      textarea.value = shareUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [shareUrl]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-background rounded-xl shadow-xl border border-border p-6 w-[420px] max-w-[95vw]">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-semibold flex items-center gap-2">
            <Link2 className="w-4 h-4" />
            共有設定
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-accent transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Not configured or not logged in */}
        {!isSupabaseConfigured ? (
          <div className="text-center py-6 space-y-3">
            <Lock className="w-8 h-8 mx-auto text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">
              共有機能を使用するにはSupabaseの設定が必要です。
            </p>
            <p className="text-xs text-muted-foreground">
              .env.local にSupabase URL とAnon Keyを設定してください。
            </p>
          </div>
        ) : !user ? (
          <div className="text-center py-6 space-y-3">
            <Lock className="w-8 h-8 mx-auto text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">
              共有するにはログインが必要です。
            </p>
            <a
              href="/auth/login"
              className="inline-block px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm hover:bg-primary/90"
            >
              ログイン
            </a>
          </div>
        ) : !documentId ? (
          <div className="text-center py-6 space-y-3">
            <Globe className="w-8 h-8 mx-auto text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">
              ドキュメントをクラウドに保存してから共有できます。
            </p>
            <p className="text-xs text-muted-foreground">
              ダッシュボードからドキュメントを作成してください。
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Share link section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isPublic ? (
                    <Globe className="w-4 h-4 text-green-600" />
                  ) : (
                    <Lock className="w-4 h-4 text-muted-foreground" />
                  )}
                  <span className="text-sm font-medium">
                    {isPublic
                      ? "リンクを知っている人がアクセス可能"
                      : "非公開"}
                  </span>
                </div>
              </div>

              {shareUrl ? (
                <div className="space-y-2">
                  {/* URL display */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={shareUrl}
                      className="flex-1 px-3 py-2 rounded-lg border border-border bg-muted text-sm text-muted-foreground font-mono truncate"
                    />
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors flex-shrink-0"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4" />
                          コピー済み
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          コピー
                        </>
                      )}
                    </button>
                  </div>

                  {/* Revoke button */}
                  <button
                    onClick={handleRevokeLink}
                    disabled={loading}
                    className="text-xs text-destructive hover:underline disabled:opacity-50"
                  >
                    共有リンクを無効にする
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleCreateLink}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  ) : (
                    <Link2 className="w-4 h-4" />
                  )}
                  共有リンクを作成
                </button>
              )}
            </div>

            {/* Error */}
            {error && (
              <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">
                {error}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
