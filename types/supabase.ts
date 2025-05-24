import { Database as DB } from "@/utils/supabase/schema";

declare global {
  type Database = DB;
}
