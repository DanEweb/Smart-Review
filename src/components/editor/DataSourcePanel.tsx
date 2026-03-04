"use client";

import { useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useDataStore, type DataSource } from "@/stores/data-store";
import { parseFile } from "@/lib/data/parsers";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Upload,
  FileSpreadsheet,
  Trash2,
  Database,
  X,
  Table2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface DataSourcePanelProps {
  open: boolean;
  onClose: () => void;
}

export function DataSourcePanel({ open, onClose }: DataSourcePanelProps) {
  const { t } = useI18n();
  const { dataSources, addDataSource, removeDataSource } = useDataStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewSource, setPreviewSource] = useState<string | null>(null);

  if (!open) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    setIsUploading(true);
    setError(null);

    try {
      for (const file of Array.from(files)) {
        const source = await parseFile(file);
        addDataSource(source);
      }
    } catch (err: any) {
      setError(err.message || "Failed to parse file");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const previewData = previewSource
    ? dataSources.find((s) => s.id === previewSource)
    : null;

  return (
    <div className="w-80 border-l border-border bg-background flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4" />
          <h3 className="text-sm font-semibold">{t.dataSource.title}</h3>
        </div>
        <button onClick={onClose} className="p-1 rounded-md hover:bg-accent">
          <X className="w-4 h-4" />
        </button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Upload Area */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 hover:bg-accent/30 transition-colors"
          >
            <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">
              CSV, Excel, JSON
            </p>
            <p className="text-xs text-primary mt-1">
              {isUploading ? t.dataSource.uploading : t.dataSource.clickToUpload}
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.tsv,.xlsx,.xls,.xlsm,.json"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          {error && (
            <div className="text-xs text-destructive bg-destructive/10 px-3 py-2 rounded-md">
              {error}
            </div>
          )}

          {/* Data Sources List */}
          {dataSources.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">
              {t.dataSource.noSources}
            </p>
          ) : (
            <div className="space-y-2">
              {dataSources.map((source) => (
                <DataSourceItem
                  key={source.id}
                  source={source}
                  isPreview={previewSource === source.id}
                  onTogglePreview={() =>
                    setPreviewSource(
                      previewSource === source.id ? null : source.id
                    )
                  }
                  onRemove={() => {
                    removeDataSource(source.id);
                    if (previewSource === source.id) setPreviewSource(null);
                  }}
                />
              ))}
            </div>
          )}

          {/* Data Preview Table */}
          {previewData && (
            <div className="border border-border rounded-md overflow-hidden">
              <div className="px-3 py-2 bg-muted text-xs font-medium flex items-center gap-1">
                <Table2 className="w-3 h-3" />
                {previewData.name} ({previewData.data.length} rows)
              </div>
              <div className="overflow-x-auto max-h-48">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      {previewData.columns.slice(0, 6).map((col) => (
                        <th
                          key={col}
                          className="px-2 py-1 text-left font-medium whitespace-nowrap"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.data.slice(0, 5).map((row, i) => (
                      <tr
                        key={i}
                        className="border-b border-border last:border-0"
                      >
                        {previewData.columns.slice(0, 6).map((col) => (
                          <td
                            key={col}
                            className="px-2 py-1 whitespace-nowrap"
                          >
                            {String(row[col] ?? "")}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

function DataSourceItem({
  source,
  isPreview,
  onTogglePreview,
  onRemove,
}: {
  source: DataSource;
  isPreview: boolean;
  onTogglePreview: () => void;
  onRemove: () => void;
}) {
  const { t } = useI18n();
  const typeIcons: Record<string, any> = {
    csv: FileSpreadsheet,
    excel: FileSpreadsheet,
    json: Database,
    api: Database,
  };
  const Icon = typeIcons[source.type] || Database;

  return (
    <div className="border border-border rounded-md overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2">
        <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium truncate">{source.name}</p>
          <p className="text-xs text-muted-foreground">
            {source.type.toUpperCase()} · {source.data.length} {t.dataSource.rows} · {source.columns.length} {t.dataSource.cols}
          </p>
        </div>
        <button
          onClick={onTogglePreview}
          className="p-1 rounded hover:bg-accent"
          title="Preview"
        >
          {isPreview ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </button>
        <button
          onClick={onRemove}
          className="p-1 rounded hover:bg-destructive/10 text-destructive"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
