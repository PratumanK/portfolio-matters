export const priceAlertTemplate = (
  stockName: string,
  currentPrice: number,
  targetPrice: number,
  
) => {
  return `
  <div style="font-family: Arial; padding:20px">
    <h2>📈 Stock Price Alert</h2>

    <p>The stock <b>${stockName}</b> has reached your alert price.</p>

    <p>
      Current Price: <b>₹${currentPrice}</b><br>
      Your Target: ₹${targetPrice}
    </p>

    <hr/>

    <p>Check your portfolio for more details.</p>

    <p style="color:gray;font-size:12px">
      This alert was generated automatically.
    </p>
  </div>
  `;
};