interface ModalProps {
  isOpen: boolean;
}

interface DataItem {
  id: string | number;
  [key: string]: unknown;
}

interface AccessLog extends DataItem {
  id: string;
  endpoint: string;
  method: string;
  status_code: number;
  api_key_id?: string;
  data?: Record<string, any>;
  query_params?: Record<string, any>;
  headers?: Record<string, any>;
  duration_ms?: number;
  ip_address?: string;
  user_agent?: string;
  created_at?: string;
}

interface ApiKeyLog extends DataItem {
  id: string;
  user_email: string;
  key: string;
  type: string;
  created_at?: string;
}

interface ApiKey extends DataItem {
  id: string;
  user_id: string;
  user_email: string;
  key: string;
  created_at?: string;
  updated_at?: string;
}

interface Payment extends DataItem {
  id: string;
  user_id: string;
  user_email: string;
  subscription_plan_details?: Record<string, any>;
  subscription_expiry_from?: string;
  subscription_expiry_to?: string;
  created_at?: string;
  updated_at?: string;
}

interface AuthRequest extends DataItem {
  id: string;
  callback_url: string;
  user_id: string;
  user_email: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

interface ExtractRequest extends DataItem {
  id: string;
  callback_url: string;
  user_id: string;
  user_email: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

interface ExtractRequest extends DataItem {
  id: string;
  callback_url: string;
  user_id: string;
  user_email: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

interface SignRequest extends DataItem {
  id: string;
  callback_url: string;
  user_id: string;
  user_email: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

interface SubscriptionPlan extends DataItem {
  id: string;
  plan_name?: string;
  price?: number;
  years?: number;
  months?: number;
  days?: number;
  description?: string;
  visible?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface UserSubscription extends DataItem {
  id: string;
  user_id: string;
  user_email: string;
  expiry_date: "";
  status: "";
  created_at?: string;
  updated_at?: string;
}

interface User extends DataItem {
  id: string;
  email: string;
  role: string;
  is_verified: boolean;
  created_at?: string;
  updated_at?: string;
}

interface UserPayment {
  id: string;
  user_id: string;
  subscription_plan_details: Record<string, any>;
  created_at?: string;
}

interface Item extends DataItem {
  id: string;
  name: string;
  description: string;
  price?: number;
  category_id: string;
  sub_category_id?: string;
  created_at?: string;
  updated_at?: string;
}

interface Category extends DataItem {
  id: string;
  name: string;
  created_at?: string;
  updated_at?: string;
}

interface SubCategory extends DataItem {
  id: string;
  name: string;
  category_id: string;
  created_at?: string;
  updated_at?: string;
}
