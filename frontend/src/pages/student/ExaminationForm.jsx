import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import ExamForm from '../../components/student/ExamForm';
import { motion } from 'framer-motion';

const ExaminationForm = () => {
    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 md:py-12 space-y-8 sm:space-y-12">
                <header className="relative mb-8 sm:mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative z-10"
                    >
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-3 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-600">
                            Examination Form
                        </h1>
                        <p className="text-base sm:text-lg text-slate-500 max-w-2xl leading-relaxed">
                            Complete your end-semester registration with our intelligent process.
                            Select your specialized subjects for the upcoming evaluation cycle.
                        </p>
                    </motion.div>
                    <div className="absolute -top-24 -left-24 w-48 h-48 sm:w-64 sm:h-64 bg-indigo-50/50 rounded-full blur-3xl -z-0" />
                </header>

                <ExamForm />
            </div>
        </DashboardLayout>
    );
};

export default ExaminationForm;
