import DashboardLayout from "../../components/layout/DashboardLayout";
import WeeklyTimetable from "../../components/common/WeeklyTimetable";

function Timetable() {

    // Later this should come from logged-in user data
    const studentClass = "BTech CSE 2A";

    return (
        <DashboardLayout>
            <div className="space-y-8 animate-fadeIn">

                <h2 className="text-xl font-semibold">
                    My Class Timetable
                </h2>

                <WeeklyTimetable classNameFilter={studentClass} />

            </div>
        </DashboardLayout>
    );
}

export default Timetable;