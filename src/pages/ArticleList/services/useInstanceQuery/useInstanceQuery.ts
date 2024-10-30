import { useQuery } from "react-query";
import z from "zod";

const instanceSchema = z.object({
  default_locale: z.string(),
  locales: z.array(z.string()),
});

const fetchInstance = async () => {
  const response = await fetch("http://localhost:3000/api/instance/", {
    mode: "cors",
  });

  if (!response.ok) {
    throw new Error("Server returned an error");
  }

  const json = await response.json();
  const parsed = instanceSchema.parse(json);

  return {
    defaultLocale: parsed.default_locale,
    locales: parsed.locales,
  };
};

const useInstanceQuery = () => {
  return useQuery({
    queryKey: "instance",
    queryFn: fetchInstance,
    retry: 3,
  });
};

export default useInstanceQuery;
