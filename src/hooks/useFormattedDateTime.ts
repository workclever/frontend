import { useMe } from "./useMe";
// @ts-ignore
import { formatInTimeZone } from "date-fns-tz";
import { parseJSON } from "date-fns";
import { useGetSiteSettingsQuery } from "../services/api";

const fallbackDefaultTimezone = "Europe/Amsterdam";
const fallbackDefaultDateTimeFormat = "yyyy-MM-dd HH:mm:ss";

export const useFormattedDateTime = (date: string) => {
  const { me } = useMe();
  const userTimezone = me?.Preferences.Timezone.trim();
  const { data: siteSettings } = useGetSiteSettingsQuery(null);
  const defaultSiteTimezone = siteSettings?.Data.DefaultTimezone.trim();
  const defaultDateTimeFormat = siteSettings?.Data.DefaultDateTimeFormat.trim();

  const finalTimezone =
    userTimezone || defaultSiteTimezone || fallbackDefaultTimezone;
  const finalDateTimeFormat =
    defaultDateTimeFormat || fallbackDefaultDateTimeFormat;

  try {
    return formatInTimeZone(
      parseJSON(date),
      finalTimezone,
      finalDateTimeFormat
    );
  } catch (e) {
    console.error("Error when formatting date:", {
      date,
      finalTimezone,
      finalDateTimeFormat,
    });
    return "invalid-date";
  }
};
