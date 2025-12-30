/**
 * API服务统一导出
 * 提供所有API服务的统一入口
 */
const CloudApi = require('./cloudApi.js');
const UserService = require('./userService.js');
const ClassService = require('./classService.js');
const QuestionService = require('./questionService.js');
const AssignmentService = require('./assignmentService.js');
const FeedbackService = require('./feedbackService.js');
const PracticeService = require('./practiceService.js');

module.exports = {
  CloudApi,
  UserService,
  ClassService,
  QuestionService,
  AssignmentService,
  FeedbackService,
  PracticeService
};


