import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/documents - List user's documents
export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get owned documents + shared documents
    const { data: owned, error: ownedError } = await supabase
      .from("documents")
      .select("*")
      .eq("owner_id", user.id)
      .order("updated_at", { ascending: false });

    if (ownedError) throw ownedError;

    const { data: shared, error: sharedError } = await supabase
      .from("document_permissions")
      .select("document_id, permission, documents(*)")
      .eq("user_id", user.id);

    if (sharedError) throw sharedError;

    const sharedDocs = (shared || [])
      .filter((s: any) => s.documents)
      .map((s: any) => ({
        ...s.documents,
        _permission: s.permission,
        _isShared: true,
      }));

    return NextResponse.json({
      owned: owned || [],
      shared: sharedDocs,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal error" },
      { status: 500 }
    );
  }
}

// POST /api/documents - Create a new document
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, content } = body;

    const { data, error } = await supabase
      .from("documents")
      .insert({
        owner_id: user.id,
        title: title || "",
        content: content || "",
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal error" },
      { status: 500 }
    );
  }
}
