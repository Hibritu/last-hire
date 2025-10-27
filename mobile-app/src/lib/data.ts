export const categories = ["All Jobs", "All", "Frontend", "Backend", "Full Stack", "Design", "DevOps"];

export const featuredJobs = [
  {
    id: "1",
    title: "Senior React Developer",
    company: "TechCorp",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$120k - $180k",
    remote: true,
    featured: true,
    rating: 4.8,
    skills: ["React", "TypeScript", "Next.js", "GraphQL", "AWS"],
    logo: "🚀",
    postedDate: "2024-01-20",
    category: "Frontend",
  },
  {
    id: "2",
    title: "UX/UI Designer",
    company: "DesignStudio",
    location: "New York, NY",
    type: "Full-time",
    salary: "$90k - $130k",
    remote: false,
    featured: true,
    rating: 4.6,
    skills: ["Figma", "Adobe XD", "Prototyping", "User Research"],
    logo: "🎨",
    postedDate: "2024-01-18",
    category: "Design",
  },
];

export const regularJobs = [
  {
    id: "3",
    title: "Full Stack Engineer",
    company: "StartupXYZ",
    location: "Austin, TX",
    type: "Full-time",
    salary: "$100k - $140k",
    remote: true,
    featured: false,
    rating: 4.2,
    skills: ["Node.js", "React", "PostgreSQL", "Docker"],
    logo: "⚡",
    postedDate: "2024-01-15",
    category: "Full Stack",
  },
  {
    id: "4",
    title: "DevOps Engineer",
    company: "CloudTech",
    location: "Seattle, WA",
    type: "Full-time", 
    salary: "$110k - $160k",
    remote: true,
    featured: false,
    rating: 4.5,
    skills: ["Kubernetes", "AWS", "Terraform", "CI/CD"],
    logo: "☁️",
    postedDate: "2024-01-12",
    category: "DevOps",
  },
];

export const stats = [
  { label: "Active Jobs", value: "12.5k", color: "text-primary" },
  { label: "New This Week", value: "1.2k", color: "text-green-500" },
  { label: "Remote Jobs", value: "8.7k", color: "text-blue-500" },
];

export const conversations = [
    {
      id: 1,
      participant: "Alice Johnson",
      lastMessage: "Sounds great! Looking forward to it.",
      avatar: "/placeholder.svg",
      messages: [
        { id: 1, sender: "Alice Johnson", content: "Hi there! I saw your portfolio and I'm really impressed with your work on the e-commerce project.", timestamp: "10:00 AM" },
        { id: 2, sender: "You", content: "Thank you, Alice! I'm glad you liked it. How can I help you?", timestamp: "10:05 AM" },
        { id: 3, sender: "Alice Johnson", content: "I'm looking for a freelance developer for a similar project. Would you be available for a quick chat this week?", timestamp: "10:10 AM" },
        { id: 4, sender: "You", content: "Yes, I'd be happy to. Please suggest a time that works for you.", timestamp: "10:15 AM" },
        { id: 5, sender: "Alice Johnson", content: "Sounds great! Looking forward to it.", timestamp: "10:20 AM" },
      ],
    },
    {
      id: 2,
      participant: "Bob Williams",
      lastMessage: "Let's connect next week.",
      avatar: "/placeholder.svg",
      messages: [
        { id: 6, sender: "Bob Williams", content: "Hello! Your mobile app UI/UX design caught my eye. Very clean!", timestamp: "Yesterday" },
        { id: 7, sender: "You", content: "Thanks, Bob! What can I do for you?", timestamp: "Yesterday" },
        { id: 8, sender: "Bob Williams", content: "I have a new app idea and need a designer. Are you taking on new projects?", timestamp: "Yesterday" },
        { id: 9, sender: "You", content: "I am! Let's connect next week.", timestamp: "Yesterday" },
      ],
    },
  ];

// Combined all jobs for browse screen
export const allJobs = [...featuredJobs, ...regularJobs];

// Sample applications data
export const applications = [
  {
    id: "app1",
    jobTitle: "Senior React Developer",
    company: "TechCorp",
    logo: "🚀",
    appliedDate: "2024-01-15",
    status: "pending",
    statusColor: "bg-yellow-500",
    nextStep: "Interview scheduled for next week",
  },
  {
    id: "app2",
    jobTitle: "UX/UI Designer",
    company: "DesignStudio", 
    logo: "🎨",
    appliedDate: "2024-01-10",
    status: "shortlisted",
    statusColor: "bg-blue-500",
    nextStep: "Portfolio review in progress",
  },
  {
    id: "app3",
    jobTitle: "Full Stack Engineer",
    company: "StartupXYZ",
    logo: "⚡",
    appliedDate: "2024-01-05",
    status: "rejected",
    statusColor: "bg-red-500",
    nextStep: "Application was not successful",
  },
];

// Sample saved jobs data
export const savedJobs = [
  {
    id: "save1",
    title: "Frontend Developer",
    company: "WebTech Inc",
    logo: "💻",
  },
  {
    id: "save2",
    title: "Mobile App Developer",
    company: "AppStudio",
    logo: "📱",
  },
];

// Profile data
export const profileData = {
  firstName: "John",
  lastName: "Doe",
  name: "John Doe",
  title: "Full Stack Developer",
  bio: "Passionate full-stack developer with 5+ years of experience building web and mobile applications. I love creating intuitive user experiences and scalable backend systems.",
};

// Skills data
export const skillsData = [
  "React", "TypeScript", "Node.js", "Python", "AWS", "Docker", "GraphQL", "MongoDB", "PostgreSQL", "Git"
];

// Experience data
export const experienceData = [
  {
    id: "exp1",
    position: "Senior Full Stack Developer",
    company: "TechCorp Inc",
    duration: "2022 - Present",
    description: "Lead development of e-commerce platform serving 10k+ users",
  },
  {
    id: "exp2",
    position: "Frontend Developer",
    company: "WebStudio",
    duration: "2020 - 2022",
    description: "Built responsive web applications using React and TypeScript",
  },
];

// Education data
export const educationData = [
  {
    id: "edu1",
    degree: "Bachelor of Computer Science",
    school: "University of Technology",
    duration: "2016 - 2020",
  },
];