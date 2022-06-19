import { useMe } from "./useMe";
import { formatInTimeZone } from "date-fns-tz";
import { parseJSON } from "date-fns";
import { useContext } from "react";
import { SiteContext } from "../contexts/SiteContext";

const fallbackDefaultTimezone = "Europe/Amsterdam";
const fallbackDefaultDateTimeFormat = "yyyy-MM-dd HH:mm:ss";

export const useFormattedDateTime = (date: string) => {
  const { me } = useMe();
  const userTimezone = me?.Preferences.Timezone.trim();
  const { siteSettings } = useContext(SiteContext);
  const defaultSiteTimezone = siteSettings?.DefaultTimezone.trim();
  const defaultDateTimeFormat = siteSettings?.DefaultDateTimeFormat.trim();

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
    console.error("Error when formatting date", date);
    console.log("useFormattedDateTime Timezone", finalTimezone);
    console.log("useFormattedDateTime Date format", finalDateTimeFormat);
    return "invalid-date";
  }
};
