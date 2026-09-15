'use client';

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import type { Customer, Shipment, Notification, Activity, Session, ShipmentStatus, Address, ShippingMethod, PackageType, NotificationType } from './types';
import { mockCustomers, mockShipments, mockNotifications, mockActivities } from './mock-data';

const STORAGE_KEY = 'logix-app-state-v1';
const SESSION_KEY = 'logix-session-v1';

function uid(prefix = 'id'): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36).slice(-4)}`;
}

function now() {
  return new Date().toISOString();
}

function fmtDateOnly(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}
function fmtTimeOnly(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function randomTrackingNumber(): string {
  const prefixes = ['LGX', 'NG', 'LGS', 'NGX'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const len = prefix === 'NG' || prefix === 'NGX' ? 8 : 7;
  let num = '';
  for (let i = 0; i < len; i++) num += Math.floor(Math.random() * 10);
  return `${prefix}${num}`;
}

const STATUS_ORDER: ShipmentStatus[] = [
  'Order Created',
  'Confirmed',
  'Picked Up',
  'In Transit',
  'Arrived at Facility',
  'Out for Delivery',
  'Delivered',
  'Exception',
];

const STATUS_NOTIF_MAP: Record<Exclude<ShipmentStatus, 'Order Created'>, NotificationType | null> = {
  'Confirmed': 'shipment_confirmed',
  'Picked Up': 'package_picked_up',
  'In Transit': 'shipment_in_transit',
  'Arrived at Facility': 'shipment_arrived_facility',
  'Out for Delivery': 'shipment_out_for_delivery',
  'Delivered': 'shipment_delivered',
  'Exception': 'delivery_exception',
};

const STATUS_NOTIF_TITLE: Record<Exclude<ShipmentStatus, 'Order Created'>, string> = {
  'Confirmed': 'Shipment Confirmed',
  'Picked Up': 'Package Picked Up',
  'In Transit': 'Shipment In Transit',
  'Arrived at Facility': 'Arrived at Facility',
  'Out for Delivery': 'Out for Delivery',
  'Delivered': 'Shipment Delivered',
  'Exception': 'Delivery Exception',
};

interface PersistedState {
  customers: Customer[];
  shipments: Shipment[];
  notifications: Notification[];
  activities: Activity[];
}

const defaultState: PersistedState = {
  customers: [...mockCustomers],
  shipments: [...mockShipments],
  notifications: [...mockNotifications],
  activities: [...mockActivities],
};

function makeStatusDescription(status: ShipmentStatus, location: string, method: ShippingMethod): string {
  switch (status) {
    case 'Order Created': return 'Shipment order created. Awaiting confirmation.';
    case 'Confirmed': return 'Shipment confirmed and label generated.';
    case 'Picked Up': return 'Package picked up from sender address.';
    case 'In Transit': return `In transit via ${method.toLowerCase()} shipping.`;
    case 'Arrived at Facility': return `Arrived at ${location}. Sorted for next step.`;
    case 'Out for Delivery': return `Out for final-mile delivery in ${location}.`;
    case 'Delivered': return 'Delivered successfully and signed off.';
    case 'Exception': return 'Delivery exception detected. Contact support for details.';
  }
}

function applyTrackingStates(events: Shipment['trackingEvents']): Shipment['trackingEvents'] {
  let seenCurrent = false;
  return events
    .slice()
    .sort((a, b) => {
      const aIdx = STATUS_ORDER.indexOf(a.status);
      const bIdx = STATUS_ORDER.indexOf(b.status);
      if (aIdx !== bIdx) return aIdx - bIdx;
      return (a.date + a.time).localeCompare(b.date + b.time);
    })
    .map((ev) => {
      if (!ev.date && !ev.time) return { ...ev, state: 'upcoming' as const };
      if (seenCurrent) return { ...ev, state: 'upcoming' as const };
      const nextIdx = events.findIndex((e) => e.id === ev.id) + 1;
      const hasUpcomingWithNoDate = events.slice(nextIdx).some((e) => !e.date);
      if (hasUpcomingWithNoDate) {
        if (!seenCurrent) {
          seenCurrent = true;
          return { ...ev, state: 'current' as const };
        }
      }
      return { ...ev, state: 'completed' as const };
    });
}

function recomputeTrackingStates(shipments: Shipment[]): Shipment[] {
  return shipments.map((s) => ({ ...s, trackingEvents: applyTrackingStates(s.trackingEvents) }));
}

function initialLoad(): PersistedState {
  if (typeof window === 'undefined') return defaultState;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as PersistedState;
      if (parsed && Array.isArray(parsed.shipments)) {
        return {
          customers: parsed.customers ?? defaultState.customers,
          shipments: recomputeTrackingStates(parsed.shipments ?? defaultState.shipments),
          notifications: parsed.notifications ?? defaultState.notifications,
          activities: parsed.activities ?? defaultState.activities,
        };
      }
    }
  } catch {
    // ignore
  }
  return {
    ...defaultState,
    shipments: recomputeTrackingStates(defaultState.shipments),
  };
}

export interface AppStateContextValue {
  customers: Customer[];
  shipments: Shipment[];
  notifications: Notification[];
  activities: Activity[];
  session: Session | null;
  currentCustomer: Customer | null;

  // Auth
  customerSignup: (data: {
    fullName: string; email: string; phone: string; password: string;
    address: string; country: string; state: string; city: string;
  }) => { success: boolean; error?: string };
  customerLogin: (email: string, password: string) => { success: boolean; error?: string };
  adminLogin: (username: string, password: string) => { success: boolean; error?: string };
  logout: () => void;

  // Lookups
  findShipmentById: (id: string) => Shipment | undefined;
  findShipmentByTracking: (trackingNumber: string) => Shipment | undefined;
  findCustomerById: (id: string) => Customer | undefined;

  // Shipments
  getCustomerShipments: (customerId: string) => Shipment[];
  shipmentsByCustomer: (customerId: string) => Shipment[];
  createShipment: (data: {
    customerId: string;
    sender: Address;
    recipient: Address;
    packageType: PackageType;
    weight: number;
    dimensions: string;
    packageCount: number;
    shippingMethod: ShippingMethod;
    instructions?: string;
    cost: number;
    estimatedDelivery: string;
    origin?: string;
    destination?: string;
    currency?: string;
  }) => Shipment;
  updateShipmentStatus: (shipmentId: string, newStatus: ShipmentStatus, location?: string) => Shipment | null;

  // Notifications
  markNotificationRead: (id: string) => void;
  markAllCustomerNotificationsRead: (customerId: string) => void;
  getCustomerNotifications: (customerId: string) => Notification[];
  notificationsByCustomer: (customerId: string) => Notification[];
  unreadCount: (customerId: string) => number;

  // Profile / customer mutations
  updateCustomerProfile: (customerId: string, patch: Partial<Omit<Customer, 'id' | 'password' | 'createdAt'>>) => { success: boolean; error?: string };

  // Helpers
  recentActivity: (limit?: number) => Activity[];
  shipmentStatsByCustomer: (customerId: string) => { total: number; active: number; delivered: number; pending: number; exception: number };
  adminStats: () => {
    totalUsers: number;
    totalShipments: number;
    active: number;
    pending: number;
    inTransit: number;
    outForDelivery: number;
    delivered: number;
    exception: number;
    revenue: number;
    topDestinations: { name: string; count: number }[];
    monthlyVolume: { month: string; count: number; shipments: number; revenue: number; customers: number }[];
    deliveryPerformance: { onTime: number; late: number; rate: number };
    successRate: number;
    exceptionRate: number;
    avgDeliveryDays: number;
  };
}

const AppStateContext = createContext<AppStateContextValue | null>(null);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PersistedState>(() => initialLoad());
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem(SESSION_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Session;
        if (parsed && parsed.userId) setSession(parsed);
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (session) window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    else window.localStorage.removeItem(SESSION_KEY);
  }, [session]);

  const currentCustomer = useMemo(
    () => (session?.role === 'customer' ? state.customers.find((c) => c.id === session.userId) ?? null : null),
    [session, state.customers],
  );

  const addActivity = useCallback((prev: PersistedState, act: Omit<Activity, 'id' | 'timestamp'>): PersistedState => {
    const newAct: Activity = { id: uid('act'), timestamp: now(), ...act };
    return { ...prev, activities: [newAct, ...prev.activities].slice(0, 500) };
  }, []);

  const addNotification = useCallback((prev: PersistedState, notif: Omit<Notification, 'id' | 'createdAt' | 'read'>): PersistedState => {
    const n: Notification = { id: uid('notif'), read: false, createdAt: now(), ...notif };
    return { ...prev, notifications: [n, ...prev.notifications] };
  }, []);

  const customerSignup: AppStateContextValue['customerSignup'] = (data) => {
    const exists = state.customers.find((c) => c.email.toLowerCase() === data.email.toLowerCase());
    if (exists) return { success: false, error: 'An account with this email already exists.' };
    const customer: Customer = {
      id: uid('cust'),
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      password: data.password,
      address: data.address,
      country: data.country,
      state: data.state,
      city: data.city,
      createdAt: now(),
      lastActive: now(),
      accountStatus: 'Active',
    };
    setState((prev) => addActivity({ ...prev, customers: [...prev.customers, customer] }, {
      type: 'customer_registered',
      actor: 'System',
      action: `New customer registered: ${customer.fullName}`,
      customerId: customer.id,
      referenceId: customer.id,
    }));
    setSession({ userId: customer.id, role: 'customer', createdAt: now() });
    return { success: true };
  };

  const customerLogin: AppStateContextValue['customerLogin'] = (email, password) => {
    const user = state.customers.find((c) => c.email.toLowerCase() === email.toLowerCase() && c.password === password);
    if (!user) return { success: false, error: 'Invalid email or password.' };
    setState((prev) => ({
      ...prev,
      customers: prev.customers.map((c) => (c.id === user.id ? { ...c, lastActive: now() } : c)),
    }));
    setSession({ userId: user.id, role: 'customer', createdAt: now() });
    return { success: true };
  };

  const adminLogin: AppStateContextValue['adminLogin'] = (username, password) => {
    if (username.trim().toLowerCase() === 'admin' && password === 'admin') {
      setSession({ userId: 'admin', role: 'admin', createdAt: now() });
      setState((prev) => addActivity(prev, {
        type: 'admin_logged_in',
        actor: 'Admin',
        action: 'Admin logged in to dashboard',
      }));
      return { success: true };
    }
    return { success: false, error: 'Invalid admin credentials.' };
  };

  const logout = () => setSession(null);

  const findShipmentById = (id: string) => state.shipments.find((s) => s.id === id);
  const findShipmentByTracking = (trackingNumber: string) =>
    state.shipments.find((s) => s.trackingNumber.toLowerCase() === trackingNumber.trim().toLowerCase());
  const findCustomerById = (id: string) => state.customers.find((c) => c.id === id);

  const getCustomerShipments = (customerId: string) =>
    state.shipments
      .filter((s) => s.customerId === customerId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const shipmentsByCustomer = getCustomerShipments;

  const createShipment: AppStateContextValue['createShipment'] = (data) => {
    const created = now();
    const origin = data.origin ?? `${data.sender.city}, ${data.sender.country}`;
    const destination = data.destination ?? `${data.recipient.city}, ${data.recipient.country}`;
    const currency = data.currency ?? 'USD';
    const trackingNumber = randomTrackingNumber();
    const shipment: Shipment = {
      id: uid('ship'),
      trackingNumber,
      customerId: data.customerId,
      sender: data.sender,
      recipient: data.recipient,
      origin,
      destination,
      status: 'Order Created',
      currentLocation: origin,
      packageType: data.packageType,
      weight: data.weight,
      dimensions: data.dimensions,
      packageCount: data.packageCount,
      shippingMethod: data.shippingMethod,
      cost: data.cost,
      currency,
      instructions: data.instructions,
      estimatedDelivery: data.estimatedDelivery,
      createdAt: created,
      lastUpdated: created,
      trackingEvents: applyTrackingStates([
        {
          id: uid('te'),
          status: 'Order Created',
          location: data.sender.city,
          date: fmtDateOnly(created),
          time: fmtTimeOnly(created),
          description: makeStatusDescription('Order Created', data.sender.city, data.shippingMethod),
          state: 'current',
        },
        { id: uid('te'), status: 'Confirmed', location: data.sender.city, date: '', time: '', description: makeStatusDescription('Confirmed', data.sender.city, data.shippingMethod), state: 'upcoming' },
        { id: uid('te'), status: 'Picked Up', location: data.sender.city, date: '', time: '', description: makeStatusDescription('Picked Up', data.sender.city, data.shippingMethod), state: 'upcoming' },
        { id: uid('te'), status: 'In Transit', location: `${data.sender.city} → ${data.recipient.city}`, date: '', time: '', description: makeStatusDescription('In Transit', destination, data.shippingMethod), state: 'upcoming' },
        { id: uid('te'), status: 'Arrived at Facility', location: `${data.recipient.city} Distribution Center`, date: '', time: '', description: makeStatusDescription('Arrived at Facility', data.recipient.city, data.shippingMethod), state: 'upcoming' },
        { id: uid('te'), status: 'Out for Delivery', location: data.recipient.city, date: '', time: '', description: makeStatusDescription('Out for Delivery', data.recipient.city, data.shippingMethod), state: 'upcoming' },
        { id: uid('te'), status: 'Delivered', location: data.recipient.city, date: '', time: '', description: makeStatusDescription('Delivered', data.recipient.city, data.shippingMethod), state: 'upcoming' },
      ]),
    };

    setState((prev) => {
      let next: PersistedState = { ...prev, shipments: [shipment, ...prev.shipments] };
      next = addActivity(next, {
        type: 'shipment_created',
        actor: state.customers.find((c) => c.id === data.customerId)?.fullName ?? 'Customer',
        action: `Shipment ${shipment.trackingNumber} created (${shipment.origin.split(',')[0]} → ${shipment.destination.split(',')[0]})`,
        customerId: data.customerId,
        shipmentId: shipment.id,
        referenceId: shipment.trackingNumber,
      });
      next = addNotification(next, {
        customerId: data.customerId,
        type: 'shipment_created',
        title: 'Shipment Created',
        message: `Your shipment ${shipment.trackingNumber} has been created successfully.`,
        shipmentId: shipment.id,
        trackingNumber: shipment.trackingNumber,
      });
      return next;
    });

    return shipment;
  };

  const updateShipmentStatus: AppStateContextValue['updateShipmentStatus'] = (shipmentId, newStatus, locationOverride) => {
    const shipment = state.shipments.find((s) => s.id === shipmentId);
    if (!shipment) return null;

    const timestamp = now();
    const currentIdx = STATUS_ORDER.indexOf(shipment.status);
    const newIdx = STATUS_ORDER.indexOf(newStatus);
    const currentLocation = locationOverride ?? shipment.currentLocation;

    // Update events: for statuses up to and including newStatus, fill dates/times
    let newEvents = shipment.trackingEvents.map((ev) => {
      const evIdx = STATUS_ORDER.indexOf(ev.status);
      if (ev.status === newStatus) {
        const loc = locationOverride ?? ev.location;
        return {
          ...ev,
          location: loc,
          date: fmtDateOnly(timestamp),
          time: fmtTimeOnly(timestamp),
          description: ev.status === 'Exception'
            ? 'Delivery exception detected. Operations team notified.'
            : makeStatusDescription(ev.status, loc, shipment.shippingMethod),
          state: 'current' as const,
        };
      }
      if (evIdx < newIdx && evIdx > currentIdx) {
        // auto-fill skipped intermediate statuses with small offsets so timeline has data
        const offsetMs = (evIdx - currentIdx) * 3600_000;
        const d = new Date(new Date(timestamp).getTime() - (newIdx - evIdx) * 3600_000 - offsetMs);
        const iso = d.toISOString();
        const loc = locationOverride ?? ev.location;
        return {
          ...ev,
          location: loc,
          date: fmtDateOnly(iso),
          time: fmtTimeOnly(iso),
          description: makeStatusDescription(ev.status, loc, shipment.shippingMethod),
          state: 'completed' as const,
        };
      }
      if (evIdx < newIdx) return { ...ev, state: 'completed' as const };
      if (ev.status === newStatus) return { ...ev, state: 'current' as const };
      return ev;
    });
    newEvents = applyTrackingStates(newEvents);

    const updated: Shipment = {
      ...shipment,
      status: newStatus,
      currentLocation,
      lastUpdated: timestamp,
      trackingEvents: newEvents,
    };

    setState((prev) => {
      let next: PersistedState = {
        ...prev,
        shipments: prev.shipments.map((s) => (s.id === shipmentId ? updated : s)),
      };
      next = addActivity(next, {
        type: 'shipment_status_changed',
        actor: 'Admin',
        action: `Shipment ${shipment.trackingNumber} updated to ${newStatus}`,
        shipmentId: updated.id,
        referenceId: shipment.trackingNumber,
        details: `from: ${shipment.status} → to: ${newStatus}`,
      });
      next = addActivity(next, {
        type: 'tracking_event_added',
        actor: 'Admin',
        action: `Tracking event added to ${shipment.trackingNumber} (${newStatus})`,
        shipmentId: updated.id,
        referenceId: shipment.trackingNumber,
      });
      if (newStatus === 'Delivered') {
        next = addActivity(next, {
          type: 'shipment_delivered',
          actor: 'System',
          action: `Shipment ${shipment.trackingNumber} delivered successfully`,
          shipmentId: updated.id,
          referenceId: shipment.trackingNumber,
        });
      }
      const notifType = STATUS_NOTIF_MAP[newStatus as Exclude<ShipmentStatus, 'Order Created'>];
      if (notifType) {
        next = addNotification(next, {
          customerId: shipment.customerId,
          type: notifType,
          title: STATUS_NOTIF_TITLE[newStatus as Exclude<ShipmentStatus, 'Order Created'>],
          message: `Shipment ${shipment.trackingNumber} status updated to ${newStatus}.`,
          shipmentId: updated.id,
          trackingNumber: shipment.trackingNumber,
        });
      }
      return next;
    });

    return updated;
  };

  const markNotificationRead = (id: string) => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    }));
  };

  const markAllCustomerNotificationsRead = (customerId: string) => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) =>
        n.customerId === customerId && !n.read ? { ...n, read: true } : n,
      ),
    }));
  };

  const getCustomerNotifications = (customerId: string) =>
    state.notifications
      .filter((n) => n.customerId === customerId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const notificationsByCustomer = getCustomerNotifications;

  const unreadCount = (customerId: string) =>
    state.notifications.filter((n) => n.customerId === customerId && !n.read).length;

  const updateCustomerProfile: AppStateContextValue['updateCustomerProfile'] = (customerId, patch) => {
    const cust = state.customers.find((c) => c.id === customerId);
    if (!cust) return { success: false, error: 'Customer not found.' };
    setState((prev) => {
      let next: PersistedState = {
        ...prev,
        customers: prev.customers.map((c) => (c.id === customerId ? { ...c, ...patch, lastActive: now() } : c)),
      };
      next = addActivity(next, {
        type: 'customer_updated',
        actor: (session?.role === 'admin' ? 'Admin' : cust.fullName) ?? 'Customer',
        action: `Customer profile updated for ${cust.fullName}`,
        customerId,
        referenceId: customerId,
      });
      return next;
    });
    return { success: true };
  };

  const recentActivity = (limit = 20) =>
    [...state.activities]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);

  const shipmentStatsByCustomer = (customerId: string) => {
    const list = state.shipments.filter((s) => s.customerId === customerId);
    return {
      total: list.length,
      active: list.filter((s) =>
        ['Confirmed', 'Picked Up', 'In Transit', 'Arrived at Facility', 'Out for Delivery'].includes(s.status),
      ).length,
      delivered: list.filter((s) => s.status === 'Delivered').length,
      pending: list.filter((s) => s.status === 'Order Created').length,
      exception: list.filter((s) => s.status === 'Exception').length,
    };
  };

  const adminStats: AppStateContextValue['adminStats'] = () => {
    const shipments = state.shipments;
    const totalUsers = state.customers.length;
    const totalShipments = shipments.length;
    const active = shipments.filter((s) => ['Confirmed', 'Picked Up', 'In Transit', 'Arrived at Facility', 'Out for Delivery'].includes(s.status)).length;
    const pending = shipments.filter((s) => s.status === 'Order Created').length;
    const inTransit = shipments.filter((s) => s.status === 'In Transit').length;
    const outForDelivery = shipments.filter((s) => s.status === 'Out for Delivery').length;
    const delivered = shipments.filter((s) => s.status === 'Delivered').length;
    const exception = shipments.filter((s) => s.status === 'Exception').length;
    const revenue = shipments.reduce((sum, s) => sum + s.cost, 0);

    const destCounts = new Map<string, number>();
    shipments.forEach((s) => {
      const d = s.destination.split(',')[0].trim();
      destCounts.set(d, (destCounts.get(d) ?? 0) + 1);
    });
    const topDestinations = Array.from(destCounts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyCountMap = new Map<string, number>();
    const monthlyRevMap = new Map<string, number>();
    const monthlyCustMap = new Map<string, number>();
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const k = `${months[d.getMonth()]} ${d.getFullYear()}`;
      monthlyCountMap.set(k, 0);
      monthlyRevMap.set(k, 0);
      monthlyCustMap.set(k, 0);
    }
    shipments.forEach((s) => {
      const d = new Date(s.createdAt);
      const k = `${months[d.getMonth()]} ${d.getFullYear()}`;
      if (monthlyCountMap.has(k)) {
        monthlyCountMap.set(k, (monthlyCountMap.get(k) ?? 0) + 1);
        monthlyRevMap.set(k, (monthlyRevMap.get(k) ?? 0) + s.cost);
      }
    });
    state.customers.forEach((c) => {
      const d = new Date(c.createdAt);
      const k = `${months[d.getMonth()]} ${d.getFullYear()}`;
      if (monthlyCustMap.has(k)) monthlyCustMap.set(k, (monthlyCustMap.get(k) ?? 0) + 1);
    });
    const monthlyVolume = Array.from(monthlyCountMap.entries()).map(([month, count]) => ({
      month,
      count,
      shipments: count,
      revenue: monthlyRevMap.get(month) ?? 0,
      customers: monthlyCustMap.get(month) ?? 0,
    }));

    const deliveredShips = shipments.filter((s) => s.status === 'Delivered');
    const onTime = deliveredShips.filter((s) => new Date(s.lastUpdated) <= new Date(s.estimatedDelivery)).length;
    const late = deliveredShips.length - onTime;
    const rate = deliveredShips.length ? Math.round((onTime / deliveredShips.length) * 100) : 94;

    const successRate = rate;
    const exceptionRate = totalShipments ? Math.round((exception / totalShipments) * 1000) / 10 : 2;
    let avgDeliveryDays = 4;
    if (deliveredShips.length) {
      const totalDays = deliveredShips.reduce((sum, s) => {
        const diffMs = new Date(s.lastUpdated).getTime() - new Date(s.createdAt).getTime();
        const days = Math.max(1, Math.round(diffMs / (1000 * 60 * 60 * 24)));
        return sum + days;
      }, 0);
      avgDeliveryDays = Math.round((totalDays / deliveredShips.length) * 10) / 10;
    }

    return {
      totalUsers, totalShipments, active, pending, inTransit, outForDelivery,
      delivered, exception, revenue, topDestinations, monthlyVolume,
      deliveryPerformance: { onTime, late: Math.max(late, 1), rate },
      successRate,
      exceptionRate,
      avgDeliveryDays,
    };
  };

  const value: AppStateContextValue = {
    customers: state.customers,
    shipments: state.shipments,
    notifications: state.notifications,
    activities: state.activities,
    session,
    currentCustomer,
    customerSignup,
    customerLogin,
    adminLogin,
    logout,
    findShipmentById,
    findShipmentByTracking,
    findCustomerById,
    getCustomerShipments,
    shipmentsByCustomer,
    createShipment,
    updateShipmentStatus,
    markNotificationRead,
    markAllCustomerNotificationsRead,
    getCustomerNotifications,
    notificationsByCustomer,
    unreadCount,
    updateCustomerProfile,
    recentActivity,
    shipmentStatsByCustomer,
    adminStats,
  };

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider');
  return ctx;
}
