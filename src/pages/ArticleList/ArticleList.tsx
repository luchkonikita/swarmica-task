import { useState, type PropsWithChildren } from "react";
import { useDebounce } from "use-debounce";
import { ArrowPathIcon, WindowIcon } from "@heroicons/react/16/solid";

import useArticleListQuery from "./services/useArticleListQuery";
import useCategoriesQuery from "./services/useCategoriesQuery";
import useInstanceQuery from "./services/useInstanceQuery";
import Article from "./components/Article";
import Filter from "./components/Filter";

import "./ArticleList.css";

const ArticleList = () => {
  /** Default locale must be available in the upper scope already, so this hardcoded value won't be needed. */
  const [locale, setLocale] = useState<string>("ru");
  const [categories, setCategories] = useState<number[]>([]);
  const [term, setTerm] = useState("");
  const [debouncedTerm] = useDebounce(term, 150);

  const { isLoading: isInstanceLoading, data: instanceData } =
    useInstanceQuery();

  const {
    isIdle: isArticleListIdle,
    isLoading: isArticleListLoading,
    data: articleListData,
  } = useArticleListQuery({
    term: debouncedTerm,
    locale,
    categories,
  });

  const { isLoading: isCategoriesLoading, data: categoriesData } =
    useCategoriesQuery();

  let filter = <></>;
  let content = <></>;

  if (isInstanceLoading || isCategoriesLoading) {
    /** TODO: The skeleton needs a better appearance. */
    filter = <Filter.Skeleton />;
  } else if (instanceData && categoriesData) {
    filter = (
      <Filter
        term={term}
        setTerm={setTerm}
        locale={locale || instanceData?.defaultLocale}
        setLocale={setLocale}
        categories={categories}
        setCategories={setCategories}
        availableLocales={instanceData.locales}
        availableCategories={categoriesData.results}
      />
    );
  } else {
    /** TODO: Filter needs a dedicated failure state ideally. */
    filter = <>Невозможно загрузить фильтр</>;
  }

  if (isArticleListLoading) {
    content = <Skeleton />;
  } else if (articleListData?.results?.length === 0) {
    content = <EmptyState />;
  } else if (articleListData) {
    content = (
      <ul className="flex flex-col gap-4 text-base">
        {articleListData.results.map((result, index) => (
          <li key={`${result.id}/${index}`}>
            <Article
              title={result.highlight.title}
              body={result.highlight.body}
            />
          </li>
        ))}
      </ul>
    );
  } else if (isArticleListIdle) {
    content = <Placeholder />;
  } else {
    content = <ErrorState />;
  }

  return (
    <div className="flex items-stretch gap-8">
      <div className="shrink-0 grow-0 basis-64">
        <div className="sticky top-4 flex flex-col gap-4">
          <header className="flex items-center justify-between">
            <h1 className="text-lg">
              Статьи
              {articleListData ? ` (${articleListData.results.length})` : ""}
            </h1>
          </header>

          {filter}
        </div>
      </div>

      <div className="ArticleList relative min-h-56 grow">{content}</div>
    </div>
  );
};

const Placeholder = () => (
  <Wrapper>
    <WindowIcon className="size-8" />
    <header>Введите запрос для поиска (минимум 3 символа)</header>
  </Wrapper>
);

const EmptyState = () => (
  <Wrapper>
    <WindowIcon className="size-8" />
    <header>По вашему запросу ничего не найдено</header>
  </Wrapper>
);

const Skeleton = () => (
  <Wrapper>
    <ArrowPathIcon className="size-8 animate-spin" />
    <header>Загружаем данные</header>
  </Wrapper>
);

const ErrorState = () => <Wrapper>Невозможно загрузить данные</Wrapper>;

const Wrapper = ({ children }: PropsWithChildren) => (
  <div className="flex size-full min-h-72 items-center justify-center gap-4 text-gray-700">
    {children}
  </div>
);

export default ArticleList;
