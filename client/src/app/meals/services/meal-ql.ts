import gql from 'graphql-tag';


export const QUERY = {
  GET_FOOD_DATA: gql`query foods{ foods { id description } }`
};

