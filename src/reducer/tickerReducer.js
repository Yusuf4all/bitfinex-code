const inintialState = {
  tickerData: [],
};

const tickerReducer = (state = inintialState, action) => {
  const { type } = action;
  switch (type) {
    case "SAVE_TICKER_DATA":
      return { ...state, tickerData: action.payload };
    default:
      return state;
  }
};

export default tickerReducer;
