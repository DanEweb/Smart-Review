import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/share/[shareId] - Get a shared document (no auth required)
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ shareId: string }> }
) {
  try {
    const { shareId } = await params;
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("documents")
      .select("id, title, content, owner_id, created_at, updated_at")
      .eq("share_id", shareId)
      .eq("is_public", true)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    // Get owner profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name, avatar_url")
      .eq("id", data.owner_id)
      .single();

    return NextResponse.json({
      ...data,
      owner: profile || { display_name: "Unknown" },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal error" },
      { status: 500 }
    );
  }
}
