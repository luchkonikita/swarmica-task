import { useQuery } from "react-query";
import z from "zod";

interface Variables {
  term: string;
  locale?: string;
  categories: number[];
}

const articleListSchema = z.object({
  previous: z.string().nullable(),
  next: z.string().nullable(),
  results: z.array(
    z.object({
      id: z.number(),
      highlight: z.object({
        title: z.string(),
        body: z.string(),
      }),
      public_urls: z.record(z.string(), z.string()),
    })
  ),
});

const fetchArticleList = async (variables: Variables) => {
  if (variables.term.length < 1) {
    throw new Error("`term` parameter cannot be empty");
  }

  const params = new URLSearchParams();

  params.append("search", variables.term);

  if (variables.locale) {
    params.append("locale", variables.locale);
  }

  if (variables.categories.length > 0) {
    params.append("category", variables.categories.join(","));
  }

  const response = await fetch(
    `http://localhost:3000/api/search/articles/?${params.toString()}`,
    { mode: "cors" }
  );

  if (!response.ok) {
    throw new Error("Server returned an error");
  }

  const json = await response.json();
  const parsed = articleListSchema.parse(json);

  return {
    ...parsed,
    results: parsed.results.map((result) => ({
      ...result,
      publicUrls: result.public_urls,
    })),
  };
};

const useArticleListQuery = (variables: Variables) => {
  return useQuery({
    queryKey: ["articleList", variables],
    queryFn: () => fetchArticleList(variables),
    enabled: variables.term.length >= 3,
    retry: 3,
  });
};

export default useArticleListQuery;
