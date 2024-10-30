import { QueryClient, QueryClientProvider } from "react-query";

import ArticleList from "./pages/ArticleList";

const App = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <main className="mx-auto max-w-[960px] py-12">
        <ArticleList />
      </main>
    </QueryClientProvider>
  );
};

export default App;
