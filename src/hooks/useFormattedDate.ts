import { format } from "date-fns";
import { useContext } from "react";
import { SiteContext } from "../contexts/SiteContext";

const fallbackDefaultDateFormat = "MM/dd/yyyy";

export const useFormattedDate = (date: string) => {
  const { siteSettings } = useContext(SiteContext);
  const defaultDateFormat = siteSettings?.DefaultDateFormat.trim();
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
