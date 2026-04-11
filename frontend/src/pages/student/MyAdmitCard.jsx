import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import AdmitCardPreview from '../../components/student/AdmitCardPreview';

const MyAdmitCard = () => {
    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
                <header className="print:hidden">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Examination</h1>
                    <p className="text-gray-500 mt-1 text-sm sm:text-base">Access your hall tickets and examination schedule.</p>
                </header>

                <AdmitCardPreview studentData={null} />
            </div>
        </DashboardLayout>
    );
};

export default MyAdmitCard;
