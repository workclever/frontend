import { useMe } from "./useMe";
import dayjs from "dayjs";
import { useGetSiteSettingsQuery } from "../services/api";

const fallbackDefaultTimezone = "Europe/Amsterdam";
const fallbackDefaultDateTimeFormat = "DD/MM/YYYY HH:mm";

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
    return dayjs.utc(date).tz(finalTimezone).format(finalDateTimeFormat);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    console.error("Error when formatting date:", {
      date,
      finalTimezone,
      finalDateTimeFormat,
    });
    return "invalid-date";
  }
};
