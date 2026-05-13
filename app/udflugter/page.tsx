import { redirect } from "next/navigation";

type RedirectSearchParams = Promise<{
  lang?: string | string[];
}>;

export default async function LegacyExcursionsPage({
  searchParams,
}: {
  searchParams: RedirectSearchParams;
}) {
  const params = await searchParams;
  const language = Array.isArray(params?.lang) ? params.lang[0] : params?.lang;

  redirect(language === "en" ? "/aktiviteter?lang=en" : "/aktiviteter");
}
