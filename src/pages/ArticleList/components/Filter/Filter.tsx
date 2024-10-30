import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/16/solid";
import { PropsWithChildren } from "react";

interface Props {
  term: string;
  setTerm: (term: string) => void;
  locale: string;
  setLocale: (locale: string) => void;
  categories: number[];
  setCategories: (categories: number[]) => void;

  availableLocales: string[];
  availableCategories: { id: number; name: Record<string, string> }[];
}

const LOCALE_NAMES: Record<string, string> = {
  en: "English",
  ru: "Русский",
};

const Filter = ({
  term,
  setTerm,
  locale,
  setLocale,
  categories,
  setCategories,
  availableLocales,
  availableCategories,
}: Props) => (
  <Wrapper>
    <form name="search" className="flex flex-col gap-6 ">
      <fieldset>
        <label htmlFor="term" className="mb-2 block text-sm font-semibold">
          Запрос
        </label>

        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-2 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
          <input
            id="term"
            name="term"
            type="text"
            placeholder="Интеграция"
            aria-label="Поисковый запрос"
            className="w-full grow rounded-sm border border-gray-300 py-1 pl-7 pr-3 text-sm"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            autoFocus
          />
        </div>

        <p className="mt-1 text-xs text-gray-800">* Минимум 3 символа</p>
      </fieldset>

      <fieldset>
        <label htmlFor="locale" className="mb-2 block text-sm font-semibold">
          Язык
        </label>

        <div className="relative">
          <select
            id="locale"
            name="locale"
            aria-label="Язык"
            className="w-full appearance-none rounded-sm border border-gray-300 py-1 pl-2 pr-8 text-sm"
            onChange={(e) => setLocale(e.target.value)}
            value={locale}
          >
            {availableLocales.map((item) => (
              <option key={item} value={item}>
                {LOCALE_NAMES[item]}
              </option>
            ))}
          </select>

          <ChevronDownIcon className="absolute right-2 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
        </div>
      </fieldset>

      <fieldset>
        <label className="mb-2 block text-sm font-semibold">Категории</label>

        <div className="flex flex-wrap items-center gap-1">
          {availableCategories.map((category) => (
            <label
              key={category.id}
              className="mr-4 flex cursor-pointer items-center gap-2 text-sm"
            >
              <input
                type="checkbox"
                name={`category-${category.id}`}
                onChange={(e) => {
                  if (e.target.checked) {
                    setCategories([...categories, category.id]);
                  } else {
                    setCategories(
                      categories.filter((item) => item !== category.id)
                    );
                  }
                }}
              />
              {category.name[locale]}
            </label>
          ))}
        </div>
      </fieldset>

      <button
        type="reset"
        className="rounded-sm border border-gray-300 bg-white px-3 py-1 text-sm"
        onClick={() => {
          setTerm("");
          setLocale("");
          setCategories([]);
        }}
      >
        Сбросить Фильтр
      </button>
    </form>
  </Wrapper>
);

const Wrapper = ({ children }: PropsWithChildren) => (
  <div className="rounded-md bg-gray-100 p-6">{children}</div>
);

const Skeleton = () => (
  <Wrapper>
    <div className="min-h-72"></div>
  </Wrapper>
);

Filter.Skeleton = Skeleton;

export default Filter;
