const { sequelize } = require('../config/db');

//# Model initializers
const User = require('./user')(sequelize);
const EmployerProfile = require('./employerProfile')(sequelize);
const FreelancerProfile = require('./freelancerProfile')(sequelize);
const Job = require('./job')(sequelize);
const Application = require('./application')(sequelize);
const Payment = require('./payment')(sequelize);
const Notification = require('./notification')(sequelize);
const Chat = require('./chat')(sequelize);
const Message = require('./message')(sequelize);
const Report = require('./report')(sequelize);
const UserJobFavorite = require('./userJobFavorite')(sequelize);
const ContactRequest = require('./contactRequest')(sequelize);

// Associations
// User 1-1 EmployerProfile
User.hasOne(EmployerProfile, { foreignKey: 'user_id', as: 'employerProfile', onDelete: 'CASCADE' });
EmployerProfile.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// User 1-1 FreelancerProfile
User.hasOne(FreelancerProfile, { foreignKey: 'user_id', as: 'freelancerProfile', onDelete: 'CASCADE' });
FreelancerProfile.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// EmployerProfile 1-N Job
EmployerProfile.hasMany(Job, { foreignKey: 'employer_id', as: 'jobs', onDelete: 'CASCADE' });
Job.belongsTo(EmployerProfile, { foreignKey: 'employer_id', as: 'employer' });

// Job 1-N Application
Job.hasMany(Application, { foreignKey: 'job_id', as: 'applications', onDelete: 'CASCADE' });
Application.belongsTo(Job, { foreignKey: 'job_id', as: 'job' });

// User 1-N Application
User.hasMany(Application, { foreignKey: 'user_id', as: 'applications', onDelete: 'CASCADE' });
Application.belongsTo(User, { foreignKey: 'user_id', as: 'applicant' });

// Job Favorites
User.hasMany(UserJobFavorite, { foreignKey: 'user_id', as: 'favorites', onDelete: 'CASCADE' });
UserJobFavorite.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Job.hasMany(UserJobFavorite, { foreignKey: 'job_id', as: 'favorites', onDelete: 'CASCADE' });
UserJobFavorite.belongsTo(Job, { foreignKey: 'job_id', as: 'job' });

// User 1-N Notification
User.hasMany(Notification, { foreignKey: 'user_id', as: 'notifications', onDelete: 'CASCADE' });
Notification.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// User 1-N Report
User.hasMany(Report, { foreignKey: 'reported_by', as: 'reports', onDelete: 'CASCADE' });
Report.belongsTo(User, { foreignKey: 'reported_by', as: 'reporter' });

// FreelancerProfile 1-N ContactRequest
FreelancerProfile.hasMany(ContactRequest, { foreignKey: 'freelancer_id', as: 'contactRequests', onDelete: 'CASCADE' });
ContactRequest.belongsTo(FreelancerProfile, { foreignKey: 'freelancer_id', as: 'freelancer' });

// Chat and Message associations
Chat.hasMany(Message, { foreignKey: 'chat_id', as: 'messages', onDelete: 'CASCADE' });
Message.belongsTo(Chat, { foreignKey: 'chat_id', as: 'chat' });

// Chat associations with User
User.hasMany(Chat, { foreignKey: 'employer_id', as: 'employerChats', onDelete: 'CASCADE' });
User.hasMany(Chat, { foreignKey: 'jobseeker_id', as: 'jobseekerChats', onDelete: 'CASCADE' });
Chat.belongsTo(User, { foreignKey: 'employer_id', as: 'employer' });
Chat.belongsTo(User, { foreignKey: 'jobseeker_id', as: 'jobseeker' });

// Chat association with Application
Application.hasOne(Chat, { foreignKey: 'application_id', as: 'chat', onDelete: 'CASCADE' });
Chat.belongsTo(Application, { foreignKey: 'application_id', as: 'application' });

module.exports = {
  sequelize,
  User,
  EmployerProfile,
  FreelancerProfile,
  Job,
  Application,
  Payment,
  Notification,
  Chat,
  Message,
  Report,
  UserJobFavorite,
  ContactRequest,
};
