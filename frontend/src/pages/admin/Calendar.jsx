import DashboardLayout from "../../components/layout/DashboardLayout";
function Calendar() {
    return (
        <DashboardLayout>

            <div className="bg-white p-8 rounded-2xl shadow-md max-w-4xl">
                <h2 className="text-xl font-semibold text-slate-700 mb-6">
                    Academic Calendar
                </h2>

                <ul className="space-y-4 text-gray-700">
                    <li>📅 Semester Start — 1 January 2026</li>
                    <li>📅 Midterm Exams — 20 March 2026</li>
                    <li>📅 Final Exams — 15 June 2026</li>
                    <li>📅 Result Declaration — 30 June 2026</li>
                </ul>

            </div>

        </DashboardLayout>
    );
}

export default Calendar;
