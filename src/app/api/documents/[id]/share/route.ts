import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { nanoid } from "nanoid";

// POST /api/documents/[id]/share - Create or update share settings
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify ownership
    const { data: doc, error: docError } = await supabase
      .from("documents")
      .select("id, owner_id, share_id")
      .eq("id", id)
      .eq("owner_id", user.id)
      .single();

    if (docError || !doc) {
      return NextResponse.json({ error: "Not found or forbidden" }, { status: 404 });
    }

    const body = await request.json();
    const { action } = body;

    if (action === "create_link") {
      // Generate share link if not exists
      const shareId = doc.share_id || nanoid(12);

      const { data, error } = await supabase
        .from("documents")
        .update({ share_id: shareId, is_public: true })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      const appUrl =
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

      return NextResponse.json({
        shareId,
        shareUrl: `${appUrl}/share/${shareId}`,
        document: data,
      });
    }

    if (action === "revoke_link") {
      const { data, error } = await supabase
        .from("documents")
        .update({ share_id: null, is_public: false })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json({ document: data });
    }

    if (action === "invite") {
      const { email, permission } = body;

      if (!email || !["view", "edit"].includes(permission)) {
        return NextResponse.json(
          { error: "Invalid email or permission" },
          { status: 400 }
        );
      }

      // Find user by email
      // Note: In production, you might use Supabase auth.admin.listUsers or
      // a profiles table with email column
      // For now, we'll use a simpler approach
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("display_name", email) // This is a simplification
        .single();

      if (!profile) {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }

      const { error } = await supabase.from("document_permissions").upsert(
        {
          document_id: id,
          user_id: profile.id,
          permission,
        },
        { onConflict: "document_id,user_id" }
      );

      if (error) throw error;

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal error" },
      { status: 500 }
    );
  }
}
