import React, { useState, useEffect } from 'react';

// Dummy Data for Associates
const dummyAssociates = [
  { id: 'emp001', name: 'Alice Johnson', skills: ['React', 'Node.js', 'AWS', 'Project Management'], experience: 'Senior', availability: 'Immediate' },
  { id: 'emp002', name: 'Bob Williams', skills: ['Python', 'Machine Learning', 'Data Analysis', 'SQL'], experience: 'Mid-Level', availability: '2 Weeks' },
  { id: 'emp003', name: 'Charlie Brown', skills: ['Java', 'Spring Boot', 'Microservices', 'Cloud Computing'], experience: 'Senior', availability: '1 Week' },
  { id: 'emp004', name: 'Diana Prince', skills: ['UI/UX Design', 'Figma', 'User Research', 'Frontend'], experience: 'Mid-Level', availability: 'Immediate' },
  { id: 'emp005', name: 'Eve Adams', skills: ['Python', 'Data Engineering', 'ETL', 'Azure'], experience: 'Junior', availability: 'Immediate' },
  { id: 'emp006', name: 'Frank White', skills: ['Project Management', 'Agile', 'Scrum', 'Stakeholder Management'], experience: 'Senior', availability: '3 Weeks' },
  { id: 'emp007', name: 'Grace Taylor', skills: ['React', 'TypeScript', 'GraphQL', 'DevOps'], experience: 'Mid-Level', availability: 'Immediate' },
  { id: 'emp008', name: 'Henry Green', skills: ['Cybersecurity', 'Network Security', 'Compliance', 'Penetration Testing'], experience: 'Senior', availability: '1 Month' },
  { id: 'emp009', name: 'Ivy King', skills: ['Mobile Development', 'Swift', 'Kotlin', 'iOS', 'Android'], experience: 'Mid-Level', availability: 'Immediate' },
  { id: 'emp010', name: 'Jack Lee', skills: ['Cloud Architecture', 'GCP', 'Kubernetes', 'Terraform'], experience: 'Senior', availability: '2 Weeks' },
];

// Helper function to simulate API call and matching
const simulateMatching = (projectNeeds) => {
  return new Promise(resolve => {
    setTimeout(() => {
      const requiredSkills = projectNeeds.skills.toLowerCase().split(',').map(s => s.trim()).filter(s => s);
      const requiredExperience = projectNeeds.experience.toLowerCase();

      let matchedAssociates = dummyAssociates.map(associate => {
        let score = 0;
        // Score based on skill match
        requiredSkills.forEach(reqSkill => {
          if (associate.skills.some(s => s.toLowerCase().includes(reqSkill))) {
            score += 1;
          }
        });
        // Score based on experience level (simple match for demo)
        if (requiredExperience && associate.experience.toLowerCase().includes(requiredExperience)) {
          score += 2; // Higher score for experience match
        }
        return { ...associate, matchScore: score };
      })
      .filter(associate => associate.matchScore > 0) // Only show associates with at least one match
      .sort((a, b) => b.matchScore - a.matchScore) // Sort by highest score first
      .slice(0, 5); // Get top 5

      resolve(matchedAssociates);
    }, 1500); // Simulate network delay
  });
};

// Main App Component
function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [projectInput, setProjectInput] = useState({
    projectName: '',
    skills: '',
    experience: '',
    duration: '',
  });
  const [matchedResults, setMatchedResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProjectInput(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitProject = async (e) => {
    e.preventDefault();
    if (!projectInput.projectName || !projectInput.skills || !projectInput.experience) {
      setModalMessage("Please fill in all required project fields (Project Name, Required Skills, Experience Level).");
      setShowModal(true);
      return;
    }

    setLoading(true);
    setMatchedResults([]); // Clear previous results
    const results = await simulateMatching(projectInput);
    setMatchedResults(results);
    setLoading(false);
    setCurrentPage('matching');
  };

  const showInfoModal = (message) => {
    setModalMessage(message);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalMessage('');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] p-4 text-center">
            <h2 className="text-4xl font-extrabold text-gray-800 mb-6 animate-fade-in-down">
              Welcome to <span className="text-blue-700">SkillSync AI</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mb-8 animate-fade-in">
              Your intelligent copilot for revolutionizing talent deployment.
              Proactively match the right associate with the right project, every time.
            </p>
            <button
              onClick={() => setCurrentPage('matchProject')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition duration-300 hover:scale-105 animate-bounce-in"
            >
              Get Started: Match a Project
            </button>
          </div>
        );
      case 'matchProject':
        return (
          <div className="container mx-auto p-6 bg-white rounded-xl shadow-lg my-8 max-w-3xl animate-slide-in-right">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Match Project with Talent</h2>
            <form onSubmit={handleSubmitProject} className="space-y-6">
              <div>
                <label htmlFor="projectName" className="block text-gray-700 text-sm font-semibold mb-2">
                  Project Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="projectName"
                  name="projectName"
                  value={projectInput.projectName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  placeholder="e.g., Q3 Marketing Campaign"
                />
              </div>
              <div>
                <label htmlFor="skills" className="block text-gray-700 text-sm font-semibold mb-2">
                  Required Skills (comma-separated) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="skills"
                  name="skills"
                  value={projectInput.skills}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  placeholder="e.g., React, Node.js, AWS"
                />
              </div>
              <div>
                <label htmlFor="experience" className="block text-gray-700 text-sm font-semibold mb-2">
                  Experience Level <span className="text-red-500">*</span>
                </label>
                <select
                  id="experience"
                  name="experience"
                  value={projectInput.experience}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                >
                  <option value="">Select Experience Level</option>
                  <option value="Junior">Junior</option>
                  <option value="Mid-Level">Mid-Level</option>
                  <option value="Senior">Senior</option>
                </select>
              </div>
              <div>
                <label htmlFor="duration" className="block text-gray-700 text-sm font-semibold mb-2">
                  Project Duration (Optional)
                </label>
                <input
                  type="text"
                  id="duration"
                  name="duration"
                  value={projectInput.duration}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  placeholder="e.g., 3 months"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transform transition duration-300 hover:scale-105"
                disabled={loading}
              >
                {loading ? 'Matching Talent...' : 'Find Best-Fit Associates'}
              </button>
            </form>
          </div>
        );
      case 'matching':
        return (
          <div className="container mx-auto p-6 bg-white rounded-xl shadow-lg my-8 animate-slide-in-right">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Top Matched Associates for "{projectInput.projectName}"</h2>
            {loading ? (
              <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
                <p className="ml-4 text-gray-600">Finding the perfect match...</p>
              </div>
            ) : matchedResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {matchedResults.map(associate => (
                  <div key={associate.id} className="bg-blue-50 p-6 rounded-lg shadow-md border border-blue-200 hover:shadow-lg transition duration-300">
                    <h3 className="text-xl font-semibold text-blue-800 mb-2">{associate.name}</h3>
                    <p className="text-gray-700 mb-1">
                      <span className="font-medium">Experience:</span> {associate.experience}
                    </p>
                    <p className="text-gray-700 mb-1">
                      <span className="font-medium">Skills:</span> {associate.skills.join(', ')}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Availability:</span> {associate.availability}
                    </p>
                    <p className="text-green-600 font-bold mt-2">Match Score: {associate.matchScore}</p>
                    <button
                      onClick={() => showInfoModal(`Details for ${associate.name}:\nID: ${associate.id}\nSkills: ${associate.skills.join(', ')}\nExperience: ${associate.experience}\nAvailability: ${associate.availability}\n\n(In a real app, you'd see more detailed profile info here!)`)}
                      className="mt-4 bg-blue-500 hover:bg-blue-600 text-white text-sm py-2 px-4 rounded-full transition duration-300"
                    >
                      View Profile
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-600 py-10">No associates found matching your criteria. Try adjusting your skills or experience level.</p>
            )}
            <div className="text-center mt-8">
              <button
                onClick={() => setCurrentPage('matchProject')}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg shadow-md transform transition duration-300 hover:scale-105"
              >
                Match Another Project
              </button>
            </div>
          </div>
        );
      case 'skillGap':
        return (
          <div className="container mx-auto p-6 bg-white rounded-xl shadow-lg my-8 max-w-3xl animate-slide-in-right">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Proactive Skill Gap Analysis</h2>
            <p className="text-gray-700 mb-4">
              SkillSync AI analyzes the pipeline of upcoming projects to forecast future skill demands, highlighting potential shortages and surpluses within your organization.
            </p>
            <div className="bg-gray-100 p-6 rounded-lg border border-gray-200 text-center">
              <p className="text-gray-600 italic">
                [Conceptual Display: Imagine a dynamic chart showing forecasted skill demand vs. current supply, with red areas indicating gaps for future projects (e.g., "Advanced AI/ML," "Quantum Computing").]
              </p>
              <p className="text-blue-600 font-semibold mt-4">
                This helps you proactively plan for talent development and strategic hiring.
              </p>
            </div>
            <div className="text-center mt-8">
              <button
                onClick={() => setCurrentPage('home')}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg shadow-md transform transition duration-300 hover:scale-105"
              >
                Back to Home
              </button>
            </div>
          </div>
        );
      case 'upskilling':
        return (
          <div className="container mx-auto p-6 bg-white rounded-xl shadow-lg my-8 max-w-3xl animate-slide-in-right">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Personalized Upskilling Pathways</h2>
            <p className="text-gray-700 mb-4">
              When SkillSync AI identifies associates on projects with soon-to-be-outdated tech or areas of growth, it suggests relevant, personalized upskilling courses.
            </p>
            <div className="bg-gray-100 p-6 rounded-lg border border-gray-200 text-center">
              <p className="text-gray-600 italic">
                [Conceptual Display: Imagine a list of associates with suggested courses based on their current projects and future skill demands. E.g., "Alice Johnson: Recommended: Advanced AWS Solutions Architect Certification."]
              </p>
              <p className="text-blue-600 font-semibold mt-4">
                Turning potential liabilities into growth opportunities and boosting employee career satisfaction.
              </p>
            </div>
            <div className="text-center mt-8">
              <button
                onClick={() => setCurrentPage('home')}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg shadow-md transform transition duration-300 hover:scale-105"
              >
                Back to Home
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 font-inter antialiased">
      {/* Tailwind CSS CDN */}
      <script src="https://cdn.tailwindcss.com"></script>
      {/* Inter Font CDN */}
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* Header */}
      <header className="bg-white shadow-md py-4">
        <nav className="container mx-auto flex justify-between items-center px-6">
          <div className="text-2xl font-bold text-blue-700">SkillSync AI</div>
          <ul className="flex space-x-6">
            <li>
              <button
                onClick={() => setCurrentPage('home')}
                className={`text-gray-700 hover:text-blue-600 font-medium transition duration-200 ${currentPage === 'home' ? 'text-blue-600 border-b-2 border-blue-600' : ''}`}
              >
                Home
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentPage('matchProject')}
                className={`text-gray-700 hover:text-blue-600 font-medium transition duration-200 ${currentPage === 'matchProject' || currentPage === 'matching' ? 'text-blue-600 border-b-2 border-blue-600' : ''}`}
              >
                Match Project
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentPage('skillGap')}
                className={`text-gray-700 hover:text-blue-600 font-medium transition duration-200 ${currentPage === 'skillGap' ? 'text-blue-600 border-b-2 border-blue-600' : ''}`}
              >
                Skill Gap Analysis
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentPage('upskilling')}
                className={`text-gray-700 hover:text-blue-600 font-medium transition duration-200 ${currentPage === 'upskilling' ? 'text-blue-600 border-b-2 border-blue-600' : ''}`}
              >
                Upskilling Pathways
              </button>
            </li>
          </ul>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {renderPage()}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-8">
        <div className="container mx-auto text-center px-6">
          <p className="text-lg mb-2">SkillSync AI - Intelligent Talent Deployment</p>
          <p className="text-sm text-gray-400">&copy; 2025 TCS. All rights reserved.</p>
          <p className="text-sm text-gray-400">Contact: info@skillsync.ai</p>
        </div>
      </footer>

      {/* Modal for messages */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-sm w-full text-center transform scale-95 animate-scale-in">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Notification</h3>
            <p className="text-gray-700 mb-6">{modalMessage}</p>
            <button
              onClick={closeModal}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Custom styles for animations */}
      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes bounceIn {
          0%, 20%, 40%, 60%, 80%, 100% {
            transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
          }
          0% { opacity: 0; transform: scale3d(0.3, 0.3, 0.3); }
          20% { transform: scale3d(1.1, 1.1, 1.1); }
          40% { transform: scale3d(0.9, 0.9, 0.9); }
          60% { opacity: 1; transform: scale3d(1.03, 1.03, 1.03); }
          80% { transform: scale3d(0.97, 0.97, 0.97); }
          100% { opacity: 1; transform: scale3d(1, 1, 1); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }

        .animate-fade-in-down { animation: fadeInDown 0.8s ease-out forwards; }
        .animate-fade-in { animation: fadeIn 0.6s ease-out forwards; }
        .animate-slide-in-right { animation: slideInRight 0.7s ease-out forwards; }
        .animate-bounce-in { animation: bounceIn 1s ease-out forwards; }
        .animate-scale-in { animation: scaleIn 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
}

export default App;
