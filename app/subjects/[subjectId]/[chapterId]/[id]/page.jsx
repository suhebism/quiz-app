"use client";
import { usePathname, useRouter } from 'next/navigation';
import quizData from '../../../../../data/quizData'; // Adjust the path as necessary
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scale, X } from 'lucide-react';



export default function QuizPage() {
  const pathname = usePathname(); // Get the current pathname
  const router = useRouter(); // Initialize the router
  const [subject, setSubject] = useState(null);
  const [chapter, setChapter] = useState(null);
  const [level, setLevel] = useState(null);
  const [loadingSubject, setLoadingSubject] = useState(true);
  const [loadingChapter, setLoadingChapter] = useState(true);
  const [loadingLevel, setLoadingLevel] = useState(true);
  const [prompt, setPrompt] = useState (false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Track current question index
  const [selectedAnswer, setSelectedAnswer] = useState(null); // Track selected answer
  const [score, setScore] = useState(0); // Track score
  const [showResult, setShowResult] = useState(false); // Show results at the end

  useEffect(() => {
    const segments = pathname.split('/').filter(Boolean); // Split the pathname and remove empty segments
    const subjectId = segments[1]; // subjectId is at index 1
    const chapterId = segments[2]; // chapterId is at index 2
    const levelId = segments[3]; // levelId is at index 3

    // Find the subject based on subjectId
    if (subjectId) {
      const foundSubject = quizData.subjects.find((subj) => subj.id === subjectId);
      if (foundSubject) {
        setSubject(foundSubject);
        setLoadingSubject(false);
      } else {
        console.warn('No subject found for ID:', subjectId);
        setLoadingSubject(false);
      }
    }
  }, [pathname]);

  useEffect(() => {
    if (subject && pathname) {
      const segments = pathname.split('/').filter(Boolean);
      const chapterId = segments[2];

      // Find the chapter based on chapterId
      if (chapterId) {
        const foundChapter = subject.chapters.find((chap) => chap.id === chapterId);
        if (foundChapter) {
          setChapter(foundChapter);
          setLoadingChapter(false);
        } else {
          console.warn('No chapter found for ID:', chapterId);
          setLoadingChapter(false);
        }
      }
    }
  }, [subject, pathname]);

  useEffect(() => {
    if (chapter && pathname) {
      const segments = pathname.split('/').filter(Boolean);
      const levelId = segments[3];

      // Find the level based on levelId
      if (levelId) {
        const foundLevel = chapter.levels.find((lvl) => lvl.id === levelId);
        if (foundLevel) {
          setLevel(foundLevel);
          setLoadingLevel(false);
        } else {
          console.warn('No level found for ID:', levelId);
          setLoadingLevel(false);
        }
      }
    }
  }, [chapter, pathname]);

  const handleAnswerSubmit = () => {
    const currentQuestion = level?.questions?.[currentQuestionIndex];
  
    if (!currentQuestion) {
      console.error('Current question is undefined.');
      return;
    }
  
    // Capture the selected answer text based on the selected index
    const selectedAnswerText = currentQuestion.options[selectedAnswer];
  
    // Debugging: Log selected answer and correct answer for comparison
    console.log('Selected Answer:', selectedAnswerText);
    console.log('Correct Answer:', currentQuestion.correctAnswer);
  
    if (!selectedAnswerText) {
      alert("Please select an answer");
      return;
    }
  
    // Compare the selected answer with the correctAnswer string
    if (selectedAnswerText === currentQuestion.answer) {
      setScore(score + 1); // Increase score if correct
  
      if (currentQuestionIndex < level.questions.length - 1) {
        // Move to the next question
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null); // Reset selected answer for the next question
      } else {
        setShowResult(true); // Show the result if it's the last question
      }
    } else {
      alert("Wrong answer! Try again.");
    }
  };

  const handleNextLevel = () => {
    // Find the index of the current level
    const currentLevelIndex = chapter.levels.findIndex((lvl) => lvl.id === level.id);
  
    // Log current level and index for debugging
    console.log('Current Level ID:', level.id);
    console.log('Current Level Index:', currentLevelIndex);
    console.log('Total Levels in Chapter:', chapter.levels.length);
    
    // Check if there's a next level
    if (currentLevelIndex < chapter.levels.length - 1) {
      const nextLevel = chapter.levels[currentLevelIndex + 1];
      console.log('Next Level ID:', nextLevel.id); // Log the next level's ID
      // Navigate to the next level's URL
      router.push(`/subjects/${subject.id}/${chapter.id}/${nextLevel.id}`);
    } else {
      // If there are no more levels, navigate back or display a message
      alert("You've completed all levels in this chapter!");
      // Optionally, navigate back to the chapter or subject
      // router.push(`/${subject.id}/${chapter.id}`);
    }
  };
  

  if (loadingSubject || loadingChapter || loadingLevel) {
    return <div>Loading...</div>;
  }

  if (!subject) {
    return <div>Subject not found!</div>;
  }

  if (!chapter) {
    return <div>Chapter not found!</div>;
  }

  if (!level) {
    return <div>Level not found!</div>;
  }

  
 
  const promptToClose =()=>{
    setPrompt(true);
  }
  const confirmExit=(choice)=>{
    if (choice ==='yes'){
      router.push('/');
    } else{
      setPrompt(false);
    }
  }
  return (
    <motion.div 
    initial={{ opacity: 0 }} // Initial state (hidden)
    animate={{ opacity: 1 }} // End state (visible)
    transition={{ duration: 0.5 }} // Transition duration
    className="flex flex-col items-center h-screen pt-5 pb-10 justify-between">
      <X className="fixed top-5 left-5 text-white cursor-pointer" onClick={promptToClose}/>
      <h1>{subject.name} - {chapter.name} - {level.name} Quiz</h1>
      <AnimatePresence>
      {prompt &&(    
          <div
          className='fixed z-50 h-screen w-screen bg-opacity-50 backdrop-blur-md  text-white flex items-center justify-center transition ease-in-out delay-500 duration-500'
          onClick={() => setPrompt(false)} // Close modal when clicking outside
          >
          <motion.div
            initial={{ y: -200 }}
            animate={{ y: 0 }}
            exit={{ y: -200 }} // Exit animation
            transition={{ duration: 0.2, ease: "easeInOut" }} // Adjust duration for exit animation
            className='absolute -top-5 h-[160px] w-screen bg-[#75BC7B] flex flex-col items-center justify-around rounded-b-3xl'
            onClick={(e) => e.stopPropagation()} // Prevent click from propagating to the backdrop
          >
            <h1 className='font-semibold text-lg text-black'>Do you really want to exit?</h1>
            <div className='flex gap-5'>
              <button className='w-28 h-10 bg-white text-black font-bold text-lg rounded-full' onClick={() => confirmExit('yes')}>Yes</button>
              <button className='w-28 h-10 bg-black text-white font-bold text-lg rounded-full' onClick={() => confirmExit('no')}>No</button>
            </div>
          </motion.div>
        </div>
        )
      }
      </AnimatePresence>
      {showResult ? (
        <>
          <div>
            <h2>Quiz Complete!</h2>
            <p>Your score is: {score} / {level.questions.length}</p>
          </div>
          <button onClick={handleNextLevel}>Next Level</button> {/* Call handleNextLevel on click */}
        </>
      ) : (
        <div>
          {/* Show current question */}
          <h2>Question {currentQuestionIndex + 1} of {level.questions.length}</h2>
          <p>{level.questions[currentQuestionIndex].question}</p>

          {/* Render options for the current question */}
          <ul>
            {level.questions[currentQuestionIndex].options.map((option, index) => (
              <li key={index}>
                <label>
                  <input
                    type="radio"
                    name="answer"
                    value={index}
                    checked={selectedAnswer === index}
                    onChange={() => setSelectedAnswer(index)} // Set selected answer
                  />
                  {option}
                </label>
              </li>
            ))}
          </ul>

          {/* Submit button */}
          <button onClick={handleAnswerSubmit} disabled={selectedAnswer === null}>
            Submit Answer
          </button>
        </div>
      )}
    </motion.div>
  );
}
