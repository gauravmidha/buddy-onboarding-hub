'use client';

import { useState, useEffect } from 'react';

interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  manager: string;
  start_date: string;
}

export const useEmployee = () => {
  const [employee, setEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    const storedEmployee = localStorage.getItem('currentEmployee');
    if (storedEmployee) {
      setEmployee(JSON.parse(storedEmployee));
    }
  }, []);

  const saveEmployee = (emp: Employee) => {
    localStorage.setItem('currentEmployee', JSON.stringify(emp));
    setEmployee(emp);
  };

  const clearEmployee = () => {
    localStorage.removeItem('currentEmployee');
    setEmployee(null);
  };

  return {
    employee,
    saveEmployee,
    clearEmployee
  };
};