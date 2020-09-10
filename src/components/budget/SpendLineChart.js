import React from 'react';
import { periodsToChart } from '../../constants/general';
import { calculatePeriodSpent } from '../../utils/calculate';
import { VictoryChart, VictoryLine, VictoryAxis, VictoryTheme } from 'victory';

function SpendLineChart({ 
  budget,
  budget: { currency, limit, currentPeriod },
  expenditures
}) {
  const totalPeriods = currentPeriod < periodsToChart ? currentPeriod : periodsToChart;

  let tickValues = Array(totalPeriods).fill(null);
  tickValues = tickValues.map((_, idx) => currentPeriod - idx);

  const data = tickValues.reduce((accum, period) => {
    accum.push({
      period,
      spent: calculatePeriodSpent({ expenditures, budget, period })
    });

    return accum;
  }, []);

  const maxSpent = data.reduce((most, obj) => most > obj.spent ? most : obj.spent, 0);
  const yDomain = [0, Math.max(maxSpent, limit * 2)];

  const domain = tickValues.length > 1 ? 
    { x: [tickValues[tickValues.length - 1], tickValues[0]], y: yDomain } :
    { x: [tickValues[0], tickValues[0] + 1], y: yDomain };

  return <VictoryChart theme={VictoryTheme.material} domain={domain}>
    <VictoryAxis
      // tickValues specifies both the number of ticks and where
      // they are placed on the axis
      tickValues={tickValues}
      tickFormat={tickValues.map(num => `P${num}`)}
    />
    <VictoryAxis
      dependentAxis
      // tickFormat specifies how ticks should be displayed
      tickFormat={(x) => (`${currency}${x}`)}
    />

    <VictoryLine y={() => limit} 
      style={{ data: { opacity: 0.5, stroke: '#c43a31', strokeWidth: 1 } }} />

    { tickValues.length === 1 ? <VictoryLine y={() => data[0].spent} /> : null }

    <VictoryLine
      x="period"
      y="spent"
      // style={{
      //   data: { stroke: "#c43a31" },
      //   parent: { border: "1px solid #ccc"}
      // }}
      data={data}
    />
  </VictoryChart>
}

export default SpendLineChart;
