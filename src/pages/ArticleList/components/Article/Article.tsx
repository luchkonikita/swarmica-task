import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";

import "./Article.css";

interface Props {
  title: string;
  body: string;
}

/** This component might be loaded lazily to avoid pulling all the markdown dependencies at the page load time. */
const Article = ({ title, body }: Props) => {
  return (
    <div className="Article flex flex-col gap-2">
      <h2 className="text-lg">
        <a href="#" className="text-blue-500">
          <Markdown
            rehypePlugins={[rehypeRaw]}
            components={{ img: () => null }}
            disallowedElements={["p"]}
            unwrapDisallowed
          >
            {title}
          </Markdown>
        </a>
      </h2>

      <div className="line-clamp-5 max-h-32 overflow-y-hidden text-sm">
        <Markdown rehypePlugins={[rehypeRaw]} components={{ img: () => null }}>
          {body}
        </Markdown>
      </div>
    </div>
  );
};

export default Article;
