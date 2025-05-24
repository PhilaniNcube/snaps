export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      classes: {
        Row: {
          academic_year: number | null;
          class_id: number;
          class_name: string;
          created_at: string | null;
          event_id: number | null;
          school_id: number;
          teacher_name: string | null;
          updated_at: string | null;
        };
        Insert: {
          academic_year?: number | null;
          class_id?: number;
          class_name: string;
          created_at?: string | null;
          event_id?: number | null;
          school_id: number;
          teacher_name?: string | null;
          updated_at?: string | null;
        };
        Update: {
          academic_year?: number | null;
          class_id?: number;
          class_name?: string;
          created_at?: string | null;
          event_id?: number | null;
          school_id?: number;
          teacher_name?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "classes_event_id_fkey";
            columns: ["event_id"];
            isOneToOne: false;
            referencedRelation: "photo_shoot_events";
            referencedColumns: ["event_id"];
          },
          {
            foreignKeyName: "classes_school_id_fkey";
            columns: ["school_id"];
            isOneToOne: false;
            referencedRelation: "schools";
            referencedColumns: ["school_id"];
          },
        ];
      };
      client_accounts: {
        Row: {
          app_role: Database["public"]["Enums"]["app_user_role_enum"];
          created_at: string | null;
          email: string | null;
          first_name: string | null;
          id: string;
          is_active: boolean | null;
          last_name: string | null;
          updated_at: string | null;
        };
        Insert: {
          app_role?: Database["public"]["Enums"]["app_user_role_enum"];
          created_at?: string | null;
          email?: string | null;
          first_name?: string | null;
          id?: string;
          is_active?: boolean | null;
          last_name?: string | null;
          updated_at?: string | null;
        };
        Update: {
          app_role?: Database["public"]["Enums"]["app_user_role_enum"];
          created_at?: string | null;
          email?: string | null;
          first_name?: string | null;
          id?: string;
          is_active?: boolean | null;
          last_name?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      order_items: {
        Row: {
          created_at: string | null;
          order_id: number;
          order_item_id: number;
          product_id: number;
          quantity: number;
          selected_photo_reference_code: string | null;
          subtotal: number | null;
          unit_price_at_purchase: number;
        };
        Insert: {
          created_at?: string | null;
          order_id: number;
          order_item_id?: number;
          product_id: number;
          quantity: number;
          selected_photo_reference_code?: string | null;
          subtotal?: number | null;
          unit_price_at_purchase: number;
        };
        Update: {
          created_at?: string | null;
          order_id?: number;
          order_item_id?: number;
          product_id?: number;
          quantity?: number;
          selected_photo_reference_code?: string | null;
          subtotal?: number | null;
          unit_price_at_purchase?: number;
        };
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["order_id"];
          },
          {
            foreignKeyName: "order_items_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["product_id"];
          },
        ];
      };
      orders: {
        Row: {
          cash_included_amount: number | null;
          class_id: number | null;
          client_account_id: string | null;
          created_at: string | null;
          customer_contact_email: string | null;
          customer_contact_phone: string | null;
          customer_name: string | null;
          digital_delivery_email: string | null;
          event_id: number;
          notes: string | null;
          order_date: string | null;
          order_id: number;
          paid_at: string | null;
          payment_method: string | null;
          payment_reference: string | null;
          school_id: number | null;
          status: Database["public"]["Enums"]["order_status_enum"] | null;
          student_id: number | null;
          total_amount: number | null;
          updated_at: string | null;
        };
        Insert: {
          cash_included_amount?: number | null;
          class_id?: number | null;
          client_account_id?: string | null;
          created_at?: string | null;
          customer_contact_email?: string | null;
          customer_contact_phone?: string | null;
          customer_name?: string | null;
          digital_delivery_email?: string | null;
          event_id: number;
          notes?: string | null;
          order_date?: string | null;
          order_id?: number;
          paid_at?: string | null;
          payment_method?: string | null;
          payment_reference?: string | null;
          school_id?: number | null;
          status?: Database["public"]["Enums"]["order_status_enum"] | null;
          student_id?: number | null;
          total_amount?: number | null;
          updated_at?: string | null;
        };
        Update: {
          cash_included_amount?: number | null;
          class_id?: number | null;
          client_account_id?: string | null;
          created_at?: string | null;
          customer_contact_email?: string | null;
          customer_contact_phone?: string | null;
          customer_name?: string | null;
          digital_delivery_email?: string | null;
          event_id?: number;
          notes?: string | null;
          order_date?: string | null;
          order_id?: number;
          paid_at?: string | null;
          payment_method?: string | null;
          payment_reference?: string | null;
          school_id?: number | null;
          status?: Database["public"]["Enums"]["order_status_enum"] | null;
          student_id?: number | null;
          total_amount?: number | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "orders_class_id_fkey";
            columns: ["class_id"];
            isOneToOne: false;
            referencedRelation: "classes";
            referencedColumns: ["class_id"];
          },
          {
            foreignKeyName: "orders_client_account_id_fkey";
            columns: ["client_account_id"];
            isOneToOne: false;
            referencedRelation: "client_accounts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "orders_event_id_fkey";
            columns: ["event_id"];
            isOneToOne: false;
            referencedRelation: "photo_shoot_events";
            referencedColumns: ["event_id"];
          },
          {
            foreignKeyName: "orders_school_id_fkey";
            columns: ["school_id"];
            isOneToOne: false;
            referencedRelation: "schools";
            referencedColumns: ["school_id"];
          },
          {
            foreignKeyName: "orders_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "students";
            referencedColumns: ["student_id"];
          },
        ];
      };
      parent_student_access: {
        Row: {
          access_id: number;
          can_order: boolean | null;
          can_view_photos: boolean | null;
          client_account_id: string;
          granted_at: string | null;
          relationship_type: string | null;
          student_id: number;
        };
        Insert: {
          access_id?: number;
          can_order?: boolean | null;
          can_view_photos?: boolean | null;
          client_account_id: string;
          granted_at?: string | null;
          relationship_type?: string | null;
          student_id: number;
        };
        Update: {
          access_id?: number;
          can_order?: boolean | null;
          can_view_photos?: boolean | null;
          client_account_id?: string;
          granted_at?: string | null;
          relationship_type?: string | null;
          student_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "parent_student_access_client_account_id_fkey";
            columns: ["client_account_id"];
            isOneToOne: false;
            referencedRelation: "client_accounts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "parent_student_access_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "students";
            referencedColumns: ["student_id"];
          },
        ];
      };
      photo_shoot_events: {
        Row: {
          created_at: string | null;
          event_id: number;
          event_name: string;
          notes: string | null;
          order_deadline: string | null;
          photo_gallery_live_until: string | null;
          school_id: number | null;
          shoot_date: string | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          event_id?: number;
          event_name: string;
          notes?: string | null;
          order_deadline?: string | null;
          photo_gallery_live_until?: string | null;
          school_id?: number | null;
          shoot_date?: string | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          event_id?: number;
          event_name?: string;
          notes?: string | null;
          order_deadline?: string | null;
          photo_gallery_live_until?: string | null;
          school_id?: number | null;
          shoot_date?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "photo_shoot_events_school_id_fkey";
            columns: ["school_id"];
            isOneToOne: false;
            referencedRelation: "schools";
            referencedColumns: ["school_id"];
          },
        ];
      };
      photos: {
        Row: {
          class_id: number | null;
          event_id: number;
          image_url: string;
          is_class_photo: boolean | null;
          is_public_in_gallery: boolean | null;
          photo_id: number;
          photo_reference_code: string;
          student_id: number | null;
          thumbnail_url: string | null;
          uploaded_at: string | null;
        };
        Insert: {
          class_id?: number | null;
          event_id: number;
          image_url: string;
          is_class_photo?: boolean | null;
          is_public_in_gallery?: boolean | null;
          photo_id?: number;
          photo_reference_code: string;
          student_id?: number | null;
          thumbnail_url?: string | null;
          uploaded_at?: string | null;
        };
        Update: {
          class_id?: number | null;
          event_id?: number;
          image_url?: string;
          is_class_photo?: boolean | null;
          is_public_in_gallery?: boolean | null;
          photo_id?: number;
          photo_reference_code?: string;
          student_id?: number | null;
          thumbnail_url?: string | null;
          uploaded_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "photos_class_id_fkey";
            columns: ["class_id"];
            isOneToOne: false;
            referencedRelation: "classes";
            referencedColumns: ["class_id"];
          },
          {
            foreignKeyName: "photos_event_id_fkey";
            columns: ["event_id"];
            isOneToOne: false;
            referencedRelation: "photo_shoot_events";
            referencedColumns: ["event_id"];
          },
          {
            foreignKeyName: "photos_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "students";
            referencedColumns: ["student_id"];
          },
        ];
      };
      product_components: {
        Row: {
          component_id: number;
          contained_product_id: number;
          package_product_id: number;
          quantity: number;
        };
        Insert: {
          component_id?: number;
          contained_product_id: number;
          package_product_id: number;
          quantity: number;
        };
        Update: {
          component_id?: number;
          contained_product_id?: number;
          package_product_id?: number;
          quantity?: number;
        };
        Relationships: [
          {
            foreignKeyName: "product_components_contained_product_id_fkey";
            columns: ["contained_product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["product_id"];
          },
          {
            foreignKeyName: "product_components_package_product_id_fkey";
            columns: ["package_product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["product_id"];
          },
        ];
      };
      product_price_tiers: {
        Row: {
          max_quantity: number | null;
          min_quantity: number;
          price_per_unit: number;
          price_tier_id: number;
          product_id: number;
        };
        Insert: {
          max_quantity?: number | null;
          min_quantity: number;
          price_per_unit: number;
          price_tier_id?: number;
          product_id: number;
        };
        Update: {
          max_quantity?: number | null;
          min_quantity?: number;
          price_per_unit?: number;
          price_tier_id?: number;
          product_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "product_price_tiers_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["product_id"];
          },
        ];
      };
      products: {
        Row: {
          base_price: number;
          category: Database["public"]["Enums"]["product_category_enum"] | null;
          created_at: string | null;
          description: string | null;
          display_order: number | null;
          is_active: boolean | null;
          is_package: boolean | null;
          name: string;
          product_id: number;
          requires_photo_selection: boolean | null;
          size_description: string | null;
          sku: string | null;
          updated_at: string | null;
        };
        Insert: {
          base_price: number;
          category?:
            | Database["public"]["Enums"]["product_category_enum"]
            | null;
          created_at?: string | null;
          description?: string | null;
          display_order?: number | null;
          is_active?: boolean | null;
          is_package?: boolean | null;
          name: string;
          product_id?: number;
          requires_photo_selection?: boolean | null;
          size_description?: string | null;
          sku?: string | null;
          updated_at?: string | null;
        };
        Update: {
          base_price?: number;
          category?:
            | Database["public"]["Enums"]["product_category_enum"]
            | null;
          created_at?: string | null;
          description?: string | null;
          display_order?: number | null;
          is_active?: boolean | null;
          is_package?: boolean | null;
          name?: string;
          product_id?: number;
          requires_photo_selection?: boolean | null;
          size_description?: string | null;
          sku?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          email_address: string | null;
          first_name: string | null;
          id: string;
          last_name: string | null;
          phone_number: string | null;
          updated_at: string | null;
        };
        Insert: {
          email_address?: string | null;
          first_name?: string | null;
          id: string;
          last_name?: string | null;
          phone_number?: string | null;
          updated_at?: string | null;
        };
        Update: {
          email_address?: string | null;
          first_name?: string | null;
          id?: string;
          last_name?: string | null;
          phone_number?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      schools: {
        Row: {
          address: string | null;
          contact_email: string | null;
          contact_person: string | null;
          contact_phone: string | null;
          created_at: string | null;
          school_id: number;
          school_name: string;
          updated_at: string | null;
        };
        Insert: {
          address?: string | null;
          contact_email?: string | null;
          contact_person?: string | null;
          contact_phone?: string | null;
          created_at?: string | null;
          school_id?: number;
          school_name: string;
          updated_at?: string | null;
        };
        Update: {
          address?: string | null;
          contact_email?: string | null;
          contact_person?: string | null;
          contact_phone?: string | null;
          created_at?: string | null;
          school_id?: number;
          school_name?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      student_access_codes: {
        Row: {
          access_code: string;
          claimed_at: string | null;
          claimed_by_client_account_id: string | null;
          code_id: number;
          created_at: string | null;
          event_id: number;
          expires_at: string | null;
          is_claimed: boolean | null;
          student_id: number;
        };
        Insert: {
          access_code: string;
          claimed_at?: string | null;
          claimed_by_client_account_id?: string | null;
          code_id?: number;
          created_at?: string | null;
          event_id: number;
          expires_at?: string | null;
          is_claimed?: boolean | null;
          student_id: number;
        };
        Update: {
          access_code?: string;
          claimed_at?: string | null;
          claimed_by_client_account_id?: string | null;
          code_id?: number;
          created_at?: string | null;
          event_id?: number;
          expires_at?: string | null;
          is_claimed?: boolean | null;
          student_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "student_access_codes_claimed_by_client_account_id_fkey";
            columns: ["claimed_by_client_account_id"];
            isOneToOne: false;
            referencedRelation: "client_accounts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "student_access_codes_event_id_fkey";
            columns: ["event_id"];
            isOneToOne: false;
            referencedRelation: "photo_shoot_events";
            referencedColumns: ["event_id"];
          },
          {
            foreignKeyName: "student_access_codes_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "students";
            referencedColumns: ["student_id"];
          },
        ];
      };
      students: {
        Row: {
          class_id: number | null;
          created_at: string | null;
          parent_cell_on_form: string | null;
          parent_email_on_form: string | null;
          parent_name_on_form: string | null;
          student_id: number;
          student_name: string;
          student_reference_id: string | null;
          updated_at: string | null;
        };
        Insert: {
          class_id?: number | null;
          created_at?: string | null;
          parent_cell_on_form?: string | null;
          parent_email_on_form?: string | null;
          parent_name_on_form?: string | null;
          student_id?: number;
          student_name: string;
          student_reference_id?: string | null;
          updated_at?: string | null;
        };
        Update: {
          class_id?: number | null;
          created_at?: string | null;
          parent_cell_on_form?: string | null;
          parent_email_on_form?: string | null;
          parent_name_on_form?: string | null;
          student_id?: number;
          student_name?: string;
          student_reference_id?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "students_class_id_fkey";
            columns: ["class_id"];
            isOneToOne: false;
            referencedRelation: "classes";
            referencedColumns: ["class_id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_current_user_app_role: {
        Args: Record<PropertyKey, never>;
        Returns: Database["public"]["Enums"]["app_user_role_enum"];
      };
    };
    Enums: {
      app_user_role_enum: "parent" | "photographer_admin" | "school_admin";
      order_status_enum:
        | "pending_payment"
        | "awaiting_photo_selection"
        | "processing"
        | "ready_for_pickup"
        | "shipped"
        | "completed"
        | "cancelled"
        | "payment_failed";
      product_category_enum:
        | "Package"
        | "Photo Print"
        | "Merchandise"
        | "Digital Product"
        | "Calendar";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      app_user_role_enum: ["parent", "photographer_admin", "school_admin"],
      order_status_enum: [
        "pending_payment",
        "awaiting_photo_selection",
        "processing",
        "ready_for_pickup",
        "shipped",
        "completed",
        "cancelled",
        "payment_failed",
      ],
      product_category_enum: [
        "Package",
        "Photo Print",
        "Merchandise",
        "Digital Product",
        "Calendar",
      ],
    },
  },
} as const;
