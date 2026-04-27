import { createClient } from "@/lib/supabase/server";

export async function getPublicSiteData() {
  const supabase = await createClient();

  const [settingsRes, officialsRes, servicesRes, postsRes, galleryRes] =
    await Promise.all([
      supabase.from("site_settings").select("*").limit(1).maybeSingle(),
      supabase
        .from("officials")
        .select("*")
        .order("sort_order", { ascending: true }),
      supabase
        .from("services")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true }),
      supabase
        .from("posts")
        .select("*")
        .eq("is_published", true)
        .order("published_at", { ascending: false }),
      supabase
        .from("gallery_items")
        .select("*")
        .order("created_at", { ascending: false }),
    ]);

  return {
    settings: settingsRes.data,
    officials: officialsRes.data ?? [],
    services: servicesRes.data ?? [],
    posts: postsRes.data ?? [],
    galleryItems: galleryRes.data ?? [],
  };
}

export async function getPostBySlug(slug: string) {
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  const { data: settings } = await supabase
    .from("site_settings")
    .select("*")
    .limit(1)
    .maybeSingle();

  return { post, settings };
}
