import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ViewQuizes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/view_all_quizzes`);
        setQuizzes(res.data.data); 
        setLoading(false);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  if (loading) return <p className="text-center mt-8">Loading quizzes...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-semibold mb-6 text-center">All Quizzes</h2>

      {quizzes.length === 0 ? (
        <p className="text-center text-gray-500">No quizzes found.</p>
      ) : (
        quizzes.map((quiz, qIndex) => (
          <div key={qIndex} className="border p-4 mb-4 rounded-lg shadow-sm bg-white">
            <h3 className="text-xl font-semibold mb-2">Quiz {qIndex + 1}</h3>
            {quiz.questions.map((q, i) => (
              <div key={i} className="mb-3">
                <p className="font-medium">{i + 1}. {q.questionText}</p>
                <ul className="list-disc list-inside ml-4">
                  {q.options.map((opt, j) => (
                    <li
                      key={j}
                      className={j === q.correctOption ? "font-bold text-green-600" : ""}
                    >
                      {opt}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default ViewQuizes;
