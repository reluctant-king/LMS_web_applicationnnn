import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const UserQuiz = () => {
  const navigate = useNavigate();
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/v1/view_quiz/${quizId}`)
      .then(res => {
        const quizData = res.data.data;
        setQuiz(quizData);

        // Initialize answers with questionId
        setAnswers(quizData.questions.map(q => ({
          questionId: q._id,
          selectedOption: -1
        })));
      })
      .catch(err => console.error(err));
  }, [quizId]);

  const handleOptionChange = (qIndex, oIndex) => {
    const newAnswers = [...answers];
    newAnswers[qIndex].selectedOption = oIndex;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    axios.post(`${import.meta.env.VITE_API_URL}/api/v1/submit_quiz`, { quizId, answers })
      .then(res => alert(`Quiz submitted! Score: ${res.data.data.score}`))
    navigate("/quizzes")
      .catch(err => {
        console.error(err.response?.data || err);
        alert("Failed to submit quiz. Check console for details.");
      });
  };

  if (!quiz) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Take Quiz</h2>
      {quiz.questions.map((q, qIndex) => (
        <div key={qIndex} className="mb-4 border p-4 rounded bg-gray-50">
          <p className="font-medium mb-2">{qIndex + 1}. {q.questionText}</p>
          {q.options.map((opt, oIndex) => (
            <label key={oIndex} className="block mb-1">
              <input
                type="radio"
                name={`question-${qIndex}`}
                checked={answers[qIndex]?.selectedOption === oIndex}
                onChange={() => handleOptionChange(qIndex, oIndex)}
                className="mr-2"
              />
              {opt}
            </label>
          ))}
        </div>
      ))}
      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-5 py-2 rounded mt-4"
      >
        Submit Quiz
      </button>
    </div>
  );
};

export default UserQuiz;
