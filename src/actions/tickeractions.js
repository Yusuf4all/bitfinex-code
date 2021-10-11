export const getTickerData = () => {};

export const saveTickerData = (tickerData) => {
  return (dispath) => {
    dispath({
      type: "SAVE_TICKER_DATA",
      payload: [...tickerData],
    });
  };
};
