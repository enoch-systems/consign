export type ShipmentStatus =
  | 'Order Created'
  | 'Confirmed'
  | 'Picked Up'
  | 'In Transit'
  | 'Arrived at Facility'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Exception';

export type ShippingMethod = 'Standard' | 'Express' | 'Premium' | 'International';

export type PackageType = 'Box' | 'Envelope' | 'Pallet' | 'Crate' | 'Tube';

export interface Address {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  country: string;
}

export interface TrackingEvent {
  id: string;
  status: ShipmentStatus;
  location: string;
  date: string;
  time: string;
  description: string;
  state: 'completed' | 'current' | 'upcoming';
}

export interface Shipment {
  id: string;
  trackingNumber: string;
  customerId: string;
  sender: Address;
  recipient: Address;
  origin: string;
  destination: string;
  status: ShipmentStatus;
  currentLocation: string;
  packageType: PackageType;
  weight: number;
  dimensions: string;
  packageCount: number;
  shippingMethod: ShippingMethod;
  cost: number;
  currency: string;
  instructions?: string;
  estimatedDelivery: string;
  createdAt: string;
  lastUpdated: string;
  trackingEvents: TrackingEvent[];
}

export interface Customer {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  password: string;
  address: string;
  country: string;
  state: string;
  city: string;
  createdAt: string;
  lastActive: string;
  accountStatus: 'Active' | 'Suspended' | 'Pending';
}

export type NotificationType =
  | 'shipment_created'
  | 'package_picked_up'
  | 'shipment_in_transit'
  | 'shipment_arrived_facility'
  | 'shipment_out_for_delivery'
  | 'shipment_delivered'
  | 'delivery_exception'
  | 'shipment_confirmed';

export interface Notification {
  id: string;
  customerId: string;
  type: NotificationType;
  title: string;
  message: string;
  shipmentId?: string;
  trackingNumber?: string;
  read: boolean;
  createdAt: string;
}

export type ActivityType =
  | 'admin_logged_in'
  | 'customer_registered'
  | 'shipment_created'
  | 'shipment_status_changed'
  | 'tracking_event_added'
  | 'shipment_delivered'
  | 'customer_updated';

export interface Activity {
  id: string;
  type: ActivityType;
  actor: string;
  action: string;
  referenceId?: string;
  customerId?: string;
  shipmentId?: string;
  details?: string;
  timestamp: string;
}

export interface Session {
  userId: string;
  role: 'customer' | 'admin';
  createdAt: string;
}
