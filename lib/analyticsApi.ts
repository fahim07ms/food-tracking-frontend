import api from "./api";
import {
    SingleDayAnalytics,
    WeeklyAnalytics,
    MonthlyAnalytics,
    SdgImpactReport,
    InventoryExpirationCheck,
    Resource,
} from "./types/analytics";

const ANALYTICS_BASE_URL = "/analytics";
const INVENTORY_BASE_URL = "/inventory";
const RESOURCES_BASE_URL = "/resources";

/**
 * Get single day analytics
 */
export const getSingleDayAnalytics = async (date: string): Promise<SingleDayAnalytics> => {
    const response = await api.post<SingleDayAnalytics>(`${ANALYTICS_BASE_URL}/single-day`, {
        date,
    });
    return response.data;
};

/**
 * Get weekly analytics (7 days starting from startDate)
 */
export const getWeeklyAnalytics = async (startDate: string): Promise<WeeklyAnalytics> => {
    const response = await api.post<WeeklyAnalytics>(`${ANALYTICS_BASE_URL}/weekly`, {
        startDate,
    });
    return response.data;
};

/**
 * Get monthly analytics
 */
export const getMonthlyAnalytics = async (
    year: number,
    month: number
): Promise<MonthlyAnalytics> => {
    const response = await api.post<MonthlyAnalytics>(`${ANALYTICS_BASE_URL}/monthly`, {
        year,
        month,
    });
    return response.data;
};

/**
 * Get SDG impact report
 */
export const getSdgImpactReport = async (startDate: string): Promise<SdgImpactReport> => {
    const response = await api.post<SdgImpactReport>(`${ANALYTICS_BASE_URL}/sdg-impact`, {
        startDate,
    });
    return response.data;
};

/**
 * Get inventory expiration check
 */
export const getInventoryExpirationCheck = async (): Promise<InventoryExpirationCheck> => {
    const response = await api.get<InventoryExpirationCheck>(
        `${INVENTORY_BASE_URL}/expiration-check`
    );
    return response.data;
};

/**
 * Get resource recommendations
 */
export const getResourceRecommendations = async (): Promise<{ recommendations: Resource[]; basedOnTags?: string[]; count?: number }> => {
    const response = await api.get(`${RESOURCES_BASE_URL}/recommendations`);
    return response.data;
};
