import db from '../../src/models/db.js';

const cleanupExpiredSessions = async () => {
  try {
    const result = await db.query(
      `DELETE FROM session WHERE expire < NOW()`
    );
    if (result.rowCount > 0) {
      console.log(`Cleaned up ${result.rowCount} expired sessions`);
    }
  } catch (error) {
    if (error.code === '42P01') {
      console.log('Session table does not exist yet (likely first run).');
      return;
    }
    console.error('Error cleaning up sessions:', error);
  }
};

const startSessionCleanup = () => {
  cleanupExpiredSessions();
  setInterval(cleanupExpiredSessions, 24 * 60 * 60 * 1000);
};

export default startSessionCleanup;
