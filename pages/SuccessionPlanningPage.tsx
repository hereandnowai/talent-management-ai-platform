
import React, { useState, useEffect, useCallback } from 'react';
import { Role, Employee } from '../types';
import { BRAND_INFO, Icons } from '../constants';
import Modal from '../components/Modal';
import { getMockEmployees, getMockRoles } from '../services/mockDataService';
import { simulateSuccessionScenario } from '../services/geminiService';
import LoadingSpinner from '../components/LoadingSpinner';

const SuccessionPlanningPage: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [potentialSuccessors, setPotentialSuccessors] = useState<Employee[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [simulationResult, setSimulationResult] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setRoles(getMockRoles(10)); // Load 10 mock key roles
    setEmployees(getMockEmployees(50));
    setIsLoading(false);
  }, []);

  const identifyPotentialSuccessors = useCallback((role: Role) => {
    // Basic filtering logic, AI can enhance this significantly
    const successors = employees.filter(emp => 
      emp.potentialScore > 75 && // High potential
      emp.performanceScore > 70 && // Good performance
      emp.role !== role.title && // Not currently in the role
      (emp.skills.some(skill => role.requiredSkills.includes(skill)) || role.requiredSkills.length === 0) // Some skill overlap or no specific skills listed for role
    ).sort((a,b) => b.potentialScore - a.potentialScore).slice(0, 5); // Top 5
    setPotentialSuccessors(successors);
  }, [employees]);

  const handleViewSuccessors = (role: Role) => {
    setSelectedRole(role);
    identifyPotentialSuccessors(role);
    setSimulationResult(null); // Reset simulation result
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRole(null);
    setPotentialSuccessors([]);
  };

  const handleSimulateScenario = useCallback(async (role: Role, candidate: Employee) => {
    if (!role || !candidate) return;
    setIsSimulating(true);
    setSimulationResult(null);
    try {
      const result = await simulateSuccessionScenario(role, candidate);
      setSimulationResult(result);
    } catch (error) {
      console.error("Failed to simulate scenario:", error);
      setSimulationResult("Error: Could not simulate scenario. " + (error as Error).message);
    } finally {
      setIsSimulating(false);
    }
  }, []);


  if (isLoading) {
    return <div className="flex justify-center items-center h-full"><Icons.Succession className="w-12 h-12 animate-pulse" style={{color: BRAND_INFO.colors.primary}}/> <p className="ml-2 text-lg">Loading Succession Plans...</p></div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold" style={{ color: BRAND_INFO.colors.secondary }}>Succession Planning</h1>
      <p className="text-gray-600">Identify and develop potential successors for key roles within {BRAND_INFO.organizationShortName}.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map(role => (
          <div key={role.id} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
            <h3 className="text-xl font-semibold mb-2" style={{ color: BRAND_INFO.colors.secondary }}>{role.title}</h3>
            <p className="text-sm text-gray-500 mb-1">Department: {role.department}</p>
            <p className="text-sm text-gray-500 mb-3">Experience: {role.experienceLevel}</p>
            <p className="text-sm text-gray-700 mb-1 font-medium">Required Skills:</p>
            <div className="flex flex-wrap gap-1 mb-4">
              {role.requiredSkills.slice(0,3).map(skill => (
                <span key={skill} className="px-2 py-1 text-xs rounded-full" style={{ backgroundColor: `${BRAND_INFO.colors.primary}B3`, color: BRAND_INFO.colors.secondary }}>
                  {skill}
                </span>
              ))}
              {role.requiredSkills.length > 3 && <span className="text-xs text-gray-500 italic">+{role.requiredSkills.length-3} more</span>}
            </div>
            <button
              onClick={() => handleViewSuccessors(role)}
              className="w-full mt-2 py-2 px-4 rounded-md text-sm font-medium transition-colors"
              style={{ backgroundColor: BRAND_INFO.colors.secondary, color: BRAND_INFO.colors.primary }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = BRAND_INFO.colors.primary }
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = BRAND_INFO.colors.secondary }
            >
              View Potential Successors
            </button>
          </div>
        ))}
      </div>

      {selectedRole && (
        <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={`Potential Successors for ${selectedRole.title}`} size="xl">
          {potentialSuccessors.length > 0 ? (
            <div className="space-y-4">
              {potentialSuccessors.map(emp => (
                <div key={emp.id} className="p-4 border rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center" style={{borderColor: `${BRAND_INFO.colors.primary}80`}}>
                  <div>
                    <h4 className="text-lg font-semibold" style={{color: BRAND_INFO.colors.secondary}}>{emp.name}</h4>
                    <p className="text-sm text-gray-600">{emp.role} - Potential: {emp.potentialScore}/100</p>
                     <p className="text-xs text-gray-500">Skills: {emp.skills.slice(0,3).join(', ')}{emp.skills.length > 3 ? '...' : ''}</p>
                  </div>
                  <button 
                    onClick={() => handleSimulateScenario(selectedRole, emp)}
                    disabled={isSimulating}
                    className="mt-2 sm:mt-0 px-3 py-1.5 rounded-md text-xs font-medium transition-colors disabled:opacity-50"
                    style={{backgroundColor: BRAND_INFO.colors.primary, color: BRAND_INFO.colors.secondary}}
                  >
                    {isSimulating ? <LoadingSpinner size="sm" /> : 'AI Simulate Scenario'}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No high-potential successors identified based on current criteria. Caramel AI can help refine search parameters.</p>
          )}
          {isSimulating && <div className="mt-4 flex items-center"><LoadingSpinner/> <p className="ml-2">Caramel AI is simulating the scenario...</p></div>}
          {simulationResult && (
            <div className="mt-4 p-4 rounded-md bg-gray-50 border" style={{borderColor: BRAND_INFO.colors.primary}}>
              <h5 className="font-semibold mb-1" style={{color: BRAND_INFO.colors.secondary}}>AI Simulation Result:</h5>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{simulationResult}</p>
            </div>
          )}
           <p className="text-xs text-gray-500 mt-4 italic">
            Succession decisions should consider multiple factors. Caramel AI provides predictive insights to support your decision-making.
          </p>
        </Modal>
      )}
    </div>
  );
};

export default SuccessionPlanningPage;
