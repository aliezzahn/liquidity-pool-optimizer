import "./index.css";
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Coins,
  TrendingUp,
  Shield,
  Calculator,
  Info,
  Layers,
  Sun,
  Moon,
} from "lucide-react";

export function App() {
  const [poolParams, setPoolParams] = useState({
    initialTokenA: 10000,
    initialTokenB: 500000,
    fee: 0.3,
    volatility: 15,
  });

  const [simulationResults, setSimulationResults] = useState([]);
  const [activeView, setActiveView] = useState("calculator");
  const [theme, setTheme] = useState("light");

  // Theme toggle function
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  // Simulate liquidity provider returns (same as previous implementation)
  const simulateLiquidityProviderReturns = () => {
    const { initialTokenA, initialTokenB, fee, volatility } = poolParams;
    const results = [];

    let currentTokenA = initialTokenA;
    let currentTokenB = initialTokenB;
    let impermanentLoss = 0;

    for (let month = 0; month < 12; month++) {
      const priceChange = (Math.random() * volatility * 2 - volatility) / 100;
      const feeEarnings = (currentTokenA + currentTokenB) * (fee / 100);

      const theoreticalHODLValue = initialTokenA + initialTokenB;
      const currentPoolValue = currentTokenA + currentTokenB;
      impermanentLoss =
        ((currentPoolValue - theoreticalHODLValue) / theoreticalHODLValue) *
        100;

      results.push({
        month: month + 1,
        poolValue: currentPoolValue,
        feeEarnings: feeEarnings,
        impermanentLoss: impermanentLoss,
      });

      currentTokenA *= 1 + priceChange;
      currentTokenB *= 1 - priceChange;
    }

    setSimulationResults(results);
    setActiveView("results");
  };

  // Themed color palette
  const themeColors = {
    light: {
      background: "bg-gray-50",
      header: "bg-white shadow-md",
      cardBackground: "bg-white",
      inputBackground: "bg-gray-100",
      textPrimary: "text-black",
      textSecondary: "text-gray-600",
      buttonPrimary: "bg-blue-500 text-white",
      buttonSecondary: "bg-gray-200 text-black",
    },
    dark: {
      background: "bg-gray-900",
      header: "bg-gray-800 shadow-lg",
      cardBackground: "bg-gray-800",
      inputBackground: "bg-gray-700",
      textPrimary: "text-white",
      textSecondary: "text-gray-300",
      buttonPrimary: "bg-blue-600 text-white",
      buttonSecondary: "bg-gray-600 text-white",
    },
  };

  // Render calculator view with theming
  const renderCalculatorView = () => {
    const colors = themeColors[theme];
    return (
      <div className={`space-y-4 p-4 ${colors.textPrimary}`}>
        <div className="grid grid-cols-2 gap-4">
          <div
            className={`${colors.inputBackground} p-3 rounded-lg flex items-center`}
          >
            <Coins className="mr-2 text-blue-500" />
            <input
              type="number"
              placeholder="Token A Amount"
              value={poolParams.initialTokenA}
              onChange={(e) =>
                setPoolParams({
                  ...poolParams,
                  initialTokenA: Number(e.target.value),
                })
              }
              className={`w-full bg-transparent focus:outline-none ${colors.textPrimary}`}
            />
          </div>
          <div
            className={`${colors.inputBackground} p-3 rounded-lg flex items-center`}
          >
            <Coins className="mr-2 text-green-500" />
            <input
              type="number"
              placeholder="Token B Amount"
              value={poolParams.initialTokenB}
              onChange={(e) =>
                setPoolParams({
                  ...poolParams,
                  initialTokenB: Number(e.target.value),
                })
              }
              className={`w-full bg-transparent focus:outline-none ${colors.textPrimary}`}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div
            className={`flex items-center ${colors.inputBackground} p-3 rounded-lg`}
          >
            <TrendingUp className="mr-2 text-purple-500" />
            <label className="flex-grow">Pool Fee (%)</label>
            <input
              type="range"
              min="0"
              max="5"
              step="0.1"
              value={poolParams.fee}
              onChange={(e) =>
                setPoolParams({
                  ...poolParams,
                  fee: Number(e.target.value),
                })
              }
              className="w-1/2"
            />
            <span className="ml-2">{poolParams.fee}%</span>
          </div>

          <div
            className={`flex items-center ${colors.inputBackground} p-3 rounded-lg`}
          >
            <Shield className="mr-2 text-red-500" />
            <label className="flex-grow">Market Volatility (%)</label>
            <input
              type="range"
              min="0"
              max="100"
              value={poolParams.volatility}
              onChange={(e) =>
                setPoolParams({
                  ...poolParams,
                  volatility: Number(e.target.value),
                })
              }
              className="w-1/2"
            />
            <span className="ml-2">{poolParams.volatility}%</span>
          </div>
        </div>

        <button
          onClick={simulateLiquidityProviderReturns}
          className={`w-full ${colors.buttonPrimary} p-3 rounded-lg flex items-center justify-center`}
        >
          <Calculator className="mr-2" /> Simulate Liquidity Pool
        </button>
      </div>
    );
  };

  // Render results view with theming
  const renderResultsView = () => {
    const colors = themeColors[theme];
    const finalResult = simulationResults[simulationResults.length - 1];
    return (
      <div className={`p-4 space-y-4 ${colors.textPrimary}`}>
        <div className="grid grid-cols-2 gap-4">
          <div
            className={`${
              theme === "light" ? "bg-blue-50" : "bg-blue-900/30"
            } p-3 rounded-lg text-center`}
          >
            <h4 className="text-sm text-blue-600">Final Pool Value</h4>
            <p className="text-lg font-bold">
              ${finalResult.poolValue.toFixed(2)}
            </p>
          </div>
          <div
            className={`${
              theme === "light" ? "bg-red-50" : "bg-red-900/30"
            } p-3 rounded-lg text-center`}
          >
            <h4 className="text-sm text-red-600">Impermanent Loss</h4>
            <p className="text-lg font-bold">
              {finalResult.impermanentLoss.toFixed(2)}%
            </p>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={simulationResults}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip
              contentStyle={{
                backgroundColor: theme === "light" ? "white" : "#1f2937",
                color: theme === "light" ? "black" : "white",
              }}
            />
            <Line type="monotone" dataKey="poolValue" stroke="#8884d8" />
            <Line type="monotone" dataKey="impermanentLoss" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>

        <div className="flex justify-between">
          <button
            onClick={() => setActiveView("calculator")}
            className={`${colors.buttonSecondary} p-2 rounded-lg flex-grow mr-2`}
          >
            Reset
          </button>
          <AlertDialog>
            <AlertDialogTrigger
              className={`${colors.buttonPrimary} p-2 rounded-lg flex-grow flex items-center justify-center`}
            >
              <Info className="mr-2" /> Detailed Insights
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Liquidity Pool Insights</AlertDialogTitle>
                <AlertDialogDescription>
                  Comprehensive analysis of your liquidity pool performance
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="space-y-2">
                {simulationResults.map((result, index) => (
                  <div
                    key={index}
                    className={`${colors.inputBackground} p-2 rounded`}
                  >
                    <p>Month {result.month}</p>
                    <p>Pool Value: ${result.poolValue.toFixed(2)}</p>
                    <p>
                      Impermanent Loss: {result.impermanentLoss.toFixed(2)}%
                    </p>
                  </div>
                ))}
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Close</AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    );
  };

  // Get current theme colors
  const colors = themeColors[theme];

  return (
    <div className={`min-h-screen ${colors.background} flex flex-col`}>
      <div className={`${colors.header} p-4 flex items-center justify-between`}>
        <div className="flex items-center">
          <Layers className="mr-2 text-blue-500" />
          <h1 className={`text-xl font-bold ${colors.textPrimary}`}>
            Liquidity Pool Optimizer
          </h1>
        </div>
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-full ${colors.inputBackground}`}
        >
          {theme === "light" ? (
            <Moon className={colors.textPrimary} />
          ) : (
            <Sun className={colors.textPrimary} />
          )}
        </button>
      </div>

      <Card className={`m-4 flex-grow ${colors.cardBackground}`}>
        <CardContent className="p-0">
          {activeView === "calculator"
            ? renderCalculatorView()
            : renderResultsView()}
        </CardContent>
      </Card>

      <div className={`${colors.header} p-4 flex justify-around`}>
        <button
          onClick={() => setActiveView("calculator")}
          className={`flex flex-col items-center ${
            activeView === "calculator" ? "text-blue-500" : colors.textSecondary
          }`}
        >
          <Calculator />
          <span className="text-xs mt-1">Calculator</span>
        </button>
        <button
          onClick={() => setActiveView("results")}
          className={`flex flex-col items-center ${
            activeView === "results" ? "text-blue-500" : colors.textSecondary
          }`}
          disabled={simulationResults.length === 0}
        >
          <TrendingUp />
          <span className="text-xs mt-1">Results</span>
        </button>
      </div>
    </div>
  );
}

export default App;
