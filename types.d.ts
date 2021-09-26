export type Article = {
  abstract: string;
  title: string;
  url: string;
};

export type ArticleList = {
  section: string;
  results: Article[];
};