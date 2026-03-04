export interface Profile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface Document {
  id: string;
  owner_id: string;
  title: string;
  content: string;
  is_public: boolean;
  share_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface DocumentPermission {
  id: string;
  document_id: string;
  user_id: string;
  permission: "view" | "edit" | "admin";
}

export interface DataSource {
  id: string;
  document_id: string;
  name: string;
  type: "csv" | "excel" | "json" | "api";
  data: any[];
  columns: string[];
  created_at: string;
}
