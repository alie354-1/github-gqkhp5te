
import { supabase } from './supabase';

async function testDatabaseConnections() {
  console.log('Starting database connection tests...');

  try {
    // Test 1: Auth Connection
    const { data: authData, error: authError } = await supabase.auth.getSession();
    console.log('\nAuth Test:');
    if (authError) {
      console.error('❌ Auth connection failed:', authError);
    } else {
      console.log('✅ Auth connection successful');
      console.log('User:', authData.session?.user?.email);
    }

    // Test 2: Profiles Table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    console.log('\nProfiles Table Test:');
    if (profileError) {
      console.error('❌ Profiles query failed:', profileError);
    } else {
      console.log('✅ Profiles table accessible');
      console.log('Sample data:', profileData);
    }

    // Test 3: Feature Flags Table
    const { data: flagData, error: flagError } = await supabase
      .from('feature_flags')
      .select('*')
      .limit(1);

    console.log('\nFeature Flags Table Test:');
    if (flagError) {
      console.error('❌ Feature flags query failed:', flagError);
    } else {
      console.log('✅ Feature flags table accessible');
      console.log('Sample data:', flagData);
    }

  } catch (err) {
    console.error('❌ Database connection test failed with error:', err);
  }
}

testDatabaseConnections();
