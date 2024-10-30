import { useQuery } from "react-query";
import z from "zod";

const categoriesSchema = z.object({
  results: z.array(
    z.object({
      id: z.number(),
      name: z.record(z.string(), z.string()),
    })
  ),
});

const fetchCategories = async () => {
  /** TODO: Store API URL in .env and paths in some constant. */
  const response = await fetch(
    "http://localhost:3000/api/categories?ordering=name",
    {
      mode: "cors",
    }
  );

  if (!response.ok) {
    throw new Error("Server returned an error");
  }

  const json = await response.json();
  const parsed = categoriesSchema.parse(json);

  return parsed;
};

const useCategoriesQuery = () => {
  return useQuery({
    queryKey: "categories",
    queryFn: fetchCategories,
    retry: 3,
  });
};

export default useCategoriesQuery;
