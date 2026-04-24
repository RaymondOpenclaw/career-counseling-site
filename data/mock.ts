import { User, Counselor, Article, Announcement, Banner, Test, TestResult, Appointment, Message } from '@/types';

export const users: User[] = [
  { id: 'u1', username: 'zhangsan', email: 'zhangsan@example.com', role: 'user', createdAt: '2024-01-15', phone: '13800138001', passwordHash: '$2b$10$xQvAZ41SLy8J1T0Ti5XjLO0bGgYuQDKaCVzJW7H19kBqANuPQFtW6' },
  { id: 'u2', username: 'lisi', email: 'lisi@example.com', role: 'user', createdAt: '2024-02-10', phone: '13800138002', passwordHash: '$2b$10$xQvAZ41SLy8J1T0Ti5XjLO0bGgYuQDKaCVzJW7H19kBqANuPQFtW6' },
  { id: 'a1', username: 'admin', email: 'admin@example.com', role: 'admin', createdAt: '2024-01-01', passwordHash: '$2b$10$xQvAZ41SLy8J1T0Ti5XjLO0bGgYuQDKaCVzJW7H19kBqANuPQFtW6' },
  { id: 'uc1', username: 'wangzhiye', email: 'wang@example.com', role: 'counselor', createdAt: '2024-01-05', passwordHash: '$2b$10$xQvAZ41SLy8J1T0Ti5XjLO0bGgYuQDKaCVzJW7H19kBqANuPQFtW6' },
  { id: 'uc2', username: 'lizhan', email: 'li@example.com', role: 'counselor', createdAt: '2024-01-10', passwordHash: '$2b$10$xQvAZ41SLy8J1T0Ti5XjLO0bGgYuQDKaCVzJW7H19kBqANuPQFtW6' },
  { id: 'uc3', username: 'chenxinli', email: 'chen@example.com', role: 'counselor', createdAt: '2024-01-12', passwordHash: '$2b$10$xQvAZ41SLy8J1T0Ti5XjLO0bGgYuQDKaCVzJW7H19kBqANuPQFtW6' },
  { id: 'uc4', username: 'zhaohangye', email: 'zhao@example.com', role: 'counselor', createdAt: '2024-01-08', passwordHash: '$2b$10$xQvAZ41SLy8J1T0Ti5XjLO0bGgYuQDKaCVzJW7H19kBqANuPQFtW6' },
];

export const counselors: Counselor[] = [
  {
    id: 'c1',
    userId: 'uc1',
    name: '王职业',
    title: '高级职业规划师',
    specialty: ['职业转型', '简历优化', '面试辅导'],
    experience: 10,
    bio: '10年职业规划经验，帮助超过3000位求职者找到理想工作，擅长互联网、金融、咨询行业职业规划。',
    rating: 4.9,
    consultCount: 3200,
    price: 299,
    status: 'active',
  },
  {
    id: 'c2',
    userId: 'uc2',
    name: '李发展',
    title: '职业生涯导师',
    specialty: ['大学生就业', '职场晋升', '领导力发展'],
    experience: 8,
    bio: '曾在多家世界500强企业担任HRD，专注于中高层管理人员职业发展和领导力培养。',
    rating: 4.8,
    consultCount: 2100,
    price: 399,
    status: 'active',
  },
  {
    id: 'c3',
    userId: 'uc3',
    name: '陈心理',
    title: '职业心理咨询师',
    specialty: ['职业倦怠', '工作与生活平衡', '职场人际关系'],
    experience: 12,
    bio: '国家二级心理咨询师，专注于职场心理健康，帮助来访者缓解职业焦虑，重建职业自信。',
    rating: 4.9,
    consultCount: 2800,
    price: 349,
    status: 'active',
  },
  {
    id: 'c4',
    userId: 'uc4',
    name: '赵行业',
    title: '行业分析师',
    specialty: ['行业分析', '职业趋势', '技能规划'],
    experience: 6,
    bio: '深耕人工智能、新能源等新兴行业，帮助职场人把握行业趋势，制定前瞻性的职业发展路径。',
    rating: 4.7,
    consultCount: 1500,
    price: 199,
    status: 'busy',
  },
];

export const articles: Article[] = [
  {
    id: 'a1',
    title: '2024年最值得关注的10个新兴职业',
    summary: '随着AI和新能源的发展，一批新兴职业正在崛起，本文为你详细解读。',
    content: '随着技术的不断进步...',
    category: '行业趋势',
    author: '赵行业',
    authorId: 'uc4',
    views: 5200,
    likes: 320,
    createdAt: '2024-04-10',
  },
  {
    id: 'a2',
    title: '如何从执行者成长为管理者',
    summary: '职场晋升不仅仅是能力的提升，更是思维方式的转变。',
    content: '在职场中...',
    category: '职场晋升',
    author: '李发展',
    authorId: 'uc2',
    views: 3800,
    likes: 256,
    createdAt: '2024-04-08',
  },
  {
    id: 'a3',
    title: '职业倦怠的自我修复指南',
    summary: '当你感到疲惫不堪、失去工作热情时，可能是职业倦怠在作祟。',
    content: '职业倦怠是一种...',
    category: '心理健康',
    author: '陈心理',
    authorId: 'uc3',
    views: 6100,
    likes: 489,
    createdAt: '2024-04-05',
  },
  {
    id: 'a4',
    title: '应届生如何写出打动HR的简历',
    summary: '简历是求职的第一张名片，掌握这些技巧让你的简历脱颖而出。',
    content: '对于应届生来说...',
    category: '求职技巧',
    author: '王职业',
    authorId: 'uc1',
    views: 4500,
    likes: 310,
    createdAt: '2024-04-01',
  },
];

export const announcements: Announcement[] = [
  { id: 'an1', title: '网站全新改版上线', content: '我们完成了全新的改版，为您提供更好的职业咨询服务体验。', createdAt: '2024-04-15' },
  { id: 'an2', title: '五一假期服务调整通知', content: '五一假期期间预约服务正常进行，客服在线时间调整为10:00-18:00。', createdAt: '2024-04-20' },
];

export const banners: Banner[] = [
  { id: 'b1', image: '/images/banner1.jpg', title: '找到属于你的职业方向', link: '/counselors', sort: 1 },
  { id: 'b2', image: '/images/banner2.jpg', title: '专业职业测评，认识真实的自己', link: '/tests', sort: 2 },
];

export const tests: Test[] = [
  {
    id: 't1',
    title: '霍兰德职业兴趣测试',
    description: '通过6种职业兴趣类型，找到与你最匹配的职业方向。',
    category: '职业兴趣',
    questions: [
      { id: 'q1', text: '你喜欢动手操作工具或机械吗？', options: [{ id: 'o1', text: '非常喜欢', score: 3 }, { id: 'o2', text: '比较喜欢', score: 2 }, { id: 'o3', text: '一般', score: 1 }, { id: 'o4', text: '不喜欢', score: 0 }] },
      { id: 'q2', text: '你喜欢研究抽象的理论问题吗？', options: [{ id: 'o1', text: '非常喜欢', score: 3 }, { id: 'o2', text: '比较喜欢', score: 2 }, { id: 'o3', text: '一般', score: 1 }, { id: 'o4', text: '不喜欢', score: 0 }] },
      { id: 'q3', text: '你喜欢创作、设计或表演吗？', options: [{ id: 'o1', text: '非常喜欢', score: 3 }, { id: 'o2', text: '比较喜欢', score: 2 }, { id: 'o3', text: '一般', score: 1 }, { id: 'o4', text: '不喜欢', score: 0 }] },
      { id: 'q4', text: '你喜欢帮助他人解决困难吗？', options: [{ id: 'o1', text: '非常喜欢', score: 3 }, { id: 'o2', text: '比较喜欢', score: 2 }, { id: 'o3', text: '一般', score: 1 }, { id: 'o4', text: '不喜欢', score: 0 }] },
      { id: 'q5', text: '你喜欢组织和领导团队活动吗？', options: [{ id: 'o1', text: '非常喜欢', score: 3 }, { id: 'o2', text: '比较喜欢', score: 2 }, { id: 'o3', text: '一般', score: 1 }, { id: 'o4', text: '不喜欢', score: 0 }] },
      { id: 'q6', text: '你喜欢处理数据和文档吗？', options: [{ id: 'o1', text: '非常喜欢', score: 3 }, { id: 'o2', text: '比较喜欢', score: 2 }, { id: 'o3', text: '一般', score: 1 }, { id: 'o4', text: '不喜欢', score: 0 }] },
    ],
  },
  {
    id: 't2',
    title: 'MBTI职业性格测试',
    description: '了解你的性格类型，发现最适合你的职业和工作方式。',
    category: '性格测评',
    questions: [
      { id: 'q1', text: '在社交场合中，你通常：', options: [{ id: 'o1', text: '主动与人交流', score: 1 }, { id: 'o2', text: '等待别人来搭话', score: 0 }] },
      { id: 'q2', text: '你更关注：', options: [{ id: 'o1', text: '具体的事实和细节', score: 1 }, { id: 'o2', text: '可能性和整体概念', score: 0 }] },
      { id: 'q3', text: '做决定时，你更依赖：', options: [{ id: 'o1', text: '逻辑和客观分析', score: 1 }, { id: 'o2', text: '个人价值观和感受', score: 0 }] },
      { id: 'q4', text: '你更喜欢：', options: [{ id: 'o1', text: '有计划、有条理的生活', score: 1 }, { id: 'o2', text: '灵活、随性的生活', score: 0 }] },
      { id: 'q5', text: '你通常通过什么方式获取能量？', options: [{ id: 'o1', text: '与他人互动', score: 1 }, { id: 'o2', text: '独处思考', score: 0 }] },
      { id: 'q6', text: '面对新环境，你倾向于：', options: [{ id: 'o1', text: '快速适应并尝试新事物', score: 1 }, { id: 'o2', text: '先观察再行动', score: 0 }] },
    ],
  },
  {
    id: 't3',
    title: '职业价值观测试',
    description: '探索你在工作中最看重什么，帮助你做出更好的职业选择。',
    category: '价值观',
    questions: [
      { id: 'q1', text: '对你来说，高薪有多重要？', options: [{ id: 'o1', text: '非常重要', score: 3 }, { id: 'o2', text: '比较重要', score: 2 }, { id: 'o3', text: '一般', score: 1 }, { id: 'o4', text: '不重要', score: 0 }] },
      { id: 'q2', text: '你重视工作与生活平衡吗？', options: [{ id: 'o1', text: '非常重视', score: 3 }, { id: 'o2', text: '比较重视', score: 2 }, { id: 'o3', text: '一般', score: 1 }, { id: 'o4', text: '不重视', score: 0 }] },
      { id: 'q3', text: '你希望在工作中不断学习和成长吗？', options: [{ id: 'o1', text: '非常希望', score: 3 }, { id: 'o2', text: '比较希望', score: 2 }, { id: 'o3', text: '一般', score: 1 }, { id: 'o4', text: '不希望', score: 0 }] },
      { id: 'q4', text: '你重视工作的社会贡献吗？', options: [{ id: 'o1', text: '非常重视', score: 3 }, { id: 'o2', text: '比较重视', score: 2 }, { id: 'o3', text: '一般', score: 1 }, { id: 'o4', text: '不重视', score: 0 }] },
      { id: 'q5', text: '你希望在工作中拥有自主权吗？', options: [{ id: 'o1', text: '非常希望', score: 3 }, { id: 'o2', text: '比较希望', score: 2 }, { id: 'o3', text: '一般', score: 1 }, { id: 'o4', text: '不希望', score: 0 }] },
    ],
  },
];

export const testResults: TestResult[] = [
  { id: 'tr1', userId: 'u1', testId: 't1', testTitle: '霍兰德职业兴趣测试', score: 15, result: '社会型(S) - 适合教育、咨询、医疗等帮助他人的职业', createdAt: '2024-04-12' },
];

export const appointments: Appointment[] = [
  { id: 'ap1', userId: 'u1', userName: 'zhangsan', counselorId: 'c1', counselorName: '王职业', date: '2024-04-25', time: '14:00', status: 'confirmed', note: '想了解互联网行业转型', createdAt: '2024-04-18' },
  { id: 'ap2', userId: 'u1', userName: 'zhangsan', counselorId: 'c2', counselorName: '李发展', date: '2024-04-20', time: '10:00', status: 'completed', note: '职场晋升困惑', createdAt: '2024-04-15' },
];

export const messages: Message[] = [
  { id: 'm1', fromId: 'u1', toId: 'c1', content: '王老师，我想咨询一下转行的事。', createdAt: '2024-04-18 10:00' },
  { id: 'm2', fromId: 'c1', toId: 'u1', content: '好的，请说说你目前的情况。', createdAt: '2024-04-18 10:05' },
];
