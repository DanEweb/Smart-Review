"use client";

import { NodeViewWrapper } from "@tiptap/react";
import { useState } from "react";
import { ExternalLink, Maximize2, X } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function EmbedBlockView({ node, updateAttributes }: any) {
  const { url, title, height } = node.attrs;
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [inputUrl, setInputUrl] = useState(url || "");
  const [isEditing, setIsEditing] = useState(!url);
  const { t } = useI18n();

  const handleSubmit = () => {
    if (inputUrl.trim()) {
      updateAttributes({ url: inputUrl.trim() });
      setIsEditing(false);
    }
  };

  if (isEditing || !url) {
    return (
      <NodeViewWrapper className="my-4">
        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
          <ExternalLink className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mb-3">
            {t.blocks.embed.urlPrompt}
          </p>
          <div className="flex gap-2 max-w-md mx-auto">
            <input
              type="url"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="https://docs.google.com/spreadsheets/..."
              className="flex-1 px-3 py-2 border border-input rounded-md text-sm bg-background"
            />
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm"
            >
              {t.blocks.embed.embedButton}
            </button>
          </div>
        </div>
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper className="my-4">
      <div
        className={`relative group border border-border rounded-lg overflow-hidden ${
          isFullscreen ? "fixed inset-4 z-50 bg-background shadow-2xl" : ""
        }`}
      >
        {title && (
          <div className="px-3 py-2 bg-muted border-b border-border text-sm font-medium flex items-center justify-between">
            <span>{title}</span>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 rounded hover:bg-accent text-xs"
              >
                {t.blocks.embed.changeUrl}
              </button>
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-1 rounded hover:bg-accent"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
        <iframe
          src={url}
          title={title || "Embedded content"}
          className="w-full border-0"
          style={{ height: isFullscreen ? "calc(100vh - 4rem)" : height || 400 }}
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        />
        {isFullscreen && (
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-2 right-2 p-2 rounded-md bg-destructive text-destructive-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </NodeViewWrapper>
  );
}
