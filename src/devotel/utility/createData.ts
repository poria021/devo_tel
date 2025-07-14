import { ConfigService } from '@nestjs/config';

export let createDataForReviewCommentsRequest = (
  cruel_hotel_id: number,
  config: ConfigService,
) => {
  let data = {
    hotelId: cruel_hotel_id,
    demographicId: 0,
    page: 1,
    pageSize: 5,
    sorting: 7,
    isReviewPage: false,
    isCrawlablePage: false,
    filters: {
      language: [],
      room: [],
    },
    searchKeyword: '',
    searchFilters: [],
  };
  let url = config.get<string>('AgodaComments');
  return { data, url };
};

export let createDataForHotelReviewsRequest = (
  cruel_hotel_id: number,
  config: ConfigService,
) => {
  let data = {
    hotelId: cruel_hotel_id,
    demographicId: 0,
    pageNo: 1,
    pageSize: 5,
    sorting: 7,
  };
  let url = config.get<string>('AgodaReviews');
  return { data, url };
};
