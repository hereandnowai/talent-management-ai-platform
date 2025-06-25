
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DashboardCard from '../components/DashboardCard';
import { BRAND_INFO, Icons } from '../constants';
import { Employee, Role } from '../types'; // Assuming types.ts is in the parent directory
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getMockEmployees, getMockRoles } from '../services/mockDataService'; // Placeholder for mock data service

// Placeholder for AI insights generation
const getAiInsights = async (data: any) => {
  // In a real app, this would call geminiService.ts
  // For now, returning mock insights
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
  return {
    employeeEngagementSuggestion: "Consider team-building activities for departments with engagement scores below 70%.",
    attritionRiskAlert: "Tech department shows a 15% attrition risk. Investigate causes and implement retention strategies.",
    trainingRoiHighlight: "Leadership training shows a 25% increase in promotion readiness. Expand program access."
  };
};

const engagementData = [
  { name: 'Engineering', engagement: 85, amt: 2400 },
  { name: 'Sales', engagement: 78, amt: 2210 },
  { name: 'Marketing', engagement: 92, amt: 2290 },
  { name: 'HR', engagement: 65, amt: 2000 },
  { name: 'Support', engagement: 72, amt: 2181 },
];

const performanceData = [
    { name: 'Q1', high: 30, medium: 50, low: 20 },
    { name: 'Q2', high: 35, medium: 45, low: 20 },
    { name: 'Q3', high: 40, medium: 40, low: 20 },
    { name: 'Q4', high: 45, medium: 35, low: 20 },
];


const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [aiInsights, setAiInsights] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setEmployees(getMockEmployees(20));
      setRoles(getMockRoles(5));
      const insights = await getAiInsights({ employees, roles });
      setAiInsights(insights);
      setIsLoading(false);
    };
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const averageEngagement = employees.length > 0 
    ? (employees.reduce((acc, e) => acc + e.engagementScore, 0) / employees.length).toFixed(1) 
    : 0;
  
  const highPotentialCount = employees.filter(e => e.potentialScore > 80).length;
  const attritionRiskCount = employees.filter(e => e.attritionRisk > 60).length;

  if (isLoading) {
    return <div className="flex justify-center items-center h-full"><Icons.Dashboard className="w-12 h-12 animate-pulse" style={{color: BRAND_INFO.colors.primary}}/> <p className="ml-2 text-lg">{t('loading')} Dashboard...</p></div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold" style={{ color: BRAND_INFO.colors.secondary }}>
        {t('dashboard.title', { organizationShortName: BRAND_INFO.organizationShortName })}
      </h1>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard title="Total Employees" value={employees.length} icon={<Icons.Users className="w-8 h-8"/>} />
        <DashboardCard title="Avg. Engagement" value={`${averageEngagement}%`} icon={<Icons.Development className="w-8 h-8"/>} trend={{ value: "+2% MoM", direction: "up"}}/>
        <DashboardCard title="High Potentials" value={highPotentialCount} icon={<Icons.Succession className="w-8 h-8"/>} description="Employees with >80 potential score."/>
        <DashboardCard title="Attrition Risk" value={attritionRiskCount} icon={<Icons.Planning className="w-8 h-8"/>} trend={{ value: "-5% MoM", direction: "down"}}/>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCard title="Employee Engagement by Department">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={engagementData} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fill: BRAND_INFO.colors.secondary, fontSize: 12 }} />
              <YAxis tick={{ fill: BRAND_INFO.colors.secondary, fontSize: 12 }} />
              <Tooltip wrapperStyle={{ backgroundColor: BRAND_INFO.colors.secondary, color: 'white', borderRadius: '0.5rem' }} contentStyle={{backgroundColor: BRAND_INFO.colors.secondary, border: 'none'}} itemStyle={{color: 'white'}}/>
              <Legend />
              <Bar dataKey="engagement" fill={BRAND_INFO.colors.primary} />
            </BarChart>
          </ResponsiveContainer>
        </DashboardCard>
        <DashboardCard title="Performance Distribution">
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={performanceData} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fill: BRAND_INFO.colors.secondary, fontSize: 12 }} />
                    <YAxis tick={{ fill: BRAND_INFO.colors.secondary, fontSize: 12 }} />
                    <Tooltip wrapperStyle={{ backgroundColor: BRAND_INFO.colors.secondary, color: 'white', borderRadius: '0.5rem' }} contentStyle={{backgroundColor: BRAND_INFO.colors.secondary, border: 'none'}} itemStyle={{color: 'white'}}/>
                    <Legend />
                    <Bar dataKey="high" stackId="a" fill="#4CAF50" name="High Performers" />
                    <Bar dataKey="medium" stackId="a" fill="#FFC107" name="Medium Performers" />
                    <Bar dataKey="low" stackId="a" fill="#F44336" name="Low Performers" />
                </BarChart>
            </ResponsiveContainer>
        </DashboardCard>
      </div>

      {/* AI-Driven Insights */}
      {aiInsights && (
        <div className="mt-6 p-6 bg-white rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4" style={{ color: BRAND_INFO.colors.secondary }}>AI-Driven Suggestions</h2>
          <div className="space-y-3 text-sm">
            <div className="p-3 rounded-md" style={{backgroundColor: `${BRAND_INFO.colors.primary}30`}}> {/* Primary with opacity */}
              <p><strong>Engagement:</strong> {aiInsights.employeeEngagementSuggestion}</p>
            </div>
            <div className="p-3 rounded-md" style={{backgroundColor: `${BRAND_INFO.colors.primary}30`}}>
              <p><strong>Attrition:</strong> {aiInsights.attritionRiskAlert}</p>
            </div>
             <div className="p-3 rounded-md" style={{backgroundColor: `${BRAND_INFO.colors.primary}30`}}>
              <p><strong>Training ROI:</strong> {aiInsights.trainingRoiHighlight}</p>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4 italic">
            Note: These insights are generated by Caramel AI based on current data.
          </p>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;