import TelegramBot from 'node-telegram-bot-api';
import db from '../db/index.js';

const token = '7323936090:AAEN9Mmx02VzwdEwFb317Ykbs4LvK4fyS7I';
const groupId = -1002406299839;

let bot;
try {
  bot = new TelegramBot(token, { 
    polling: true,
    filepath: false
  });
  console.log('Bot initialized successfully');
} catch (error) {
  console.error('Failed to initialize bot:', error);
  process.exit(1);
}

async function updateDailyStats() {
  const today = new Date().toISOString().split('T')[0];
  
  try {
    const stats = await db.getStats(today);
    await db.updateDailyStats({
      date: today,
      totalMembers: stats.totalMembers,
      newMembers: stats.newToday,
      leftMembers: stats.leftToday
    });
    console.log('Daily stats updated successfully');
  } catch (error) {
    console.error('Error updating daily stats:', error);
  }
}

// Event handlers
bot.on('new_chat_members', async (msg) => {
  if (msg.chat.id !== groupId) return;
  
  for (const member of msg.new_chat_members) {
    try {
      await db.addMember(member);
      console.log(`New member added: ${member.first_name} (${member.id})`);
    } catch (error) {
      console.error(`Error processing new member ${member.id}:`, error);
    }
  }
  
  await updateDailyStats();
});

bot.on('left_chat_member', async (msg) => {
  if (msg.chat.id !== groupId) return;
  
  try {
    await db.removeMember(msg.left_chat_member.id);
    console.log(`Member left: ${msg.left_chat_member.first_name} (${msg.left_chat_member.id})`);
    await updateDailyStats();
  } catch (error) {
    console.error(`Error processing left member ${msg.left_chat_member.id}:`, error);
  }
});

// Error handling
bot.on('error', (error) => {
  console.error('Bot error:', error);
});

bot.on('polling_error', (error) => {
  console.error('Polling error:', error);
  if (error.code === 'ETELEGRAM') {
    console.log('Telegram API error, waiting before retry...');
    setTimeout(() => {
      bot.startPolling();
    }, 5000);
  }
});

// Initialization
async function init() {
  try {
    console.log('Bot started successfully');
    await updateDailyStats();
    // Update stats every hour instead of daily for more accurate data
    setInterval(updateDailyStats, 60 * 60 * 1000);
  } catch (error) {
    console.error('Error initializing bot:', error);
    process.exit(1);
  }
}

// Process handlers
process.on('SIGINT', () => {
  bot.stopPolling();
  process.exit(0);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  bot.stopPolling();
  process.exit(1);
});

init();