
import React, { useState, useEffect, useCallback } from 'react';
import { Employee, SkillGap } from '../types';
import EmployeeProfileCard from '../components/EmployeeProfileCard';
import Modal from '../components/Modal';
import { BRAND_INFO, Icons } from '../constants';
import { getMockEmployees } from '../services/mockDataService';
import { generateSkillGapAnalysis } from '../services/geminiService';
import LoadingSpinner from '../components/LoadingSpinner';

const TalentProfilePage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [skillGaps, setSkillGaps] = useState<SkillGap[]>([]);
  const [isLoadingGaps, setIsLoadingGaps] = useState(false);
  const [desiredRole, setDesiredRole] = useState<string>('');


  useEffect(() => {
    setIsLoading(true);
    setEmployees(getMockEmployees(50)); // Load 50 mock employees
    setIsLoading(false);
  }, []);

  const handleViewDetails = (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    if (employee) {
      setSelectedEmployee(employee);
      setSkillGaps([]); // Reset gaps when opening new employee
      setDesiredRole(''); // Reset desired role
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
  };

  const handleAnalyzeSkillGaps = useCallback(async () => {
    if (!selectedEmployee || !desiredRole) return;
    setIsLoadingGaps(true);
    setSkillGaps([]);
    try {
      const gaps = await generateSkillGapAnalysis(selectedEmployee, desiredRole);
      setSkillGaps(gaps);
    } catch (error) {
      console.error("Failed to analyze skill gaps:", error);
      // Display error to user if needed
    } finally {
      setIsLoadingGaps(false);
    }
  }, [selectedEmployee, desiredRole]);

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (isLoading) {
    return <div className="flex justify-center items-center h-full"><Icons.Users className="w-12 h-12 animate-pulse" style={{color: BRAND_INFO.colors.primary}}/> <p className="ml-2 text-lg">Loading Talent Profiles...</p></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <h1 className="text-3xl font-bold mb-4 md:mb-0" style={{ color: BRAND_INFO.colors.secondary }}>Talent Profiles</h1>
        <div className="w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search by name, role, or skill..."
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:outline-none focus:ring-[${BRAND_INFO.colors.primary}]`}
            style={{ borderColor: BRAND_INFO.colors.primary }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredEmployees.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredEmployees.map(employee => (
            <EmployeeProfileCard key={employee.id} employee={employee} onViewDetails={handleViewDetails} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 py-8">No employees found matching your search criteria.</p>
      )}

      {selectedEmployee && (
        <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={`${selectedEmployee.name}'s Profile`} size="xl">
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
              <img 
                src={selectedEmployee.photoUrl || `https://picsum.photos/seed/${selectedEmployee.id}/150/150`} 
                alt={selectedEmployee.name} 
                className="w-32 h-32 rounded-full object-cover border-4"
                style={{borderColor: BRAND_INFO.colors.primary}}
              />
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-semibold" style={{color: BRAND_INFO.colors.secondary}}>{selectedEmployee.name}</h2>
                <p className="text-gray-700">{selectedEmployee.role} - {selectedEmployee.department}</p>
                <p className="text-sm text-gray-500">{selectedEmployee.email}</p>
                <p className="text-sm text-gray-500">Years at company: {selectedEmployee.yearsAtCompany}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-1" style={{color: BRAND_INFO.colors.secondary}}>Skills:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedEmployee.skills.map(skill => (
                    <span key={skill} className="px-3 py-1 text-sm rounded-full" style={{backgroundColor: BRAND_INFO.colors.primary, color: BRAND_INFO.colors.secondary}}>{skill}</span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-1" style={{color: BRAND_INFO.colors.secondary}}>Achievements:</h4>
                <ul className="list-disc list-inside text-sm text-gray-600">
                  {selectedEmployee.achievements.map((ach, idx) => <li key={idx}>{ach}</li>)}
                </ul>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-1" style={{color: BRAND_INFO.colors.secondary}}>Career Goals:</h4>
              <p className="text-sm text-gray-600">{selectedEmployee.careerGoals}</p>
            </div>

            <div>
              <h4 className="font-semibold mb-1" style={{color: BRAND_INFO.colors.secondary}}>Development Plan:</h4>
               <ul className="list-disc list-inside text-sm text-gray-600">
                  {selectedEmployee.developmentPlan.map((plan, idx) => <li key={idx}>{plan}</li>)}
                </ul>
            </div>

            <div className="mt-6 p-4 rounded-md" style={{backgroundColor: `${BRAND_INFO.colors.secondary}10`}}>
              <h4 className="font-semibold mb-2" style={{color: BRAND_INFO.colors.secondary}}>AI-Powered Skill Gap Analysis</h4>
              <div className="flex items-center space-x-2 mb-3">
                <input 
                  type="text" 
                  placeholder="Enter desired role (e.g., Senior Developer)" 
                  value={desiredRole}
                  onChange={(e) => setDesiredRole(e.target.value)}
                  className={`flex-1 p-2 border rounded-md focus:ring-1 focus:outline-none focus:ring-[${BRAND_INFO.colors.primary}]`}
                  style={{borderColor: BRAND_INFO.colors.primary}}
                />
                <button 
                  onClick={handleAnalyzeSkillGaps} 
                  disabled={isLoadingGaps || !desiredRole}
                  className="px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
                  style={{backgroundColor: BRAND_INFO.colors.secondary, color: BRAND_INFO.colors.primary}}
                >
                  {isLoadingGaps ? <LoadingSpinner size="sm"/> : 'Analyze'}
                </button>
              </div>
              {isLoadingGaps && <p className="text-sm text-gray-600 flex items-center"><LoadingSpinner size="sm" /> Analyzing skills...</p>}
              {skillGaps.length > 0 && (
                <div className="mt-2 space-y-1">
                  <h5 className="font-medium text-sm" style={{color: BRAND_INFO.colors.secondary}}>Skill Gaps for "{desiredRole}":</h5>
                  <ul className="list-disc list-inside text-sm text-gray-700">
                    {skillGaps.map(gap => (
                      <li key={gap.skill}>{gap.skill}: Gap of {gap.gap} (Current: {gap.currentLevel}, Desired: {gap.desiredLevel})</li>
                    ))}
                  </ul>
                   <p className="text-xs text-gray-500 mt-2 italic">Caramel AI suggests focusing on these areas for development.</p>
                </div>
              )}
               {!isLoadingGaps && skillGaps.length === 0 && desiredRole && (
                 <p className="text-sm text-gray-600 mt-2">No significant skill gaps identified for "{desiredRole}" or analysis pending.</p>
               )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default TalentProfilePage;
