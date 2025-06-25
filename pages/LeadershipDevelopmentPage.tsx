
import React, { useState, useEffect, useCallback } from 'react';
import { TrainingProgram, Employee } from '../types';
import { BRAND_INFO, Icons } from '../constants';
import Modal from '../components/Modal';
import { getMockTrainingPrograms, getMockEmployees } from '../services/mockDataService';
import { recommendTrainingPrograms } from '../services/geminiService';
import LoadingSpinner from '../components/LoadingSpinner';

const LeadershipDevelopmentPage: React.FC = () => {
  const [programs, setPrograms] = useState<TrainingProgram[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<TrainingProgram | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [targetEmployee, setTargetEmployee] = useState<Employee | null>(null);
  const [recommendedPrograms, setRecommendedPrograms] = useState<TrainingProgram[]>([]);
  const [isRecommending, setIsRecommending] = useState(false);
  const [isRecoModalOpen, setIsRecoModalOpen] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setPrograms(getMockTrainingPrograms(8)); // Load 8 mock programs
    setEmployees(getMockEmployees(20)); // Load some employees for selection
    setIsLoading(false);
  }, []);

  const handleViewProgramDetails = (program: TrainingProgram) => {
    setSelectedProgram(program);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProgram(null);
  };
  
  const handleOpenRecoModal = () => {
    setTargetEmployee(null);
    setRecommendedPrograms([]);
    setIsRecoModalOpen(true);
  };

  const handleCloseRecoModal = () => {
    setIsRecoModalOpen(false);
  };

  const handleGetRecommendations = useCallback(async () => {
    if (!targetEmployee) return;
    setIsRecommending(true);
    setRecommendedPrograms([]);
    try {
      // Simulate providing some context like competency gaps or career goals
      const competencyGaps = ['Strategic Thinking', 'Team Motivation']; // Example
      const recommendationsText = await recommendTrainingPrograms(targetEmployee, competencyGaps);
      // This is a simplified example. In reality, you'd parse the text to match existing programs or suggest new ones.
      // For now, we'll just show the text and filter existing programs based on keywords.
      const keywords = recommendationsText.toLowerCase().split(/\s+/);
      const matchedPrograms = programs.filter(p => 
        keywords.some(kw => p.name.toLowerCase().includes(kw) || p.description.toLowerCase().includes(kw) || p.skillsGained.some(s => s.toLowerCase().includes(kw)))
      ).slice(0,3); // show top 3 matches
      
      if(matchedPrograms.length === 0 && programs.length > 0) {
         setRecommendedPrograms([programs[Math.floor(Math.random() * programs.length)]]); // show a random one if no match
      } else {
        setRecommendedPrograms(matchedPrograms);
      }

      // If you want to display the raw text recommendation from Gemini:
      // setRecommendedPrograms([{ id: 'gemini-reco', name: 'AI Recommended Focus', description: recommendationsText, targetAudience: [], duration: '', skillsGained:[] }]);

    } catch (error) {
      console.error("Failed to get recommendations:", error);
      // display error
    } finally {
      setIsRecommending(false);
    }
  }, [targetEmployee, programs]);


  if (isLoading) {
    return <div className="flex justify-center items-center h-full"><Icons.Development className="w-12 h-12 animate-pulse" style={{color: BRAND_INFO.colors.primary}}/> <p className="ml-2 text-lg">Loading Leadership Programs...</p></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold" style={{ color: BRAND_INFO.colors.secondary }}>Leadership Development</h1>
        <button
          onClick={handleOpenRecoModal}
          className="px-4 py-2 rounded-md font-medium text-sm transition-colors flex items-center space-x-2"
          style={{ backgroundColor: BRAND_INFO.colors.primary, color: BRAND_INFO.colors.secondary }}
        >
          <Icons.Chat className="w-5 h-5"/>
          <span>Get AI Recommendations</span>
        </button>
      </div>
      <p className="text-gray-600">Explore training programs designed to foster leadership skills at {BRAND_INFO.organizationShortName}.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs.map(program => (
          <div key={program.id} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: BRAND_INFO.colors.secondary }}>{program.name}</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-3">{program.description}</p>
              <p className="text-xs text-gray-500 mb-1">Duration: {program.duration}</p>
              <p className="text-xs text-gray-500 mb-3">Provider: {program.provider || 'Internal'}</p>
              <div className="mb-3">
                <h5 className="text-sm font-medium text-gray-700 mb-1">Skills Gained:</h5>
                <div className="flex flex-wrap gap-1">
                  {program.skillsGained.slice(0,3).map(skill => (
                    <span key={skill} className="px-2 py-0.5 text-xs rounded-full" style={{ backgroundColor: `${BRAND_INFO.colors.secondary}20`, color: BRAND_INFO.colors.secondary }}>
                      {skill}
                    </span>
                  ))}
                  {program.skillsGained.length > 3 && <span className="text-xs text-gray-500 italic">+{program.skillsGained.length-3} more</span>}
                </div>
              </div>
            </div>
            <button
              onClick={() => handleViewProgramDetails(program)}
              className="w-full mt-auto py-2 px-4 rounded-md text-sm font-medium transition-colors"
              style={{ backgroundColor: BRAND_INFO.colors.secondary, color: BRAND_INFO.colors.primary }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = BRAND_INFO.colors.primary }
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = BRAND_INFO.colors.secondary }
            >
              View Details
            </button>
          </div>
        ))}
      </div>

      {selectedProgram && (
        <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={selectedProgram.name} size="lg">
          <p className="text-gray-700 mb-4">{selectedProgram.description}</p>
          <p><strong>Duration:</strong> {selectedProgram.duration}</p>
          <p><strong>Provider:</strong> {selectedProgram.provider || 'Internal Program'}</p>
          <p className="mt-2"><strong>Target Audience:</strong> {selectedProgram.targetAudience.join(', ')}</p>
          <div className="mt-2">
            <strong>Skills Gained:</strong>
            <ul className="list-disc list-inside ml-4">
              {selectedProgram.skillsGained.map(skill => <li key={skill}>{skill}</li>)}
            </ul>
          </div>
          <p className="text-xs text-gray-500 mt-6 italic">
            Assign mentors and track progress through employee profiles.
          </p>
        </Modal>
      )}

      <Modal isOpen={isRecoModalOpen} onClose={handleCloseRecoModal} title="AI Training Recommendations" size="lg">
        <div className="space-y-4">
          <div>
            <label htmlFor="employeeSelect" className="block text-sm font-medium text-gray-700 mb-1">Select Employee:</label>
            <select
              id="employeeSelect"
              value={targetEmployee?.id || ''}
              onChange={(e) => setTargetEmployee(employees.find(emp => emp.id === e.target.value) || null)}
              className={`w-full p-2 border rounded-md focus:ring-1 focus:outline-none focus:ring-[${BRAND_INFO.colors.primary}]`}
              style={{borderColor: BRAND_INFO.colors.primary}}
            >
              <option value="">-- Select an Employee --</option>
              {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name} - {emp.role}</option>)}
            </select>
          </div>
          {targetEmployee && (
            <div className="text-sm text-gray-600">
              <p>Selected: <strong>{targetEmployee.name}</strong></p>
              <p>Current Role: {targetEmployee.role}</p>
              <p>Identified Potential: {targetEmployee.potentialScore}/100</p>
            </div>
          )}
          <button 
            onClick={handleGetRecommendations}
            disabled={!targetEmployee || isRecommending}
            className="w-full px-4 py-2 rounded-md font-medium text-sm transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
            style={{ backgroundColor: BRAND_INFO.colors.secondary, color: BRAND_INFO.colors.primary }}
          >
            {isRecommending ? <LoadingSpinner size="sm"/> : <Icons.Chat className="w-5 h-5"/>}
            <span>{isRecommending ? 'Caramel AI is thinking...' : 'Get Recommendations'}</span>
          </button>

          {isRecommending && <p className="text-sm text-gray-600 text-center">Fetching AI powered recommendations...</p>}
          
          {recommendedPrograms.length > 0 && !isRecommending && (
            <div className="mt-4 space-y-3">
              <h4 className="font-semibold" style={{color: BRAND_INFO.colors.secondary}}>Recommended Programs for {targetEmployee?.name}:</h4>
              {recommendedPrograms.map(program => (
                 <div key={program.id} className="p-3 border rounded-md" style={{borderColor: `${BRAND_INFO.colors.primary}80`}}>
                    <h5 className="font-medium" style={{color: BRAND_INFO.colors.secondary}}>{program.name}</h5>
                    <p className="text-xs text-gray-600 line-clamp-2">{program.description}</p>
                    <button 
                      onClick={() => { handleViewProgramDetails(program); handleCloseRecoModal(); }}
                      className="text-xs mt-1 hover:underline"
                      style={{color: BRAND_INFO.colors.secondary}}
                    >View Program Details &rarr;</button>
                 </div>
              ))}
            </div>
          )}
          {!isRecommending && recommendedPrograms.length === 0 && targetEmployee && (
            <p className="text-sm text-gray-600 mt-2 text-center">No specific existing programs matched. Caramel AI might suggest focusing on general leadership competencies.</p>
          )}
        </div>
      </Modal>

    </div>
  );
};

export default LeadershipDevelopmentPage;
