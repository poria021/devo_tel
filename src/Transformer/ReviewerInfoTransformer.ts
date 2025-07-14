import { log } from 'console';
import { ValueTransformer } from 'typeorm';
export const CommentsInfoTransformer: ValueTransformer = {
  to: (entityValue: any) => {
    return {
      countryName: entityValue?.countryName,
      displayMemberName: entityValue?.displayMemberName,
      reviewGroupName: entityValue?.reviewGroupName,
    };
  },
  from: (databaseValue: any) => databaseValue,
};

export const ReviewerInfoTransformer: ValueTransformer = {
  to: (entityValue: any) => {
    return entityValue.map((item) => {
      return {
        name: item?.name,
        score: item?.score,
      };
    });
  },
  from: (databaseValue: any) => databaseValue,
};

export const ReviewerInfoTransformerCount: ValueTransformer = {
  to: (score: any) => score.toFixed(1),
  from: (databaseValue: any) => databaseValue,
};
