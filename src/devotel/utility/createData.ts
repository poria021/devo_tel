import { ConfigService } from "@nestjs/config";

export let createDataForReviewCommentsRequest = (config: ConfigService) => {
  let data = {
    page: 1,
    pageSize: 5,
    sorting: 7,

    filters: {
      language: [],
      room: [],
    },
    searchKeyword: "",
    searchFilters: [],
  };
  let url = config.get<string>("jobs");
  return { data, url };
};
