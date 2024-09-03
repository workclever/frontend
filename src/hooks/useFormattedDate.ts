import { format } from "date-fns";
import { useGetSiteSettingsQuery } from "../services/api";

const fallbackDefaultDateFormat = "MM/dd/yyyy";

export const useFormattedDate = (date: string) => {
  const { data: siteSettings } = useGetSiteSettingsQuery(null);
  const defaultDateFormat = siteSettings?.Data.DefaultDateFormat.trim();
  try {
    return format(
      new Date(date),
      defaultDateFormat || fallbackDefaultDateFormat
    );
  } catch (e) {
    console.error("Error when formatting date", date);
    return "invalid-date";
  }
};
