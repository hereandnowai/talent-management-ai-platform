
import React, { useState, useEffect, useCallback } from 'react';
import { BRAND_INFO, Icons } from '../constants';
import { forecastWorkforceNeeds } from '../services/geminiService'; // Using Gemini service
import LoadingSpinner from '../components/LoadingSpinner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { ForecastData } from '../types'; // Import ForecastData from types

const initialForecastData: ForecastData[] = [
  { period: 'Q1 2025', demand: 120, supply: 115 },
  { period: 'Q2 2025', demand: 125, supply: 118 },
  { period: 'Q3 2025', demand: 130, supply: 120 },
  { period: 'Q4 2025', demand: 135, supply: 122 },
].map(d => ({ ...d, gap: d.demand - d.supply }));


const WorkforcePlanningPage: React.FC = () => {
  const [forecastData, setForecastData] = useState<ForecastData[]>(initialForecastData);
  const [isLoading, setIsLoading] = useState(false);
  const [organizationalGrowth, setOrganizationalGrowth] = useState<string>("moderate departmental expansion"); // Example input
  const [marketTrends, setMarketTrends] = useState<string>("increased demand for AI specialists, remote work preference"); // Example input
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);

  const handleGenerateForecast = useCallback(async () => {
    setIsLoading(true);
    setAiAnalysis(null);
    try {
      const analysisResult = await forecastWorkforceNeeds(organizationalGrowth, marketTrends, forecastData);
      setAiAnalysis(analysisResult.narrative); // Display AI narrative
      // Optionally, update forecastData if AI provides structured data for chart
      if (analysisResult.updatedForecast) {
        setForecastData(analysisResult.updatedForecast.map(d => ({...d, gap: d.demand - d.supply})));
      }
    } catch (error) {
      console.error("Failed to generate forecast:", error);
      setAiAnalysis("Error: Could not generate AI-powered forecast. " + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, [organizationalGrowth, marketTrends, forecastData]);
  
  // Trigger initial forecast on load for demonstration
  useEffect(() => {
    handleGenerateForecast();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold" style={{ color: BRAND_INFO.colors.secondary }}>Workforce Planning</h1>
      <p className="text-gray-600">Align HR strategies with business goals using smart workforce analytics at {BRAND_INFO.organizationShortName}.</p>

      <div className="p-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4" style={{ color: BRAND_INFO.colors.secondary }}>AI-Powered Forecast Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="orgGrowth" className="block text-sm font-medium text-gray-700 mb-1">Organizational Growth Plans:</label>
            <textarea
              id="orgGrowth"
              rows={3}
              className={`w-full p-2 border rounded-md focus:ring-1 focus:outline-none focus:ring-[${BRAND_INFO.colors.primary}]`}
              style={{borderColor: BRAND_INFO.colors.primary}}
              value={organizationalGrowth}
              onChange={(e) => setOrganizationalGrowth(e.target.value)}
              placeholder="e.g., Aggressive market expansion, new product lines, 15% YoY growth target"
            />
          </div>
          <div>
            <label htmlFor="marketTrends" className="block text-sm font-medium text-gray-700 mb-1">Key Market Trends:</label>
            <textarea
              id="marketTrends"
              rows={3}
              className={`w-full p-2 border rounded-md focus:ring-1 focus:outline-none focus:ring-[${BRAND_INFO.colors.primary}]`}
              style={{borderColor: BRAND_INFO.colors.primary}}
              value={marketTrends}
              onChange={(e) => setMarketTrends(e.target.value)}
              placeholder="e.g., Shortage of data scientists, rise of gig economy, automation impact"
            />
          </div>
        </div>
        <button
          onClick={handleGenerateForecast}
          disabled={isLoading}
          className="px-6 py-2.5 rounded-md font-medium text-sm transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
          style={{ backgroundColor: BRAND_INFO.colors.secondary, color: BRAND_INFO.colors.primary }}
        >
          {isLoading ? <LoadingSpinner size="sm"/> : <Icons.Chat className="w-5 h-5"/>}
          <span>{isLoading ? 'Caramel AI is Forecasting...' : 'Generate AI Forecast'}</span>
        </button>
      </div>
      
      {isLoading && !aiAnalysis && (
         <div className="flex justify-center items-center h-40"><LoadingSpinner/> <p className="ml-2">Caramel AI is analyzing workforce needs...</p></div>
      )}

      {aiAnalysis && (
        <div className="mt-6 p-6 bg-white rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold mb-2" style={{ color: BRAND_INFO.colors.secondary }}>Caramel AI Analysis & Recommendations:</h3>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{aiAnalysis}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="p-6 bg-white rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold mb-4" style={{ color: BRAND_INFO.colors.secondary }}>Workforce Demand vs. Supply Forecast</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={forecastData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" tick={{ fill: BRAND_INFO.colors.secondary, fontSize: 12 }}/>
              <YAxis tick={{ fill: BRAND_INFO.colors.secondary, fontSize: 12 }} />
              <Tooltip wrapperStyle={{ backgroundColor: BRAND_INFO.colors.secondary, color: 'white', borderRadius: '0.5rem' }} contentStyle={{backgroundColor: BRAND_INFO.colors.secondary, border: 'none'}} itemStyle={{color: 'white'}}/>
              <Legend />
              <Line type="monotone" dataKey="demand" stroke={BRAND_INFO.colors.primary} strokeWidth={2} name="Projected Demand" />
              <Line type="monotone" dataKey="supply" stroke={BRAND_INFO.colors.secondary} strokeWidth={2} name="Projected Supply" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="p-6 bg-white rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold mb-4" style={{ color: BRAND_INFO.colors.secondary }}>Talent Gap Analysis</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={forecastData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" tick={{ fill: BRAND_INFO.colors.secondary, fontSize: 12 }} />
              <YAxis tick={{ fill: BRAND_INFO.colors.secondary, fontSize: 12 }} />
              <Tooltip wrapperStyle={{ backgroundColor: BRAND_INFO.colors.secondary, color: 'white', borderRadius: '0.5rem' }} contentStyle={{backgroundColor: BRAND_INFO.colors.secondary, border: 'none'}} itemStyle={{color: 'white'}}/>
              <Legend />
              <Bar dataKey="gap" fill={BRAND_INFO.colors.primary} name="Talent Gap (Demand - Supply)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-700">
        <p><strong>Note:</strong> Workforce planning is an ongoing process. Regularly update your inputs and consult with Caramel AI to refine strategies and adapt to changing business needs and market dynamics. Consider factors like skill evolution, employee turnover, and internal mobility programs.</p>
      </div>
    </div>
  );
};

export default WorkforcePlanningPage;
