import { redirect } from "next/navigation";

type RootPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function RootPage({ searchParams }: RootPageProps) {
  const params = await searchParams;
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      for (const item of value) query.append(key, item);
      continue;
    }
    query.set(key, value);
  }

  const queryString = query.toString();
  redirect(queryString ? `/vi?${queryString}` : "/vi");
}
