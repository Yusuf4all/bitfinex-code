import React, { useEffect, useState } from "react";
import "./ticker.css";
import { saveTickerData } from "../../actions/tickeractions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { toast } from "react-toastify";

function Ticker({ saveTickerData, tickerData }) {
  const [socket, setSocket] = useState({});
  const [tickerValues, setTickerData] = useState([]);
  useEffect(() => {
    const socket = new WebSocket("wss://api-pub.bitfinex.com/ws/2");
    setSocket(socket);
  }, []);

  useEffect(() => {
    initializeWebSocket();
  }, [socket]);

  const initializeWebSocket = () => {
    try {
      const msg = JSON.stringify({
        event: "subscribe",
        channel: "ticker",
        symbol: "tBTCUSD",
      });
      socket.onopen = () => {
        toast.success("Connected", {
          position: "top-right",
        });
        socket.send(msg);
      };
      socket.onmessage = (evt) => {
        const message = JSON.parse(evt.data);
        if (message && message.length > 0 && Array.isArray(message[1])) {
          saveTickerData(message[1]);
        }
      };
      socket.onclose = function (evt) {
        toast.error("Disconnected", {
          position: "top-right",
        });
      };
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setTickerData([...tickerData]);
  }, [tickerData]);

  const handleConnect = (e) => {
    if (socket.readyState !== WebSocket.OPEN) {
      const sk = new WebSocket("wss://api-pub.bitfinex.com/ws/2");
      setSocket(sk);
      initializeWebSocket();
    } else {
      toast.info("Already Connected");
    }
  };

  const handleDisconnect = (e) => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.close();
    } else {
      toast.info("Already Disconnected");
    }
  };

  console.log(tickerData);

  return (
    <div className="ticker-style">
      <div className="ticker-body-Style p-2">
        <div className="Container">
          <div className="row">
            <div className="col-1">
              <div className="logo d-flex justify-content-start">
                <img src="/image/bitcoin.png" alt="Bit coin" />
              </div>
            </div>
            <div className="col-6">
              <div className="left-content d-flex justify-content-start ">
                <ul>
                  <li>
                    <h5>BCD/USD</h5>
                  </li>
                  <li>
                    <h6>
                      <span className="message">VOL</span> {tickerValues[7]}{" "}
                      <span className="message">BTC</span>
                    </h6>
                  </li>
                  <li>
                    <h6>
                      <span className="message">LOW</span>{" "}
                      {tickerValues[9]?.toFixed(2)}
                    </h6>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-5">
              <div className="d-flex justify-content-end">
                <ul>
                  <li>
                    <h5>{tickerValues[6]?.toFixed(2)}</h5>
                  </li>
                  <li>
                    <h6 className="high-light-Rate">
                      {tickerValues[4]?.toFixed(2)} (
                      {tickerData[5] &&
                        (tickerData[5] * Math.pow(10, 2)).toFixed(2)}
                      %)
                    </h6>
                  </li>
                  <li>
                    <h6>
                      <span className="message">HIGH</span>{" "}
                      {tickerValues[8]?.toFixed(2)}
                    </h6>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-around mt-3">
        <button onClick={handleConnect} className="btn btn-success">
          Connect
        </button>
        <button onClick={handleDisconnect} className="btn btn-danger">
          Disconnect
        </button>
      </div>
    </div>
  );
}
const mapDispatchToprops = (dispatch) => {
  return bindActionCreators(
    {
      saveTickerData,
    },
    dispatch
  );
};

const mapStateToProps = (state) => {
  return {
    tickerData: state.tickerReducer.tickerData,
  };
};

export default connect(mapStateToProps, mapDispatchToprops)(Ticker);
