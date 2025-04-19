// components/FinancialPlanning/PersonalTab.tsx
"use client";
import React from "react";

interface PersonalTabProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  personalInfo: any;
  getInputValue: (cat: string, sub: string, val: number) => string | number;
  handleInputFocus: (cat: string, sub: string) => void;
  handleInputBlur: (cat: string, sub: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setPersonalInfo: React.Dispatch<React.SetStateAction<any>>;
}

const PersonalTab: React.FC<PersonalTabProps> = ({
  personalInfo,
  getInputValue,
  handleInputFocus,
  handleInputBlur,
  setPersonalInfo
}) => {
  return (
    <div className="personal-section">
      <div className="personal-form">
        <h3>Personal Information</h3>
        <p className="form-instructions">Please provide your personal details to help us create a more accurate financial plan.</p>

        <div className="form-group">
          <label>Age</label>
          <div className="input-with-unit">
            <input
              type="number"
              value={getInputValue('personal', 'age', personalInfo.age)}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(e) => setPersonalInfo((prev: any) => ({ ...prev, age: Number(e.target.value) }))}
              onFocus={() => handleInputFocus('personal', 'age')}
              onBlur={() => handleInputBlur('personal', 'age')}
              placeholder="Enter your age"
            />
            <span className="unit">years</span>
          </div>
        </div>

        <div className="form-group">
          <label>Employment Status</label>
          <select
            value={personalInfo.employmentStatus}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onChange={(e) => setPersonalInfo((prev: any) => ({ ...prev, employmentStatus: e.target.value }))}
          >
            <option value="employed">Employed</option>
            <option value="self-employed">Self-employed</option>
            <option value="retired">Retired</option>
            <option value="student">Student</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label>Marital Status</label>
          <select
            value={personalInfo.maritalStatus}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onChange={(e) => setPersonalInfo((prev: any) => ({ ...prev, maritalStatus: e.target.value }))}
          >
            <option value="single">Single</option>
            <option value="married">Married</option>
            <option value="divorced">Divorced</option>
            <option value="widowed">Widowed</option>
          </select>
        </div>

        <div className="form-group">
          <label>Number of Dependents</label>
          <div className="input-with-unit">
            <input
              type="number"
              value={getInputValue('personal', 'dependents', personalInfo.dependents)}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(e) => setPersonalInfo((prev: any) => ({ ...prev, dependents: Number(e.target.value) }))}
              onFocus={() => handleInputFocus('personal', 'dependents')}
              onBlur={() => handleInputBlur('personal', 'dependents')}
              placeholder="Enter number of dependents"
            />
            <span className="unit">persons</span>
          </div>
        </div>

        <div className="form-group">
          <label>City of Residence</label>
          <input
            type="text"
            value={personalInfo.city}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onChange={(e) => setPersonalInfo((prev: any) => ({ ...prev, city: e.target.value }))}
            placeholder="Enter your city"
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalTab;

// --- Usage Example ---
// import PersonalTab from "./components/FinancialPlanning/PersonalTab";
// ...
// {activeTab === "personal" && (
//   <PersonalTab
//     personalInfo={personalInfo}
//     getInputValue={getInputValue}
//     handleInputFocus={handleInputFocus}
//     handleInputBlur={handleInputBlur}
//     setPersonalInfo={setPersonalInfo}
//   />
// )}
