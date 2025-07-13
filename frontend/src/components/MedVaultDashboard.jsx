import React, { useState, useEffect, useRef, useContext } from 'react';
import { dataContext } from '../Context/UserContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import UserStats from './UserStats';

const MedVaultDashboard = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState('');
  const [chatWindow, setChatWindow] = useState({ open: false, doctor: '' });
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [timerSeconds, setTimerSeconds] = useState(12 * 24 * 3600);
  const [selectedChart, setSelectedChart] = useState('bp');
  const [selectedDataPoint, setSelectedDataPoint] = useState(null);
  const navigate = useNavigate();
  
  const [chartData, setChartData] = useState({
    bp: [
      { date: 'Day -30', value: 125, x: 120 },
      { date: 'Day -25', value: 122, x: 200 },
      { date: 'Day -20', value: 128, x: 280 },
      { date: 'Day -15', value: 130, x: 360 },
      { date: 'Day -10', value: 126, x: 440 },
      { date: 'Day -5', value: 124, x: 520 },
      { date: 'Today', value: 123, x: 600 }
    ],
    bmi: [
      { date: 'Day -30', value: 24.5, x: 120 },
      { date: 'Day -25', value: 24.6, x: 200 },
      { date: 'Day -20', value: 24.7, x: 280 },
      { date: 'Day -15', value: 24.4, x: 360 },
      { date: 'Day -10', value: 24.3, x: 440 },
      { date: 'Day -5', value: 24.1, x: 520 },
      { date: 'Today', value: 24.0, x: 600 }
    ],
    cholesterol: [
      { date: 'Day -30', value: 190, x: 120 },
      { date: 'Day -25', value: 188, x: 200 },
      { date: 'Day -20', value: 185, x: 280 },
      { date: 'Day -15', value: 182, x: 360 },
      { date: 'Day -10', value: 180, x: 440 },
      { date: 'Day -5', value: 178, x: 520 },
      { date: 'Today', value: 175, x: 600 }
    ]
  });
  const fileInputRef = useRef(null);
  const {serverUrl, userData, setUserData} = useContext(dataContext);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimerSeconds(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format timer display
  const handleLogOut = async ()=>{
    try{
      let result = await axios.get(serverUrl + '/auth/logout',{
        withCredentials:true
      });
      console.log(result);
      setUserData(null);
      navigate('/login')
      
    }catch(error){
      console.log(error.response.data.message);
      setUserData(null);
      navigate('/login')
    }
  }

  // Upload file function
  const uploadFile = () => {
    const file = fileInputRef.current?.files[0];
    if (!file) {
      alert('Please select a file first!');
      return;
    }

    setUploadProgress('Upload: 0%');
    let progress = 0;
    
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(`Upload: ${progress}%`);
      
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setUploadProgress('');
          const newFile = {
            id: Date.now(),
            name: file.name,
            uploadedAt: new Date().toLocaleString(),
            url: 'https://file-examples.com/storage/fe3d70ad6a1d11f59fa22d6/2017/10/file-sample_150kB.pdf'
          };
          setUploadedFiles(prev => [...prev, newFile]);
          if (fileInputRef.current) fileInputRef.current.value = '';
        }, 300);
      }
    }, 300);
  };

  // Chat functions
  const openChat = (doctorName) => {
    setChatWindow({ open: true, doctor: doctorName });
    setChatMessages([]);
  };

  const closeChat = () => {
    setChatWindow({ open: false, doctor: '' });
    setChatMessages([]);
  };

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    
    const userMessage = { type: 'user', text: chatInput, timestamp: Date.now() };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    
    // Simulate doctor response
    setTimeout(() => {
      const responses = [
        "Please follow your prescription.",
        "I'll review your reports.",
        "Stay hydrated!",
        "Make sure to get enough rest.",
        "Schedule a follow-up appointment if needed."
      ];
      const doctorMessage = {
        type: 'doctor',
        text: responses[Math.floor(Math.random() * responses.length)],
        timestamp: Date.now()
      };
      setChatMessages(prev => [...prev, doctorMessage]);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  // Chart functions
  const handleChartClick = (chartType) => {
    setSelectedChart(chartType);
    setSelectedDataPoint(null);
  };

  const handleDataPointClick = (dataPoint, index) => {
    setSelectedDataPoint({ ...dataPoint, index });
  };

  const generateChartPath = (data, chartType) => {
    const minValue = Math.min(...data.map(d => d.value));
    const maxValue = Math.max(...data.map(d => d.value));
    const range = maxValue - minValue || 1;
    
    return data.map((point, index) => {
      const y = 160 - ((point.value - minValue) / range) * 80; // Scale to fit 80px height
      return `${index === 0 ? 'M' : 'L'} ${point.x} ${y}`;
    }).join(' ');
  };

  const getScaledY = (value, data) => {
    const minValue = Math.min(...data.map(d => d.value));
    const maxValue = Math.max(...data.map(d => d.value));
    const range = maxValue - minValue || 1;
    return 160 - ((value - minValue) / range) * 80;
  };

  const addRandomDataPoint = () => {
    const currentData = chartData[selectedChart];
    const lastValue = currentData[currentData.length - 1].value;
    const variation = selectedChart === 'bp' ? 10 : selectedChart === 'bmi' ? 0.5 : 15;
    const newValue = lastValue + (Math.random() - 0.5) * variation;
    
    const newPoint = {
      date: `Day +${currentData.length - 6}`,
      value: Math.round(newValue * 10) / 10,
      x: 120 + (currentData.length * 80)
    };

    setChartData(prev => ({
      ...prev,
      [selectedChart]: [...prev[selectedChart], newPoint]
    }));
  };

  const resetChartData = () => {
    setChartData({
      bp: [
        { date: 'Day -30', value: 125, x: 120 },
        { date: 'Day -25', value: 122, x: 200 },
        { date: 'Day -20', value: 128, x: 280 },
        { date: 'Day -15', value: 130, x: 360 },
        { date: 'Day -10', value: 126, x: 440 },
        { date: 'Day -5', value: 124, x: 520 },
        { date: 'Today', value: 123, x: 600 }
      ],
      bmi: [
        { date: 'Day -30', value: 24.5, x: 120 },
        { date: 'Day -25', value: 24.6, x: 200 },
        { date: 'Day -20', value: 24.7, x: 280 },
        { date: 'Day -15', value: 24.4, x: 360 },
        { date: 'Day -10', value: 24.3, x: 440 },
        { date: 'Day -5', value: 24.1, x: 520 },
        { date: 'Today', value: 24.0, x: 600 }
      ],
      cholesterol: [
        { date: 'Day -30', value: 190, x: 120 },
        { date: 'Day -25', value: 188, x: 200 },
        { date: 'Day -20', value: 185, x: 280 },
        { date: 'Day -15', value: 182, x: 360 },
        { date: 'Day -10', value: 180, x: 440 },
        { date: 'Day -5', value: 178, x: 520 },
        { date: 'Today', value: 175, x: 600 }
      ]
    });
    setSelectedDataPoint(null);
  };



  const doctors = [
    { name: 'Dr. Rajesh Sharma', specialty: 'Cardiologist', image: 'https://randomuser.me/api/portraits/men/10.jpg' },
    { name: 'Dr. Priya Mehta', specialty: 'General Physician', image: 'https://randomuser.me/api/portraits/women/15.jpg' },
    { name: 'Dr. Arvind Patel', specialty: 'Ophthalmologist', image: 'https://randomuser.me/api/portraits/men/20.jpg' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white px-10 py-5 flex justify-between items-center shadow-sm">
        <div className="flex items-center font-bold text-xl text-blue-900">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
            M
          </div>
          MedVault
        </div>
        <button 
          onClick={handleLogOut}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-5 py-2 rounded-lg hover:opacity-90 transition-opacity"
        >
          Logout
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-5 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* User Details */}
          <div className="bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-center">👤 User Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-white/20">
                <span className="font-medium">Height</span>
                <span className="font-bold">{userData.Height}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/20">
                <span className="font-medium">Weight</span>
                <span className="font-bold">{userData.Weight} kg</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="font-medium">Blood Group</span>
                <span className="font-bold">{userData.BG}</span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-center text-blue-900">📊 Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">BMI</span>
                <span className="font-semibold text-blue-900">24.0</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Last Checkup</span>
                <span className="font-semibold text-blue-900">2 weeks ago</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Reports</span>
                <span className="font-semibold text-blue-900">{uploadedFiles.length} files</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-10">
          {/* Welcome Section */}
          <section className="bg-white rounded-2xl p-8 shadow-lg text-center">
            <h2 className="text-2xl font-bold text-blue-900 mb-6">Welcome to MedVault</h2>
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-900">M</span>
              </div>
            </div>
          </section>

          {/* Upload Section */}
          <section className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-xl font-bold text-blue-900 mb-4">Upload Your Medical Report</h2>
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <input
                ref={fileInputRef}
                type="file"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              />
              <button
                onClick={uploadFile}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                Upload
              </button>
            </div>
            {uploadProgress && (
              <div className="mt-3 text-gray-600 font-medium">{uploadProgress}</div>
            )}
          </section>

          {/* Uploaded Reports */}
          <section className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-xl font-bold text-blue-900 mb-4">Your Uploaded Reports</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {uploadedFiles.length === 0 ? (
                <p className="col-span-full text-center text-gray-500 py-8">No reports uploaded yet.</p>
              ) : (
                uploadedFiles.map(file => (
                  <div key={file.id} className="bg-gray-50 rounded-xl p-4 text-center shadow-sm">
                    <h4 className="font-semibold text-blue-900 mb-2">{file.name}</h4>
                    <p className="text-sm text-gray-600 mb-3">Uploaded: {file.uploadedAt}</p>
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      View Report
                    </a>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Health Trends */}
          <section className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-blue-900">Your Health Trends</h2>
              <div className="flex gap-2">
                <button
                  onClick={addRandomDataPoint}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm"
                >
                  Add Data Point
                </button>
                <button
                  onClick={resetChartData}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm"
                >
                  Reset
                </button>
              </div>
            </div>
            
            {/* Chart Type Selector */}
            <div className="flex gap-4 mb-6">
              {[
                { key: 'bp', label: 'Blood Pressure', color: 'bg-blue-500' },
                { key: 'bmi', label: 'BMI', color: 'bg-purple-500' },
                { key: 'cholesterol', label: 'Cholesterol', color: 'bg-cyan-500' }
              ].map(chart => (
                <button
                  key={chart.key}
                  onClick={() => handleChartClick(chart.key)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedChart === chart.key
                      ? `${chart.color} text-white shadow-lg`
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {chart.label}
                </button>
              ))}
            </div>

            {/* Selected Data Point Info */}
            {selectedDataPoint && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-blue-900 mb-2">Selected Data Point</h4>
                <p className="text-blue-800">
                  <span className="font-medium">Date:</span> {selectedDataPoint.date} | 
                  <span className="font-medium"> Value:</span> {selectedDataPoint.value}
                  {selectedChart === 'bp' && ' mmHg'}
                  {selectedChart === 'bmi' && ' kg/m²'}
                  {selectedChart === 'cholesterol' && ' mg/dL'}
                </p>
              </div>
            )}

            {/* Interactive Chart */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4 capitalize">
                {selectedChart === 'bp' ? 'Blood Pressure' : selectedChart === 'bmi' ? 'BMI' : 'Cholesterol'} Trends
              </h3>
              <div className="h-80 relative">
                <svg className="w-full h-full border rounded-lg bg-white" viewBox="0 0 800 250">
                  <defs>
                    <linearGradient id={`${selectedChart}Gradient`} x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor={
                        selectedChart === 'bp' ? '#6e8efb' : 
                        selectedChart === 'bmi' ? '#a777e3' : '#00c9ff'
                      } />
                      <stop offset="100%" stopColor={
                        selectedChart === 'bp' ? '#a777e3' : 
                        selectedChart === 'bmi' ? '#6e8efb' : '#92fe9d'
                      } />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                      <feMerge> 
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  
                  {/* Grid lines */}
                  <g stroke="#e5e7eb" strokeWidth="1" opacity="0.5">
                    {[60, 100, 140, 180, 220].map(y => (
                      <line key={y} x1="80" y1={y} x2="720" y2={y} />
                    ))}
                    {chartData[selectedChart].map((_, index) => (
                      <line key={index} x1={120 + index * 80} y1="60" x2={120 + index * 80} y2="220" />
                    ))}
                  </g>

                  {/* Chart area fill */}
                  <path
                    d={`${generateChartPath(chartData[selectedChart], selectedChart)} L 720 220 L 120 220 Z`}
                    fill={`url(#${selectedChart}Gradient)`}
                    opacity="0.2"
                  />

                  {/* Data line */}
                  <path
                    d={generateChartPath(chartData[selectedChart], selectedChart)}
                    fill="none"
                    stroke={`url(#${selectedChart}Gradient)`}
                    strokeWidth="3"
                    filter="url(#glow)"
                    className="transition-all duration-300"
                  />

                  {/* Data points */}
                  {chartData[selectedChart].map((point, index) => (
                    <circle
                      key={`${point.date}-${index}`}
                      cx={point.x}
                      cy={getScaledY(point.value, chartData[selectedChart])}
                      r={selectedDataPoint?.index === index ? "8" : "6"}
                      fill={selectedDataPoint?.index === index ? "#ff6b6b" : 
                        selectedChart === 'bp' ? '#6e8efb' : 
                        selectedChart === 'bmi' ? '#a777e3' : '#00c9ff'
                      }
                      stroke="white"
                      strokeWidth="2"
                      className="cursor-pointer transition-all duration-200 hover:r-8"
                      onClick={() => handleDataPointClick(point, index)}
                      style={{ filter: selectedDataPoint?.index === index ? 'drop-shadow(0 0 8px rgba(255,107,107,0.6))' : 'none' }}
                    />
                  ))}

                  {/* Value labels on hover */}
                  {chartData[selectedChart].map((point, index) => (
                    <text
                      key={`label-${point.date}-${index}`}
                      x={point.x}
                      y={getScaledY(point.value, chartData[selectedChart]) - 15}
                      textAnchor="middle"
                      className="text-xs font-medium fill-gray-700 opacity-0 hover:opacity-100 transition-opacity pointer-events-none"
                      style={{ 
                        opacity: selectedDataPoint?.index === index ? 1 : 0 
                      }}
                    >
                      {point.value}
                    </text>
                  ))}

                  {/* X-axis labels */}
                  {chartData[selectedChart].map((point, index) => (
                    <text
                      key={`x-label-${index}`}
                      x={point.x}
                      y="240"
                      textAnchor="middle"
                      className="text-xs fill-gray-600"
                    >
                      {point.date}
                    </text>
                  ))}
                </svg>
              </div>
              
              {/* Chart Statistics */}
              <div className="mt-4 grid grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-3 border">
                  <p className="text-sm text-gray-600">Average</p>
                  <p className="text-lg font-semibold text-blue-900">
                    {(chartData[selectedChart].reduce((sum, point) => sum + point.value, 0) / chartData[selectedChart].length).toFixed(1)}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3 border">
                  <p className="text-sm text-gray-600">Highest</p>
                  <p className="text-lg font-semibold text-green-600">
                    {Math.max(...chartData[selectedChart].map(p => p.value))}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3 border">
                  <p className="text-sm text-gray-600">Lowest</p>
                  <p className="text-lg font-semibold text-red-600">
                    {Math.min(...chartData[selectedChart].map(p => p.value))}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Chat with Doctors */}
          <section className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-xl font-bold text-blue-900 mb-6">Chat with Doctors</h2>
            <div className="space-y-4">
              {doctors.map(doctor => (
                <div key={doctor.name} className="flex items-center bg-blue-50 p-4 rounded-xl shadow-sm">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-blue-900">{doctor.name}</h4>
                    <p className="text-gray-600">{doctor.specialty}</p>
                  </div>
                  <button
                    onClick={() => openChat(doctor.name)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Chat
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Chat Window */}
      {chatWindow.open && (
        <div className="fixed bottom-5 right-5 w-80 bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden z-50">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 flex justify-between items-center">
            <span className="font-semibold">Chat with {chatWindow.doctor}</span>
            <button
              onClick={closeChat}
              className="text-white hover:text-gray-200 text-xl font-bold"
            >
              ×
            </button>
          </div>
          
          <div className="flex-1 p-4 bg-gray-50 max-h-80 overflow-y-auto space-y-2">
            {chatMessages.map(msg => (
              <div
                key={msg.timestamp}
                className={`max-w-xs p-2 rounded-lg text-sm ${
                  msg.type === 'user'
                    ? 'bg-blue-100 ml-auto text-right'
                    : 'bg-gray-200 mr-auto text-left'
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>
          
          <div className="flex border-t">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 p-3 border-none outline-none"
            />
            <button
              onClick={sendMessage}
              className="bg-blue-500 text-white px-4 py-3 hover:bg-blue-600 transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedVaultDashboard;
