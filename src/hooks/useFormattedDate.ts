import { useGetSiteSettingsQuery } from "../services/api";
import dayjs from "dayjs";

const fallbackDefaultDateFormat = "DD/MM/YYYY";

export const useFormattedDate = (date: string) => {
  const { data: siteSettings } = useGetSiteSettingsQuery(null);
  const defaultDateFormat = siteSettings?.Data.DefaultDateFormat.trim();

  try {
    return dayjs(date).format(defaultDateFormat || fallbackDefaultDateFormat);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    console.error("Error when formatting date", date);
    return "invalid-date";
  }
};
