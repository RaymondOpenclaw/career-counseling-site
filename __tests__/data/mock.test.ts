import { users, counselors, articles, announcements, tests, appointments, testResults } from '@/data/mock';

describe('Mock data integrity', () => {
  it('users array should have valid user objects', () => {
    expect(users.length).toBeGreaterThan(0);
    users.forEach((user) => {
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('username');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('role');
      expect(['user', 'counselor', 'admin']).toContain(user.role);
    });
  });

  it('counselors array should have valid counselor objects', () => {
    expect(counselors.length).toBeGreaterThan(0);
    counselors.forEach((c) => {
      expect(c).toHaveProperty('id');
      expect(c).toHaveProperty('name');
      expect(c).toHaveProperty('title');
      expect(c).toHaveProperty('specialty');
      expect(Array.isArray(c.specialty)).toBe(true);
      expect(c).toHaveProperty('experience');
      expect(typeof c.experience).toBe('number');
      expect(c).toHaveProperty('rating');
      expect(typeof c.rating).toBe('number');
      expect(c).toHaveProperty('price');
      expect(typeof c.price).toBe('number');
      expect(c).toHaveProperty('status');
    });
  });

  it('articles array should have valid article objects', () => {
    expect(articles.length).toBeGreaterThan(0);
    articles.forEach((a) => {
      expect(a).toHaveProperty('id');
      expect(a).toHaveProperty('title');
      expect(a).toHaveProperty('summary');
      expect(a).toHaveProperty('content');
      expect(a).toHaveProperty('category');
      expect(a).toHaveProperty('author');
      expect(typeof a.views).toBe('number');
      expect(typeof a.likes).toBe('number');
    });
  });

  it('tests should have questions with options', () => {
    expect(tests.length).toBeGreaterThan(0);
    tests.forEach((t) => {
      expect(t.questions.length).toBeGreaterThan(0);
      t.questions.forEach((q) => {
        expect(q.options.length).toBeGreaterThan(0);
        q.options.forEach((o) => {
          expect(typeof o.score).toBe('number');
        });
      });
    });
  });

  it('appointments should reference valid counselors and users', () => {
    expect(appointments.length).toBeGreaterThan(0);
    appointments.forEach((a) => {
      expect(a).toHaveProperty('status');
      expect(['pending', 'confirmed', 'completed', 'cancelled']).toContain(a.status);
    });
  });
});
