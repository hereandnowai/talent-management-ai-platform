
import React from 'react';
import { Employee } from '../types';
import { BRAND_INFO } from '../constants';

interface EmployeeProfileCardProps {
  employee: Employee;
  onViewDetails: (employeeId: string) => void;
}

const EmployeeProfileCard: React.FC<EmployeeProfileCardProps> = ({ employee, onViewDetails }) => {
  return (
    <div className="bg-white p-5 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center space-x-4 mb-4">
        <img 
          src={employee.photoUrl || `https://picsum.photos/seed/${employee.id}/100/100`} 
          alt={employee.name} 
          className="w-20 h-20 rounded-full object-cover border-2"
          style={{ borderColor: BRAND_INFO.colors.primary }}
        />
        <div>
          <h3 className="text-xl font-semibold" style={{ color: BRAND_INFO.colors.secondary }}>{employee.name}</h3>
          <p className="text-sm text-gray-600">{employee.role}</p>
          <p className="text-xs text-gray-500">{employee.department}</p>
        </div>
      </div>
      <div className="mb-3">
        <h4 className="text-sm font-medium text-gray-700 mb-1">Top Skills:</h4>
        <div className="flex flex-wrap gap-1">
          {employee.skills.slice(0, 3).map(skill => (
            <span key={skill} className="px-2 py-1 text-xs rounded-full" style={{ backgroundColor: BRAND_INFO.colors.primary, color: BRAND_INFO.colors.secondary }}>
              {skill}
            </span>
          ))}
          {employee.skills.length > 3 && <span className="px-2 py-1 text-xs rounded-full bg-gray-200 text-gray-700">+{employee.skills.length - 3} more</span>}
        </div>
      </div>
       <div className="grid grid-cols-2 gap-2 text-sm mb-3">
        <div>
          <span className="font-medium text-gray-700">Performance: </span>
          <span style={{ color: employee.performanceScore > 70 ? 'green' : 'orange' }}>{employee.performanceScore}/100</span>
        </div>
        <div>
          <span className="font-medium text-gray-700">Potential: </span>
           <span style={{ color: employee.potentialScore > 70 ? 'green' : 'orange' }}>{employee.potentialScore}/100</span>
        </div>
      </div>
      <button
        onClick={() => onViewDetails(employee.id)}
        className="w-full mt-2 py-2 px-4 rounded-md text-sm font-medium transition-colors"
        style={{ backgroundColor: BRAND_INFO.colors.secondary, color: BRAND_INFO.colors.primary }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = BRAND_INFO.colors.primary }
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = BRAND_INFO.colors.secondary }
      >
        View Details
      </button>
    </div>
  );
};

export default EmployeeProfileCard;
