import '@testing-library/jest-dom';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    prefetch: jest.fn(),
  })),
  usePathname: jest.fn(() => '/'),
  useSearchParams: jest.fn(() => new URLSearchParams()),
  useParams: jest.fn(() => ({})),
}));

// Mock window.matchMedia for responsive components
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock localStorage with per-test isolation
const seedData = require('@/data/mock');

const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => { store[key] = value; }),
    removeItem: jest.fn((key) => { delete store[key]; }),
    clear: jest.fn(() => { store = {}; }),
    _getStore: () => store,
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Global beforeEach: clear storage and re-seed for every test
beforeEach(() => {
  localStorageMock.clear();
  localStorageMock.setItem('career_users', JSON.stringify(seedData.users || []));
  localStorageMock.setItem('career_counselors', JSON.stringify(seedData.counselors || []));
  localStorageMock.setItem('career_articles', JSON.stringify(seedData.articles || []));
  localStorageMock.setItem('career_announcements', JSON.stringify(seedData.announcements || []));
  localStorageMock.setItem('career_banners', JSON.stringify(seedData.banners || []));
  localStorageMock.setItem('career_tests', JSON.stringify(seedData.tests || []));
  localStorageMock.setItem('career_testResults', JSON.stringify(seedData.testResults || []));
  localStorageMock.setItem('career_appointments', JSON.stringify(seedData.appointments || []));
  localStorageMock.setItem('career_messages', JSON.stringify(seedData.messages || []));
});
