
import { supabase } from './supabase';

async function testDatabaseConnection() {
  try {
    console.log('Testing database connection...');
    const { data, error } = await supabase
      .from('app_settings')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Database connection test failed:', error);
      return false;
    }

    console.log('Database connection successful:', data);
    return true;
  } catch (err) {
    console.error('Database connection error:', err);
    return false;
  }
}

testDatabaseConnection();
