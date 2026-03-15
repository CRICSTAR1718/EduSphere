import { useEffect, useState } from "react";
import { useFeedback } from "../../context/FeedbackContext";
import FeedbackTable from "../common/FeedbackTable";

const CourseFeedback = ({ courseId }) => {
  const { fetchCourseFeedback } = useFeedback();
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const load = async () => {
      const data = await fetchCourseFeedback(courseId);
      setFeedbacks(data);
    };

    load();
  }, [courseId]);

  
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">
        Course Feedback
      </h2>

      <FeedbackTable feedbacks={feedbacks} />
    </div>
  );
};

export default CourseFeedback;
