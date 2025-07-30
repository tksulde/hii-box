interface ModalProps {
  isOpen: boolean;
}

interface DataItem {
  id: number;
  [key: string]: unknown;
}

interface SupportedNFTCollection extends DataItem {
  id: number;
  collection_name: string;
  collection_address: string;
  description?: string;
  image_url?: string;
  website_url?: string;
  created_at?: string;
  updated_at?: string;
}

interface ApiKeyLog extends DataItem {
  id: number;
  user_email: string;
  key: string;
  type: string;
  created_at?: string;
}

interface ApiKey extends DataItem {
  id: number;
  user_id: number;
  user_email: string;
  key: string;
  created_at?: string;
  updated_at?: string;
}

interface Payment extends DataItem {
  id: number;
  user_id: number;
  user_email: string;
  subscription_plan_details?: Record<string, any>;
  subscription_expiry_from?: string;
  subscription_expiry_to?: string;
  created_at?: string;
  updated_at?: string;
}

interface AuthRequest extends DataItem {
  id: number;
  callback_url: string;
  user_id: number;
  user_email: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

interface ExtractRequest extends DataItem {
  id: number;
  callback_url: string;
  user_id: number;
  user_email: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

interface ExtractRequest extends DataItem {
  id: number;
  callback_url: string;
  user_id: number;
  user_email: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

interface SignRequest extends DataItem {
  id: number;
  callback_url: string;
  user_id: number;
  user_email: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

interface SubscriptionPlan extends DataItem {
  id: number;
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
  id: number;
  user_id: number;
  user_email: string;
  expiry_date: "";
  status: "";
  created_at?: string;
  updated_at?: string;
}

interface User extends DataItem {
  id: number;
  wallet_address: string;
  key_count: number;
  created_at?: string;
  updated_at?: string;
}

interface UserPayment {
  id: number;
  user_id: number;
  subscription_plan_details: Record<string, any>;
  created_at?: string;
}

interface Item extends DataItem {
  id: number;
  name: string;
  description: string;
  price?: number;
  category_id: number;
  sub_category_id?: string;
  created_at?: string;
  updated_at?: string;
}

interface Category extends DataItem {
  id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
}

interface SubCategory extends DataItem {
  id: number;
  name: string;
  category_id: number;
  created_at?: string;
  updated_at?: string;
}
