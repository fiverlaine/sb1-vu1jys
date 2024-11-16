import { EventEmitter } from 'events';

class InMemoryDB extends EventEmitter {
  constructor() {
    super();
    this.members = new Map();
    this.dailyStats = new Map();
    this.initializeData();
  }

  initializeData() {
    // Add some sample data for testing
    const sampleMember = {
      telegram_id: '123456789',
      username: 'testuser',
      first_name: 'Test',
      last_name: 'User',
      join_date: new Date().toISOString(),
      is_active: true
    };
    this.members.set(sampleMember.telegram_id, sampleMember);

    const today = new Date().toISOString().split('T')[0];
    this.dailyStats.set(today, {
      date: today,
      total_members: 1,
      new_members: 1,
      left_members: 0
    });
  }

  async getStats(today) {
    try {
      const activeMembers = Array.from(this.members.values()).filter(m => m.is_active);
      const joinedToday = activeMembers.filter(m => m.join_date.startsWith(today));
      const leftToday = Array.from(this.members.values()).filter(m => 
        m.leave_date?.startsWith(today)
      );

      return {
        totalMembers: activeMembers.length,
        newToday: joinedToday.length,
        leftToday: leftToday.length,
        activeUsers: activeMembers.length
      };
    } catch (error) {
      console.error('Failed to get stats:', error);
      throw new Error('Failed to retrieve statistics');
    }
  }

  async getMembers() {
    try {
      return Array.from(this.members.values())
        .sort((a, b) => new Date(b.join_date) - new Date(a.join_date))
        .slice(0, 50);
    } catch (error) {
      console.error('Failed to get members:', error);
      throw new Error('Failed to retrieve member list');
    }
  }

  async getTrends() {
    try {
      return Array.from(this.dailyStats.values())
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(-30);
    } catch (error) {
      console.error('Failed to get trends:', error);
      throw new Error('Failed to retrieve trend data');
    }
  }

  async addMember(member) {
    try {
      const telegramId = member.id.toString();
      const newMember = {
        telegram_id: telegramId,
        username: member.username,
        first_name: member.first_name,
        last_name: member.last_name,
        join_date: new Date().toISOString(),
        is_active: true,
        leave_date: null
      };

      this.members.set(telegramId, newMember);
      this.emit('memberAdded', newMember);
      return newMember;
    } catch (error) {
      console.error('Failed to add member:', error);
      throw new Error('Failed to add new member');
    }
  }

  async removeMember(telegramId) {
    try {
      const member = this.members.get(telegramId.toString());
      if (member) {
        member.is_active = false;
        member.leave_date = new Date().toISOString();
        this.members.set(telegramId.toString(), member);
        this.emit('memberRemoved', member);
        return member;
      }
    } catch (error) {
      console.error('Failed to remove member:', error);
      throw new Error('Failed to remove member');
    }
  }

  async updateDailyStats({ date, totalMembers, newMembers, leftMembers }) {
    try {
      const stats = {
        date,
        total_members: totalMembers,
        new_members: newMembers,
        left_members: leftMembers
      };
      
      this.dailyStats.set(date, stats);
      this.emit('statsUpdated', stats);
      return stats;
    } catch (error) {
      console.error('Failed to update daily stats:', error);
      throw new Error('Failed to update statistics');
    }
  }
}

export default new InMemoryDB();