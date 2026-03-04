"use client";

import {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from "react";
import {
  BarChart3,
  Type,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListChecks,
  Quote,
  Code2,
  Minus,
  Image,
  ExternalLink,
  Gauge,
  ChevronRight,
  AlertCircle,
  LayoutGrid,
} from "lucide-react";
import type { SlashCommandItem } from "@/extensions/slash-command";
import { demoSalesData, demoChartConfig, demoKPIConfigs } from "@/lib/demo-data";
import { nanoid } from "nanoid";
import type { TranslationKeys } from "@/lib/i18n";

function getCommandItems(editor: any, t?: TranslationKeys): SlashCommandItem[] {
  const sc = t?.slashCommand;
  const blocks = t?.blocks;

  return [
    {
      title: sc?.heading1.title ?? "Heading 1",
      description: sc?.heading1.description ?? "Large heading",
      icon: "Heading1",
      keywords: ["h1", "heading", "見出し", "제목"],
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).setNode("heading", { level: 1 }).run();
      },
    },
    {
      title: sc?.heading2.title ?? "Heading 2",
      description: sc?.heading2.description ?? "Medium heading",
      icon: "Heading2",
      keywords: ["h2", "heading", "見出し", "제목"],
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).setNode("heading", { level: 2 }).run();
      },
    },
    {
      title: sc?.heading3.title ?? "Heading 3",
      description: sc?.heading3.description ?? "Small heading",
      icon: "Heading3",
      keywords: ["h3", "heading", "見出し", "제목"],
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).setNode("heading", { level: 3 }).run();
      },
    },
    {
      title: sc?.paragraph.title ?? "Text",
      description: sc?.paragraph.description ?? "Plain text",
      icon: "Type",
      keywords: ["text", "paragraph", "本文", "본문"],
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).setParagraph().run();
      },
    },
    {
      title: sc?.bulletList.title ?? "List",
      description: sc?.bulletList.description ?? "Bullet list",
      icon: "List",
      keywords: ["list", "bullet", "リスト", "목록"],
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).toggleBulletList().run();
      },
    },
    {
      title: sc?.checklist.title ?? "Checklist",
      description: sc?.checklist.description ?? "Task list",
      icon: "ListChecks",
      keywords: ["checklist", "todo", "task", "チェックリスト", "할일"],
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).toggleTaskList().run();
      },
    },
    {
      title: sc?.quote.title ?? "Quote",
      description: sc?.quote.description ?? "Quote block",
      icon: "Quote",
      keywords: ["quote", "blockquote", "引用", "인용"],
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).toggleBlockquote().run();
      },
    },
    {
      title: sc?.code.title ?? "Code",
      description: sc?.code.description ?? "Code block",
      icon: "Code2",
      keywords: ["code", "codeblock", "コード", "코드"],
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).toggleCodeBlock().run();
      },
    },
    {
      title: sc?.divider.title ?? "Divider",
      description: sc?.divider.description ?? "Horizontal divider",
      icon: "Minus",
      keywords: ["divider", "hr", "line", "区切り", "구분"],
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).setHorizontalRule().run();
      },
    },
    {
      title: sc?.chart.title ?? "Chart",
      description: sc?.chart.description ?? "Insert a data chart",
      icon: "BarChart3",
      keywords: ["chart", "graph", "チャート", "グラフ", "차트", "그래프"],
      command: ({ editor, range }) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .insertContent({
            type: "chartBlock",
            attrs: {
              chartConfig: demoChartConfig,
              data: demoSalesData,
              blockId: nanoid(),
            },
          })
          .run();
      },
    },
    {
      title: sc?.kpi.title ?? "KPI",
      description: sc?.kpi.description ?? "Key metric card",
      icon: "Gauge",
      keywords: ["kpi", "metric", "指標", "지표", "カード", "카드"],
      command: ({ editor, range }) => {
        const kpi = demoKPIConfigs[0];
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .insertContent({
            type: "kpiBlock",
            attrs: {
              title: kpi.title,
              value: kpi.value,
              trendValue: kpi.trend?.value,
              trendDirection: kpi.trend?.direction,
              color: kpi.color,
              blockId: nanoid(),
            },
          })
          .run();
      },
    },
    {
      title: sc?.embed.title ?? "Embed",
      description: sc?.embed.description ?? "Embed external URL",
      icon: "ExternalLink",
      keywords: ["embed", "iframe", "youtube", "google", "sheets", "埋め込み", "임베드"],
      command: ({ editor, range }) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .insertContent({
            type: "embedBlock",
            attrs: { url: "", title: "", height: 400, blockId: nanoid() },
          })
          .run();
      },
    },
    {
      title: sc?.toggle.title ?? "Toggle",
      description: sc?.toggle.description ?? "Collapsible block",
      icon: "ChevronRight",
      keywords: ["toggle", "collapse", "トグル", "折りたたみ", "접기", "토글"],
      command: ({ editor, range }) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .insertContent({
            type: "toggleBlock",
            attrs: {
              summary: blocks?.toggle.defaultSummary ?? "Click to expand",
              isOpen: true,
              blockId: nanoid(),
            },
            content: [{ type: "paragraph", content: [{ type: "text", text: "..." }] }],
          })
          .run();
      },
    },
    {
      title: sc?.callout.title ?? "Callout",
      description: sc?.callout.description ?? "Highlight box",
      icon: "AlertCircle",
      keywords: ["callout", "alert", "info", "warning", "コールアウト", "강조", "콜아웃"],
      command: ({ editor, range }) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .insertContent({
            type: "calloutBlock",
            attrs: { type: "info", blockId: nanoid() },
            content: [{ type: "text", text: blocks?.callout.defaultText ?? "Enter important content here" }],
          })
          .run();
      },
    },
    {
      title: sc?.dashboard.title ?? "Dashboard",
      description: sc?.dashboard.description ?? "Insert a widget grid",
      icon: "LayoutGrid",
      keywords: ["dashboard", "grid", "widget", "ダッシュボード", "グリッド", "대시보드", "그리드"],
      command: ({ editor, range }) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .insertContent({
            type: "dashboardGridBlock",
            attrs: {
              blockId: nanoid(),
            },
          })
          .run();
      },
    },
  ];
}

const ICON_MAP: Record<string, any> = {
  Heading1,
  Heading2,
  Heading3,
  Type,
  List,
  ListChecks,
  Quote,
  Code2,
  Minus,
  Image,
  BarChart3,
  Gauge,
  ExternalLink,
  ChevronRight,
  AlertCircle,
  LayoutGrid,
};

export const SlashCommandList = forwardRef(
  (props: { items: SlashCommandItem[]; command: any; noResultsText?: string }, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const selectItem = useCallback(
      (index: number) => {
        const item = props.items[index];
        if (item) {
          props.command(item);
        }
      },
      [props]
    );

    useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }: { event: KeyboardEvent }) => {
        if (event.key === "ArrowUp") {
          setSelectedIndex(
            (selectedIndex + props.items.length - 1) % props.items.length
          );
          return true;
        }
        if (event.key === "ArrowDown") {
          setSelectedIndex((selectedIndex + 1) % props.items.length);
          return true;
        }
        if (event.key === "Enter") {
          selectItem(selectedIndex);
          return true;
        }
        return false;
      },
    }));

    useEffect(() => setSelectedIndex(0), [props.items]);

    if (!props.items.length) {
      return (
        <div className="bg-popover border border-border rounded-lg shadow-lg p-3 text-sm text-muted-foreground">
          {props.noResultsText || "No results"}
        </div>
      );
    }

    return (
      <div className="bg-popover border border-border rounded-lg shadow-lg py-1 w-72 max-h-80 overflow-y-auto">
        {props.items.map((item, index) => {
          const Icon = ICON_MAP[item.icon];
          return (
            <button
              key={item.title}
              onClick={() => selectItem(index)}
              className={`flex items-center gap-3 w-full px-3 py-2 text-left text-sm ${
                index === selectedIndex ? "bg-accent" : "hover:bg-accent/50"
              }`}
            >
              <div className="w-8 h-8 flex items-center justify-center rounded-md border border-border bg-background">
                {Icon && <Icon className="w-4 h-4" />}
              </div>
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-xs text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    );
  }
);

SlashCommandList.displayName = "SlashCommandList";

export { getCommandItems };
