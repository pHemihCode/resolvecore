// lib/api/widget-api.ts
import type {
  WidgetConfig,
  CreateTicketInput,
  TicketStatusResponse,
  ApiResponse,
} from "@/types/widget";

const API_BASE = "/api/widget";

/**
 * Fetch widget configuration by widget key
 */
export async function fetchWidgetConfig(
  widgetKey: string
): Promise<ApiResponse<WidgetConfig>> {
  try {
    const response = await fetch(
      `${API_BASE}/config?key=${encodeURIComponent(widgetKey)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || "Failed to load widget configuration",
      };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error fetching widget config:", error);
    return {
      success: false,
      error: "Network error. Please check your connection.",
    };
  }
}

/**
 * Create a new support ticket
 */
export async function createTicket(
  input: CreateTicketInput
): Promise<ApiResponse<{ ticketId: string }>> {
  try {
    const response = await fetch(`${API_BASE}/tickets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    const data = await response.json();

    if (response.status === 429) {
      return {
        success: false,
        error: `Too many requests. Please try again in ${data.retryAfter || 60} seconds.`,
      };
    }

    if (!response.ok) {
      return {
        success: false,
        error: data.error || "Failed to create ticket",
        details: data.details,
      };
    }

    return { success: true, data: { ticketId: data.ticketId } };
  } catch (error) {
    console.error("Error creating ticket:", error);
    return {
      success: false,
      error: "Network error. Please check your connection.",
    };
  }
}

/**
 * Check ticket status by ticket ID and email
 */
export async function checkTicketStatus(
  ticketId: string,
  email: string
): Promise<ApiResponse<TicketStatusResponse>> {
  try {
    const params = new URLSearchParams({
      ticketId: ticketId.trim(),
      email: email.trim().toLowerCase(),
    });

    const response = await fetch(`${API_BASE}/tickets/status?${params}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || "Ticket not found",
      };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error checking ticket status:", error);
    return {
      success: false,
      error: "Network error. Please check your connection.",
    };
  }
}